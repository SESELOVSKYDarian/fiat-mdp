import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/sanitize";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/rate-limit";

function getRequestIp(req) {
  const xff = req?.headers?.["x-forwarded-for"];
  if (Array.isArray(xff)) return xff[0] || "unknown";
  if (typeof xff === "string") return xff.split(",")[0].trim();
  return req?.socket?.remoteAddress || "unknown";
}

export const authOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const ip = getRequestIp(req);
        const rate = checkRateLimit(`login:${ip}`, 10, 60_000);
        if (!rate.ok) {
          throw new Error("Demasiados intentos. Intenta nuevamente en un minuto.");
        }

        const email = normalizeEmail(credentials?.email);
        const password = String(credentials?.password || "");
        if (!email || !password) {
          throw new Error("Completá mail y contraseña.");
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error("No existe un usuario con ese mail.");
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          throw new Error("La contraseña es incorrecta.");
        }

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.role = token.role;
      }
      return session;
    }
  }
};
