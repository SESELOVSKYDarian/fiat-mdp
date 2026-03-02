import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { updateRaffleSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/sanitize";
import { mapRaffle } from "@/lib/mappers";

export async function PATCH(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const parsed = updateRaffleSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
    }

    const current = await prisma.raffle.findUnique({ where: { id: params.id } });
    if (!current) {
      return Response.json({ error: "Sorteo no encontrado." }, { status: 404 });
    }

    const participationDeadline = parsed.data.participationDeadline
      ? new Date(parsed.data.participationDeadline)
      : current.participationDeadline;
    const resultDate = parsed.data.resultDate ? new Date(parsed.data.resultDate) : current.resultDate;
    if (resultDate.getTime() < participationDeadline.getTime()) {
      return Response.json({ error: "La fecha de resultado debe ser posterior o igual al cierre." }, { status: 400 });
    }

    const updated = await prisma.raffle.update({
      where: { id: params.id },
      data: {
        title: parsed.data.title ? sanitizeText(parsed.data.title, 180) : undefined,
        prize: parsed.data.prize ? sanitizeText(parsed.data.prize, 180) : undefined,
        participationDeadline,
        resultDate,
        status: parsed.data.status,
        winnerUserId: parsed.data.winnerUserId
      },
      include: {
        winnerUser: {
          select: { id: true, fullName: true }
        }
      }
    });

    return Response.json({ ok: true, item: mapRaffle(updated) });
  } catch (_error) {
    return Response.json({ error: "No se pudo actualizar el sorteo." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const current = await prisma.raffle.findUnique({ where: { id: params.id } });
    if (!current) {
      return Response.json({ error: "Sorteo no encontrado." }, { status: 404 });
    }

    await prisma.raffle.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (_error) {
    return Response.json({ error: "No se pudo eliminar el sorteo." }, { status: 500 });
  }
}
