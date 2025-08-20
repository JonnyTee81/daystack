import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const habitsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.habit.findMany({
      where: {
        userId: ctx.session.user.id,
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        type: z.enum(["boolean", "quantity"]),
        target: z.number().nullable().optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const maxOrder = await ctx.db.habit.findFirst({
        where: { userId: ctx.session.user.id },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      return ctx.db.habit.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          order: (maxOrder?.order ?? -1) + 1,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        type: z.enum(["boolean", "quantity"]).optional(),
        target: z.number().nullable().optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db.habit.update({
        where: {
          id,
          userId: ctx.session.user.id,
        },
        data: updateData,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.habit.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          isActive: false,
        },
      });
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        habitIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updates = input.habitIds.map((id, index) =>
        ctx.db.habit.update({
          where: {
            id,
            userId: ctx.session.user.id,
          },
          data: {
            order: index,
          },
        })
      );

      return ctx.db.$transaction(updates);
    }),

  updateLog: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        date: z.date(),
        completed: z.boolean(),
        value: z.number().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // First, ensure we have a daily metric record for this date
      const dailyMetric = await ctx.db.dailyMetric.upsert({
        where: {
          userId_date: {
            userId: ctx.session.user.id,
            date: input.date,
          },
        },
        update: {},
        create: {
          userId: ctx.session.user.id,
          date: input.date,
          mood: 5,
          energy: 5,
          productivity: 5,
          momentum: 5,
        },
      });

      // Then upsert the habit log
      return ctx.db.habitLog.upsert({
        where: {
          habitId_metricId: {
            habitId: input.habitId,
            metricId: dailyMetric.id,
          },
        },
        update: {
          completed: input.completed,
          value: input.value,
        },
        create: {
          habitId: input.habitId,
          metricId: dailyMetric.id,
          completed: input.completed,
          value: input.value,
        },
      });
    }),
});