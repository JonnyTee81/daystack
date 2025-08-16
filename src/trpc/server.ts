"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";

export const api = cache(async () => {
  const headersList = await headers();
  const ctx = await createTRPCContext({
    headers: headersList,
  });

  return appRouter.createCaller(ctx);
});