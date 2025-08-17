import { api } from '@/lib/trpc/server';

export async function ServerExample() {
  // This runs on the server and fetches data directly
  const hello = await api.example.hello({ name: 'Server Component' });
  const posts = await api.example.listPosts({ limit: 3 });

  return (
    <div className="border rounded-lg p-6 space-y-4 bg-blue-50 dark:bg-blue-950/20">
      <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">
        Server Component Example
      </h2>
      <p className="text-sm text-blue-700 dark:text-blue-300">
        This component fetches data on the server using tRPC directly (no HTTP
        request).
      </p>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-blue-800 dark:text-blue-200">
            Server Says:
          </h3>
          <p className="text-blue-600 dark:text-blue-400">{hello.greeting}</p>
          <p className="text-xs text-blue-500 dark:text-blue-500">
            {hello.timestamp}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-blue-800 dark:text-blue-200">
            Latest Posts (Server-fetched):
          </h3>
          <div className="space-y-2 mt-2">
            {posts.posts.map(post => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-900 p-2 rounded border border-blue-200 dark:border-blue-800"
              >
                <h4 className="font-medium text-sm">{post.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
