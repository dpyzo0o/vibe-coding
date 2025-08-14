'use client';

import { useState, useEffect } from 'react';
import { marked, lexer, Token } from 'marked';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JsonView } from '@/components/json-view';
import Link from 'next/link';
import { initialMarkdownContent } from './initial-content';

type OutputView = 'preview' | 'html' | 'tokens';

export default function MarkedDemo() {
  const [markdown, setMarkdown] = useState(initialMarkdownContent);

  const [html, setHtml] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [outputView, setOutputView] = useState<OutputView>('preview');

  useEffect(() => {
    const parseMarkdown = async () => {
      const parsed = await marked(markdown);
      setHtml(parsed);

      // Generate tokens using the lexer
      const tokenList = lexer(markdown);
      setTokens(tokenList);
    };
    parseMarkdown();
  }, [markdown]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Marked Parser</h1>
          <Link href="/">
            <Button variant="outline" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        {/* Left Column - Markdown Input */}
        <div className="w-full lg:w-1/2 flex flex-col border rounded-lg overflow-hidden">
          <div className="border-b px-6 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
            <h2 className="font-semibold">Markdown Input</h2>
            <Button variant="outline" size="sm" onClick={() => setMarkdown('')}>
              Clear
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <textarea
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none dark:bg-gray-900"
              placeholder="Enter your markdown here..."
            />
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="w-full lg:w-1/2 flex flex-col border rounded-lg overflow-hidden">
          <div className="border-b px-6 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
            <h2 className="font-semibold">Output</h2>
            <div className="flex items-center gap-3">
              {(outputView === 'html' || outputView === 'tokens') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (outputView === 'html') {
                      navigator.clipboard.writeText(html);
                    } else if (outputView === 'tokens') {
                      navigator.clipboard.writeText(
                        JSON.stringify(tokens, null, 2)
                      );
                    }
                  }}
                >
                  Copy
                </Button>
              )}
              <Select
                value={outputView}
                onValueChange={value => setOutputView(value as OutputView)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preview">HTML Preview</SelectItem>
                  <SelectItem value="html">Raw HTML</SelectItem>
                  <SelectItem value="tokens">Tokens JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {/* HTML Preview */}
            {outputView === 'preview' && (
              <div className="p-6 bg-white dark:bg-gray-900 min-h-full">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            )}

            {/* Raw HTML */}
            {outputView === 'html' && (
              <pre className="p-6 bg-gray-50 dark:bg-gray-900 overflow-x-auto min-h-full">
                <code className="text-sm font-mono">{html}</code>
              </pre>
            )}

            {/* Tokens JSON */}
            {outputView === 'tokens' && (
              <div className="p-6 bg-gray-50 dark:bg-gray-900 overflow-auto min-h-full">
                <JsonView data={tokens} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
