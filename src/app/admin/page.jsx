import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mapParticipation, mapRaffle } from "@/lib/mappers";
import AdminPanelClient from "@/components/admin/AdminPanelClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/perfil");
  }

  const [raffles, users, participations] = await Promise.all([
    prisma.raffle.findMany({
      orderBy: { createdAt: "desc" },
      include: { winnerUser: { select: { id: true, fullName: true } } }
    }),
    prisma.user.findMany({
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
    }),
    prisma.participation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, email: true } },
        raffle: { select: { title: true } }
      }
    })
  ]);

  return (
    <AdminPanelClient
      initialRaffles={raffles.map(mapRaffle)}
      initialUsers={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
      initialParticipations={participations.map(mapParticipation)}
    />
  );
}
