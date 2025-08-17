import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';

/**
 * Context used for all requests
 * You can add things like database connections, user sessions, etc. here
 */
export const createContext = async () => {
  return {
    // Add your context properties here
    // For example:
    // - Database connection
    // - User session
    // - Request headers
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  /**
   * @see https://trpc.io/docs/server/error-formatting
   */
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure
 * You can add authentication logic here
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Add your authentication logic here
  // For example:
  // if (!ctx.session?.user) {
  //   throw new TRPCError({ code: 'UNAUTHORIZED' });
  // }

  return next({
    ctx: {
      // Pass the context with authenticated user
      ...ctx,
    },
  });
});
