import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { pickWinnerSchema } from "@/lib/validators";

export async function POST(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const parsed = pickWinnerSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
    }

    const raffle = await prisma.raffle.findUnique({ where: { id: params.id } });
    if (!raffle) return Response.json({ error: "Sorteo no encontrado." }, { status: 404 });

    let winnerUserId = null;

    if (parsed.data.mode === "MANUAL") {
      if (!parsed.data.participationId) {
        return Response.json({ error: "Debes indicar la participacion ganadora." }, { status: 400 });
      }
      const participation = await prisma.participation.findUnique({
        where: { id: parsed.data.participationId }
      });
      if (!participation || participation.raffleId !== params.id) {
        return Response.json({ error: "Participacion invalida para este sorteo." }, { status: 400 });
      }
      winnerUserId = participation.userId;
    } else {
      const entries = await prisma.participation.findMany({
        where: {
          raffleId: params.id,
          OR: [{ validationStatus: "VERIFIED" }, { hasFiatGiama: false }]
        }
      });
      if (entries.length === 0) {
        return Response.json({ error: "No hay participaciones validas para sorteo aleatorio." }, { status: 400 });
      }
      const random = entries[Math.floor(Math.random() * entries.length)];
      winnerUserId = random.userId;
    }

    const updated = await prisma.raffle.update({
      where: { id: params.id },
      data: {
        winnerUserId,
        status: "RESULT_PUBLISHED"
      },
      include: {
        winnerUser: {
          select: { id: true, fullName: true, email: true }
        }
      }
    });

    return Response.json({
      ok: true,
      winner: updated.winnerUser,
      raffleId: updated.id
    });
  } catch (_error) {
    return Response.json({ error: "No se pudo elegir ganador." }, { status: 500 });
  }
}
