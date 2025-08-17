import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db";
import { authOptions } from "@/server/auth";

interface CreateContextOptions {
  session: Session | null;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createTRPCContext = async (_opts: {
  headers: Headers;
} | CreateNextContextOptions) => {
  // For App Router, we'll get the session in the middleware instead
  return createInnerTRPCContext({
    session: null,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  // Get session dynamically for App Router
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  
  return next({
    ctx: {
      session: { ...session, user: session.user },
      db: ctx.db,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);