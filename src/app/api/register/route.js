import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import { normalizeEmail, sanitizeText } from "@/lib/sanitize";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
    }

    const email = normalizeEmail(parsed.data.email);
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return Response.json({ error: "Ese mail ya esta registrado." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        fullName: sanitizeText(parsed.data.fullName, 120),
        dni: sanitizeText(parsed.data.dni, 20),
        city: sanitizeText(parsed.data.city, 100),
        email,
        phone: sanitizeText(parsed.data.phone || "", 30) || null,
        passwordHash,
        role: "USER"
      },
      select: {
        id: true,
        fullName: true,
        email: true
      }
    });

    return Response.json({ ok: true, user }, { status: 201 });
  } catch (_error) {
    return Response.json({ error: "No se pudo registrar el usuario." }, { status: 500 });
  }
}
