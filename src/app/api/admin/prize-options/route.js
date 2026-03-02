import { hasPrizeOptionModel, prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { createPrizeOptionSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/sanitize";
import { mapPrizeOption } from "@/lib/mappers";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!hasPrizeOptionModel()) {
    return Response.json({ items: [] });
  }

  try {
    const items = await prisma.prizeOption.findMany({
      orderBy: { createdAt: "desc" }
    });
    return Response.json({ items: items.map(mapPrizeOption) });
  } catch (_error) {
    return Response.json({ error: "No se pudieron obtener los premios posibles." }, { status: 500 });
  }
}

export async function POST(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  if (!hasPrizeOptionModel()) {
    return Response.json(
      { error: "Falta actualizar la base de datos para premios posibles. Ejecuta migraciones y redeploy." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = createPrizeOptionSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
    }

    const created = await prisma.prizeOption.create({
      data: {
        name: sanitizeText(parsed.data.name, 180),
        createdById: session.user.id
      }
    });

    return Response.json({ ok: true, item: mapPrizeOption(created) }, { status: 201 });
  } catch (_error) {
    return Response.json({ error: "No se pudo crear el premio posible." }, { status: 500 });
  }
}
