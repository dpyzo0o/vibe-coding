# tRPC Setup Guide

This project has been configured with tRPC for type-safe API communication between the client and server.

## 📁 Project Structure

```
├── server/                     # Server-side tRPC configuration
│   ├── trpc.ts               # tRPC initialization and context
│   └── routers/              # API routers
│       ├── _app.ts           # Main app router
│       └── example.ts        # Example router with procedures
├── lib/trpc/                  # Client-side tRPC configuration
│   ├── client.ts             # tRPC React client
│   ├── provider.tsx          # tRPC Provider component
│   └── server.ts             # Server-side caller for RSC
├── app/
│   ├── api/trpc/[trpc]/     # tRPC API route handler
│   │   └── route.ts
│   └── trpc-demo/            # Demo page with examples
│       ├── page.tsx
│       ├── server-example.tsx
│       └── ...
└── components/
    └── trpc-example.tsx      # Client component example
```

## 🚀 Quick Start

### Access the Demo

Visit http://localhost:3000/trpc-demo to see tRPC in action with:

- Server Component data fetching
- Client Component queries and mutations
- Real-time updates
- Error handling

### Creating New Procedures

1. **Add a new router** in `server/routers/`:

```typescript
// server/routers/users.ts
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const usersRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Your logic here
      return { id: input.id, name: 'User' };
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      // Create user logic
      return { id: '1', ...input };
    }),
});
```

2. **Register the router** in `server/routers/_app.ts`:

```typescript
import { usersRouter } from './users';

export const appRouter = router({
  example: exampleRouter,
  users: usersRouter, // Add your router here
});
```

### Using tRPC in Components

#### Client Components

```typescript
'use client';
import { trpc } from '@/lib/trpc/client';

function MyComponent() {
  // Query
  const { data, isLoading } = trpc.example.hello.useQuery({ name: 'World' });

  // Mutation
  const createPost = trpc.example.createPost.useMutation();

  return <div>{data?.greeting}</div>;
}
```

#### Server Components

```typescript
import { api } from '@/lib/trpc/server';

async function ServerComponent() {
  const data = await api.example.hello({ name: 'Server' });
  return <div>{data.greeting}</div>;
}
```

## 🔧 Key Features

### Type Safety

- Full type inference from backend to frontend
- Automatic TypeScript types for all procedures
- Compile-time error checking

### Data Validation

- Zod schemas for input/output validation
- Automatic error handling and formatting

### Optimized for Next.js

- Server Components support with direct procedure calls
- Client Components with React Query integration
- Automatic request batching

### Developer Experience

- Hot reload preserves types
- Detailed error messages in development
- Logger for debugging

## 📚 Common Patterns

### Protected Procedures

Use the `protectedProcedure` in `server/trpc.ts` for authenticated routes:

```typescript
export const protectedRouter = router({
  secretData: protectedProcedure.query(async ({ ctx }) => {
    // ctx contains authenticated user info
    return { secret: 'data' };
  }),
});
```

### Error Handling

```typescript
// In procedures
throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'User not found',
});

// In components
const { error } = trpc.users.getById.useQuery({ id: '1' });
if (error) {
  console.error(error.message);
}
```

### Optimistic Updates

```typescript
const utils = trpc.useUtils();
const createPost = trpc.posts.create.useMutation({
  onMutate: async newPost => {
    // Cancel outgoing refetches
    await utils.posts.list.cancel();

    // Optimistically update
    const previousPosts = utils.posts.list.getData();
    utils.posts.list.setData(undefined, old => [...old, newPost]);

    return { previousPosts };
  },
  onError: (err, newPost, context) => {
    // Rollback on error
    utils.posts.list.setData(undefined, context.previousPosts);
  },
  onSettled: () => {
    // Refetch after error or success
    utils.posts.list.invalidate();
  },
});
```

## 🔗 Resources

- [tRPC Documentation](https://trpc.io/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🎯 Next Steps

1. Add authentication to protect certain procedures
2. Connect to a database for persistent data
3. Implement real-time subscriptions with WebSockets
4. Add more complex data relationships
5. Set up error monitoring and logging
