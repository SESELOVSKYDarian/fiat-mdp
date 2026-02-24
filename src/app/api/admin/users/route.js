import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        dni: true,
        city: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
    return Response.json({
      items: users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString()
      }))
    });
  } catch (_error) {
    return Response.json({ error: "No se pudieron obtener los usuarios." }, { status: 500 });
  }
}
