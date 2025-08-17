'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc/client';

export function TRPCExample() {
  const [name, setName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  // Query example
  const helloQuery = trpc.example.hello.useQuery(name ? { name } : undefined, {
    enabled: true, // Always enabled, will use "World" if no name
  });

  // List posts with pagination
  const postsQuery = trpc.example.listPosts.useQuery({
    limit: 5,
  });

  // Mutation example
  const createPostMutation = trpc.example.createPost.useMutation({
    onSuccess: data => {
      alert(`Post created with ID: ${data.id}`);
      setPostTitle('');
      setPostContent('');
      // Refetch posts after creating a new one
      postsQuery.refetch();
    },
    onError: error => {
      alert(`Error creating post: ${error.message}`);
    },
  });

  const handleCreatePost = () => {
    if (postTitle && postContent) {
      createPostMutation.mutate({
        title: postTitle,
        content: postContent,
        published: true,
      });
    }
  };

  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold">tRPC Example Component</h2>

        {/* Query Example */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Query Example</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border rounded px-3 py-1 flex-1"
            />
          </div>
          {helloQuery.isLoading && <p>Loading...</p>}
          {helloQuery.error && (
            <p className="text-red-500">Error: {helloQuery.error.message}</p>
          )}
          {helloQuery.data && (
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <p className="font-medium">{helloQuery.data.greeting}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {helloQuery.data.timestamp}
              </p>
            </div>
          )}
        </div>

        {/* Mutation Example */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Mutation Example - Create Post
          </h3>
          <input
            type="text"
            placeholder="Post title"
            value={postTitle}
            onChange={e => setPostTitle(e.target.value)}
            className="border rounded px-3 py-1 w-full"
          />
          <textarea
            placeholder="Post content"
            value={postContent}
            onChange={e => setPostContent(e.target.value)}
            className="border rounded px-3 py-1 w-full h-24"
          />
          <Button
            onClick={handleCreatePost}
            disabled={
              createPostMutation.isPending || !postTitle || !postContent
            }
          >
            {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
          </Button>
        </div>

        {/* List Query Example */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">List Posts</h3>
          {postsQuery.isLoading && <p>Loading posts...</p>}
          {postsQuery.error && (
            <p className="text-red-500">Error: {postsQuery.error.message}</p>
          )}
          {postsQuery.data && (
            <div className="space-y-2">
              {postsQuery.data.posts.map(post => (
                <div
                  key={post.id}
                  className="border rounded p-3 bg-gray-50 dark:bg-gray-900"
                >
                  <h4 className="font-semibold">{post.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {post.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Published: {post.published ? 'Yes' : 'No'} | Created:{' '}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {postsQuery.data.nextCursor && (
                <p className="text-sm text-gray-500">More posts available...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Debug Info */}
      <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(
            {
              helloQuery: {
                status: helloQuery.status,
                data: helloQuery.data,
              },
              postsQuery: {
                status: postsQuery.status,
                dataLength: postsQuery.data?.posts.length,
              },
              createPostMutation: {
                status: createPostMutation.status,
              },
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
