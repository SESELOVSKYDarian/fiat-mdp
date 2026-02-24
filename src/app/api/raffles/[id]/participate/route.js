import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { participateSchema } from "@/lib/validators";
import { normalizePlate, sanitizeText } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";
import { mapParticipation } from "@/lib/mappers";

function ipFromHeaders(request) {
  const xff = request.headers.get("x-forwarded-for");
  return xff ? xff.split(",")[0].trim() : "unknown";
}

export async function POST(request, { params }) {
  const { session, error } = await requireSession();
  if (error) return error;
  try {
    const rate = checkRateLimit(`participate:${ipFromHeaders(request)}:${session.user.id}`, 20, 60_000);
    if (!rate.ok) {
      return Response.json({ error: "Demasiados intentos. Intenta nuevamente en un minuto." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = participateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
    }

    const raffle = await prisma.raffle.findUnique({ where: { id: params.id } });
    if (!raffle) return Response.json({ error: "Sorteo no encontrado." }, { status: 404 });
    if (raffle.status !== "OPEN") {
      return Response.json({ error: "Este sorteo no esta abierto." }, { status: 400 });
    }
    if (new Date().getTime() > raffle.participationDeadline.getTime()) {
      return Response.json({ error: "La fecha limite de participacion ya vencio." }, { status: 400 });
    }

    const existing = await prisma.participation.findUnique({
      where: {
        raffleId_userId: {
          raffleId: params.id,
          userId: session.user.id
        }
      }
    });
    if (existing) {
      return Response.json({ error: "Ya participaste en este sorteo." }, { status: 409 });
    }

    const created = await prisma.participation.create({
      data: {
        raffleId: params.id,
        userId: session.user.id,
        reason: sanitizeText(parsed.data.reason, 500),
        hasFiatGiama: parsed.data.hasFiatGiama,
        plate: parsed.data.hasFiatGiama ? normalizePlate(parsed.data.plate) : null,
        validationStatus: parsed.data.hasFiatGiama ? "PENDING" : "VERIFIED"
      },
      include: {
        user: { select: { fullName: true, email: true } },
        raffle: { select: { title: true } }
      }
    });

    return Response.json({ ok: true, item: mapParticipation(created) }, { status: 201 });
  } catch (_error) {
    return Response.json({ error: "No se pudo registrar la participacion." }, { status: 500 });
  }
}
