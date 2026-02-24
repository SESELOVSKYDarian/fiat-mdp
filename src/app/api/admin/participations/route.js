import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { mapParticipation } from "@/lib/mappers";

export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const raffleId = searchParams.get("raffleId");

    const items = await prisma.participation.findMany({
      where: raffleId ? { raffleId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, email: true } },
        raffle: { select: { title: true } }
      }
    });
    return Response.json({ items: items.map(mapParticipation) });
  } catch (_error) {
    return Response.json({ error: "No se pudieron obtener participaciones." }, { status: 500 });
  }
}
