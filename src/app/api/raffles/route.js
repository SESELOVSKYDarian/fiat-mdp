import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { createRaffleSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/sanitize";
import { mapRaffle } from "@/lib/mappers";

export async function GET() {
  try {
    const raffles = await prisma.raffle.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        winnerUser: {
          select: { id: true, fullName: true }
        }
      }
    });
    return Response.json({ items: raffles.map(mapRaffle) });
  } catch (_error) {
    return Response.json({ error: "No se pudieron obtener los sorteos." }, { status: 500 });
  }
}

export async function POST(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const parsed = createRaffleSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
    }

    const raffle = await prisma.raffle.create({
      data: {
        title: sanitizeText(parsed.data.title, 180),
        prize: sanitizeText(parsed.data.prize, 180),
        participationDeadline: new Date(parsed.data.participationDeadline),
        resultDate: new Date(parsed.data.resultDate),
        status: parsed.data.status || "OPEN",
        createdById: session.user.id
      },
      include: {
        winnerUser: {
          select: { id: true, fullName: true }
        }
      }
    });

    return Response.json({ ok: true, item: mapRaffle(raffle) }, { status: 201 });
  } catch (_error) {
    return Response.json({ error: "No se pudo crear el sorteo." }, { status: 500 });
  }
}
