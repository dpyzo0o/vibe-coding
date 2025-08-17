import { router } from '../trpc';
import { exampleRouter } from './example';

/**
 * This is the primary router for your server.
 *
 * All routers added in /server/routers should be manually added here.
 */
export const appRouter = router({
  example: exampleRouter,
  // Add more routers here as you create them
});

// Export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.example.hello({ name: "from server" });
 */
export const createCaller = appRouter.createCaller;
