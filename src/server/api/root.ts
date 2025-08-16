import { createTRPCRouter } from "@/server/api/trpc";
import { metricsRouter } from "@/server/api/routers/metrics";
import { habitsRouter } from "@/server/api/routers/habits";

export const appRouter = createTRPCRouter({
  metrics: metricsRouter,
  habits: habitsRouter,
});

export type AppRouter = typeof appRouter;