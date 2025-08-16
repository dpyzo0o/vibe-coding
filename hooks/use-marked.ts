import { marked, Token } from 'marked';
import { useCallback, useEffect, useState } from 'react';

import { registerMarkedExtensions } from '@/lib/marked-extensions';

// Register extensions once at module level
let extensionsRegistered = false;
if (!extensionsRegistered) {
  try {
    registerMarkedExtensions();
    extensionsRegistered = true;
  } catch (error) {
    console.error('Failed to register marked extensions:', error);
  }
}

interface UseMarkedReturn {
  parseMarkdown: (markdown: string) => Promise<string>;
  parseMarkdownSync: (markdown: string) => string;
  getTokens: (markdown: string) => Token[];
}

/**
 * Custom hook for using marked with extensions
 * Extensions are automatically registered at module level
 * @returns Object with parsing functions
 */
export function useMarked(): UseMarkedReturn {
  // Async markdown parsing
  const parseMarkdown = useCallback(
    async (markdown: string): Promise<string> => {
      try {
        return await marked.parse(markdown);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        return '';
      }
    },
    []
  );

  // Sync markdown parsing
  const parseMarkdownSync = useCallback((markdown: string): string => {
    try {
      // Use parseSync for synchronous parsing
      const result = marked.parse(markdown);
      // Ensure we return a string (marked.parse can return string or Promise<string>)
      if (typeof result === 'string') {
        return result;
      }
      // If it's a promise, we can't use it in sync context, return empty
      console.warn('Marked returned a promise in sync context');
      return '';
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '';
    }
  }, []);

  // Get tokens from markdown
  const getTokens = useCallback((markdown: string): Token[] => {
    try {
      return marked.lexer(markdown);
    } catch (error) {
      console.error('Error getting tokens:', error);
      return [];
    }
  }, []);

  return {
    parseMarkdown,
    parseMarkdownSync,
    getTokens,
  };
}

interface UseMarkedParserOptions {
  /**
   * Debounce delay in milliseconds. If 0 or undefined, no debouncing is applied.
   * @default 0
   */
  debounce?: number;
  /**
   * Whether to use async parsing. If false, uses sync parsing.
   * @default true
   */
  async?: boolean;
}

/**
 * Unified hook for parsing markdown with optional debouncing
 * @param markdown - The markdown string to parse
 * @param options - Configuration options
 * @returns Object with parsed HTML, tokens, and loading state
 *
 * @example
 * // With debouncing (for editor)
 * const { html, tokens, isLoading } = useMarkedParser(markdown, { debounce: 300 });
 *
 * @example
 * // Real-time parsing (no debounce)
 * const { html, tokens } = useMarkedParser(markdown);
 *
 * @example
 * // Sync parsing without debounce
 * const { html, tokens } = useMarkedParser(markdown, { async: false });
 */
export function useMarkedParser(
  markdown: string,
  options: UseMarkedParserOptions = {}
): {
  html: string;
  tokens: Token[];
  isLoading: boolean;
} {
  const { debounce = 0, async = true } = options;
  const [html, setHtml] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { parseMarkdown, parseMarkdownSync, getTokens } = useMarked();

  useEffect(() => {
    if (!markdown) {
      setHtml('');
      setTokens([]);
      setIsLoading(false);
      return;
    }

    // If debouncing is enabled
    if (debounce > 0) {
      setIsLoading(true);
      const timeoutId = setTimeout(async () => {
        try {
          const parsedHtml = async
            ? await parseMarkdown(markdown)
            : parseMarkdownSync(markdown);
          const tokenList = getTokens(markdown);

          setHtml(parsedHtml);
          setTokens(tokenList);
        } catch (error) {
          console.error('Error in useMarkedParser:', error);
          setHtml('');
          setTokens([]);
        } finally {
          setIsLoading(false);
        }
      }, debounce);

      return () => clearTimeout(timeoutId);
    }

    // No debouncing - parse immediately
    try {
      if (async) {
        setIsLoading(true);
        parseMarkdown(markdown)
          .then(parsedHtml => {
            setHtml(parsedHtml);
            setTokens(getTokens(markdown));
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error in useMarkedParser:', error);
            setHtml('');
            setTokens([]);
            setIsLoading(false);
          });
      } else {
        const parsedHtml = parseMarkdownSync(markdown);
        const tokenList = getTokens(markdown);
        setHtml(parsedHtml);
        setTokens(tokenList);
      }
    } catch (error) {
      console.error('Error in useMarkedParser:', error);
      setHtml('');
      setTokens([]);
      setIsLoading(false);
    }
  }, [markdown, debounce, async, parseMarkdown, parseMarkdownSync, getTokens]);

  return {
    html,
    tokens,
    isLoading,
  };
}
