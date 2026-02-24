import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (!token) return false;
        if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
          return token.role === "ADMIN";
        }
        return true;
      }
    }
  }
);

export const config = {
  matcher: ["/admin/:path*", "/perfil/:path*", "/api/admin/:path*"]
};
