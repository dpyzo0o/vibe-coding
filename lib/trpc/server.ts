import 'server-only';

import { cache } from 'react';

import { createCaller } from '@/server/routers/_app';
import { createContext } from '@/server/trpc';

/**
 * This wraps the `createContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContextCached = cache(async () => {
  return createContext();
});

/**
 * This is how you call tRPC procedures from React Server Components.
 * It's a wrapper around the `createCaller` function from your router.
 */
export const api = createCaller(createContextCached);
