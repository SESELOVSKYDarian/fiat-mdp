const { PrismaClient, UserRole, RaffleStatus } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEFAULT_RULES =
  "Con su uso, estas aceptando que estas entradas entregads por Tornes y Competencias S. A. son intransferibles, solo para la empresa/persona destinataria, sus empleados, funcionarios y otros fines institucionales y promocionales. Se entregan sujetas a las regulaciones dispuestas por las autoridades correspondientes, en particular en materia sanitaria.";

async function main() {
  const isDev = process.env.NODE_ENV !== "production";
  const adminEmail = process.env.ADMIN_EMAIL || (isDev ? "admin" : "");
  const adminPassword = process.env.ADMIN_PASSWORD || (isDev ? "admin" : "");

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD son obligatorios para seed.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      fullName: "Administrador",
      passwordHash,
      role: UserRole.ADMIN
    },
    create: {
      fullName: "Administrador",
      email: adminEmail,
      passwordHash,
      dni: "00000000",
      city: "Buenos Aires",
      phone: null,
      role: UserRole.ADMIN
    }
  });

  await prisma.rulesConfig.upsert({
    where: { id: "default" },
    update: {
      text: DEFAULT_RULES,
      updatedById: admin.id
    },
    create: {
      id: "default",
      text: DEFAULT_RULES,
      updatedById: admin.id
    }
  });

  const raffles = [
    {
      title: "Entradas Final Copa Argentina",
      prize: "2 entradas oficiales",
      participationDeadline: new Date("2026-03-20T23:59:59.000Z"),
      resultDate: new Date("2026-03-24T16:00:00.000Z")
    },
    {
      title: "Experiencia VIP + Hospitality",
      prize: "Acceso institucional",
      participationDeadline: new Date("2026-03-10T23:59:59.000Z"),
      resultDate: new Date("2026-03-13T16:00:00.000Z")
    }
  ];

  const prizeOptions = ["2 entradas oficiales", "Acceso institucional"];
  for (const name of prizeOptions) {
    await prisma.prizeOption.upsert({
      where: { name },
      update: { name, createdById: admin.id },
      create: { name, createdById: admin.id }
    });
  }

  for (const raffle of raffles) {
    const seedId = raffle.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-seed";
    await prisma.raffle.upsert({
      where: { id: seedId },
      update: {
        title: raffle.title,
        prize: raffle.prize,
        participationDeadline: raffle.participationDeadline,
        resultDate: raffle.resultDate,
        status: RaffleStatus.OPEN,
        createdById: admin.id
      },
      create: {
        id: seedId,
        title: raffle.title,
        prize: raffle.prize,
        participationDeadline: raffle.participationDeadline,
        resultDate: raffle.resultDate,
        status: RaffleStatus.OPEN,
        createdById: admin.id
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
