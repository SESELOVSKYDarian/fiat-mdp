import { hasPrizeOptionModel, prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { updatePrizeOptionSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/sanitize";
import { mapPrizeOption } from "@/lib/mappers";

export async function PATCH(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!hasPrizeOptionModel()) {
    return Response.json(
      { error: "Falta actualizar la base de datos para premios posibles. Ejecuta migraciones y redeploy." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = updatePrizeOptionSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
    }

    const current = await prisma.prizeOption.findUnique({ where: { id: params.id } });
    if (!current) {
      return Response.json({ error: "Premio posible no encontrado." }, { status: 404 });
    }

    const updated = await prisma.prizeOption.update({
      where: { id: params.id },
      data: { name: sanitizeText(parsed.data.name, 180) }
    });

    return Response.json({ ok: true, item: mapPrizeOption(updated) });
  } catch (_error) {
    return Response.json({ error: "No se pudo actualizar el premio posible." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!hasPrizeOptionModel()) {
    return Response.json(
      { error: "Falta actualizar la base de datos para premios posibles. Ejecuta migraciones y redeploy." },
      { status: 503 }
    );
  }

  try {
    const current = await prisma.prizeOption.findUnique({ where: { id: params.id } });
    if (!current) {
      return Response.json({ error: "Premio posible no encontrado." }, { status: 404 });
    }

    await prisma.prizeOption.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (_error) {
    return Response.json({ error: "No se pudo eliminar el premio posible." }, { status: 500 });
  }
}
