import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: new Response(JSON.stringify({ error: "No autenticado." }), { status: 401 }) };
  }
  return { session };
}

export async function requireAdmin() {
  const { session, error } = await requireSession();
  if (error) return { error };
  if (session.user.role !== "ADMIN") {
    return { error: new Response(JSON.stringify({ error: "Acceso denegado." }), { status: 403 }) };
  }
  return { session };
}
