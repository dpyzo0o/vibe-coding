import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const exampleRouter = router({
  // Simple query example
  hello: publicProcedure
    .input(
      z
        .object({
          name: z.string().optional(),
        })
        .optional()
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.name ?? 'World'}!`,
        timestamp: new Date().toISOString(),
      };
    }),

  // Query with validation
  getUser: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      // Simulate fetching a user from a database
      return {
        id: input.id,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date().toISOString(),
      };
    }),

  // Mutation example
  createPost: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        content: z.string().min(1),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      // Simulate creating a post in a database
      const post = {
        id: Math.random().toString(36).substring(7),
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return post;
    }),

  // List query with pagination
  listPosts: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(10),
          cursor: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? 10;

      // Simulate fetching posts from a database
      const posts = Array.from({ length: limit }, (_, i) => ({
        id: `post-${i}`,
        title: `Post ${i + 1}`,
        content: `This is the content of post ${i + 1}`,
        published: Math.random() > 0.5,
        createdAt: new Date(
          Date.now() - Math.random() * 10000000000
        ).toISOString(),
      }));

      return {
        posts,
        nextCursor: posts.length === limit ? `cursor-${Date.now()}` : undefined,
      };
    }),
});
