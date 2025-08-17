import { Suspense } from 'react';

import { TRPCExample } from '@/components/trpc-example';

import { ServerExample } from './server-example';

export default function TRPCDemoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">tRPC Demo Page</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          This page demonstrates the tRPC integration with Next.js App Router.
          Try the examples below to see queries and mutations in action.
        </p>

        {/* Server Component Example */}
        <div className="max-w-4xl mx-auto mb-8">
          <Suspense
            fallback={<div className="text-center">Loading server data...</div>}
          >
            <ServerExample />
          </Suspense>
        </div>

        {/* Client Component Example */}
        <TRPCExample />
      </div>
    </div>
  );
}
