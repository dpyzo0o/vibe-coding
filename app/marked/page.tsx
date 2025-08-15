'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { initialMarkdownContent } from './initial-content';
import { usePanelResize } from '@/hooks/use-panel-resize';
import { useIsLargeScreen } from '@/hooks/use-media-query';
import { useDebounce } from '@/hooks/use-debounce';

type OutputView = 'preview' | 'html' | 'tokens';

export default function MarkedDemo() {
  const [markdown, setMarkdown] = useState(initialMarkdownContent);
  const [html, setHtml] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [outputView, setOutputView] = useState<OutputView>('preview');

  // Debounce the markdown input to improve performance
  const debouncedMarkdown = useDebounce(markdown, 300);

  // Use the media query hook for responsive design
  const isLargeScreen = useIsLargeScreen();

  // Use the panel resize hook
  const { leftPanelWidth, rightPanelWidth, containerRef, handleMouseDown } =
    usePanelResize({
      defaultWidth: 50,
      minWidth: 20,
      maxWidth: 80,
    });

  // Parse markdown only when debounced value changes
  useEffect(() => {
    const parseMarkdown = async () => {
      const parsed = await marked(debouncedMarkdown);
      setHtml(parsed);

      // Generate tokens using the lexer
      const tokenList = lexer(debouncedMarkdown);
      setTokens(tokenList);
    };
    parseMarkdown();
  }, [debouncedMarkdown]);

  // Memoize the textarea rows calculation
  const textareaRows = useMemo(() => {
    return Math.max(30, markdown.split('\n').length + 5);
  }, [markdown]);

  // Memoize the handleClear function
  const handleClear = useCallback(() => {
    setMarkdown('');
  }, []);

  // Memoize the handleCopy function
  const handleCopy = useCallback(() => {
    if (outputView === 'html') {
      navigator.clipboard.writeText(html);
    } else if (outputView === 'tokens') {
      navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
    }
  }, [outputView, html, tokens]);

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
      <div
        ref={containerRef}
        className="flex-1 flex flex-col lg:flex-row p-4 relative min-h-0"
      >
        {/* Left Column - Markdown Input */}
        <div
          className="flex flex-col border rounded-lg min-h-0 overflow-hidden"
          style={{
            width: isLargeScreen ? `calc(${leftPanelWidth}% - 12px)` : '100%',
            height: isLargeScreen ? '100%' : 'auto',
          }}
        >
          <div className="border-b px-6 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900 flex-shrink-0">
            <h2 className="font-semibold">Markdown Input</h2>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <textarea
                value={markdown}
                onChange={e => setMarkdown(e.target.value)}
                className="w-full p-4 font-mono text-sm resize-none focus:outline-none dark:bg-gray-900 border-none overflow-hidden"
                placeholder="Enter your markdown here..."
                rows={textareaRows}
                style={{ minHeight: '100%' }}
              />
            </ScrollArea>
          </div>
        </div>

        {/* Draggable Divider - Only show on large screens */}
        <div
          className="hidden lg:flex items-center justify-center w-6 cursor-col-resize select-none group"
          onMouseDown={handleMouseDown}
        >
          <div className="w-1 h-full bg-gray-200 dark:bg-gray-700 rounded-full group-hover:bg-blue-500 transition-colors" />
        </div>

        {/* Right Column - Output */}
        <div
          className="flex flex-col border rounded-lg min-h-0 mt-4 lg:mt-0 overflow-hidden"
          style={{
            width: isLargeScreen ? `calc(${rightPanelWidth}% - 12px)` : '100%',
            height: isLargeScreen ? '100%' : 'auto',
          }}
        >
          <div className="border-b px-6 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900 flex-shrink-0">
            <h2 className="font-semibold">Output</h2>
            <div className="flex items-center gap-3">
              {(outputView === 'html' || outputView === 'tokens') && (
                <Button variant="outline" size="sm" onClick={handleCopy}>
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

          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              {/* HTML Preview */}
              {outputView === 'preview' && (
                <div className="p-6 bg-white dark:bg-gray-900">
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </div>
              )}

              {/* Raw HTML */}
              {outputView === 'html' && (
                <div className="p-6 bg-gray-50 dark:bg-gray-900">
                  <pre className="whitespace-pre-wrap break-words">
                    <code className="text-sm font-mono">{html}</code>
                  </pre>
                </div>
              )}

              {/* Tokens JSON */}
              {outputView === 'tokens' && (
                <div className="p-6 bg-gray-50 dark:bg-gray-900">
                  <JsonView data={tokens} />
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
