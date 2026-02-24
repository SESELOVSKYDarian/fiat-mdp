import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3).max(120),
  dni: z.string().min(6).max(20),
  city: z.string().min(2).max(100),
  email: z.string().email().max(160),
  phone: z.string().max(30).optional().or(z.literal("")),
  password: z.string().min(4).max(72)
});

export const createRaffleSchema = z
  .object({
    title: z.string().min(3).max(180),
    prize: z.string().min(2).max(180),
    participationDeadline: z.string().datetime(),
    resultDate: z.string().datetime(),
    status: z.enum(["DRAFT", "OPEN", "CLOSED", "RESULT_PUBLISHED"]).optional()
  })
  .refine((data) => new Date(data.resultDate).getTime() >= new Date(data.participationDeadline).getTime(), {
    message: "La fecha de resultado debe ser igual o posterior al cierre."
  });

export const updateRaffleSchema = z
  .object({
    title: z.string().min(3).max(180).optional(),
    prize: z.string().min(2).max(180).optional(),
    participationDeadline: z.string().datetime().optional(),
    resultDate: z.string().datetime().optional(),
    status: z.enum(["DRAFT", "OPEN", "CLOSED", "RESULT_PUBLISHED"]).optional(),
    winnerUserId: z.string().uuid().nullable().optional()
  })
  .refine(
    (data) =>
      !data.participationDeadline ||
      !data.resultDate ||
      new Date(data.resultDate).getTime() >= new Date(data.participationDeadline).getTime(),
    {
      message: "La fecha de resultado debe ser igual o posterior al cierre."
    }
  );

export const participateSchema = z
  .object({
    reason: z.string().min(5).max(500),
    hasFiatGiama: z.boolean(),
    plate: z.string().max(20).optional().nullable()
  })
  .refine((data) => !data.hasFiatGiama || (data.plate && data.plate.trim().length >= 5), {
    message: "Debes informar patente si declaras auto Fiat Giama."
  });

export const pickWinnerSchema = z.object({
  mode: z.enum(["MANUAL", "RANDOM"]),
  participationId: z.string().uuid().optional()
});
