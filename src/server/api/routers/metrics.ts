import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const metricsRouter = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        mood: z.number().min(1).max(10),
        energy: z.number().min(1).max(10),
        productivity: z.number().min(1).max(10),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { date, mood, energy, productivity, note } = input;
      const momentum = (mood + energy + productivity) / 3;

      return ctx.db.dailyMetric.upsert({
        where: {
          userId_date: {
            userId: ctx.session.user.id,
            date,
          },
        },
        update: {
          mood,
          energy,
          productivity,
          note,
          momentum,
        },
        create: {
          userId: ctx.session.user.id,
          date,
          mood,
          energy,
          productivity,
          note,
          momentum,
        },
      });
    }),

  getDay: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.dailyMetric.findUnique({
        where: {
          userId_date: {
            userId: ctx.session.user.id,
            date: input.date,
          },
        },
        include: {
          habitLogs: {
            include: {
              habit: true,
            },
          },
        },
      });
    }),

  getRange: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.dailyMetric.findMany({
        where: {
          userId: ctx.session.user.id,
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        include: {
          habitLogs: {
            include: {
              habit: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    }),
});