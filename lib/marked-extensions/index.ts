import hljs from 'highlight.js';
import type { TokenizerAndRendererExtension } from 'marked';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

import { alertBoxesExtension } from './alert-boxes';

// Export all extensions
export * from './alert-boxes';

// Configure highlight.js with custom renderer
const highlightOptions = markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
});

// Collection of all extensions
export const allExtensions: TokenizerAndRendererExtension[] = [
  alertBoxesExtension,
];

// Register all extensions at once
export function registerMarkedExtensions() {
  // Register highlight.js first
  marked.use(highlightOptions);

  // Add not-prose class to pre elements
  marked.use({
    hooks: {
      postprocess(html) {
        // Add not-prose class to pre elements with hljs
        return html.replace(/<pre>/g, '<pre class="not-prose">');
      },
    },
  });

  // Then register custom extensions
  marked.use({ extensions: allExtensions });
}

// Register individual extensions
export function registerAlertBoxesExtension() {
  marked.use({ extensions: [alertBoxesExtension] });
}

// Type-safe extension registry
export class ExtensionRegistry {
  private static extensions: TokenizerAndRendererExtension[] = [];

  static register(extension: TokenizerAndRendererExtension) {
    this.extensions.push(extension);
    marked.use({ extensions: [extension] });
  }

  static registerAll() {
    this.extensions = [...allExtensions];
    marked.use({ extensions: allExtensions });
  }

  static getRegisteredExtensions() {
    return [...this.extensions];
  }

  static clear() {
    // Note: marked.js doesn't support unregistering extensions
    // This is a limitation of the library
    console.warn('Marked extensions cannot be unregistered once registered');
  }
}

// Named export for convenience
export const markedExtensions = {
  register: registerMarkedExtensions,
  extensions: allExtensions,
};
