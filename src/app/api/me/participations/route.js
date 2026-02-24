import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { mapParticipation } from "@/lib/mappers";

export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;
  try {
    const items = await prisma.participation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, email: true } },
        raffle: { select: { title: true } }
      }
    });
    return Response.json({ items: items.map(mapParticipation) });
  } catch (_error) {
    return Response.json({ error: "No se pudieron obtener tus participaciones." }, { status: 500 });
  }
}
