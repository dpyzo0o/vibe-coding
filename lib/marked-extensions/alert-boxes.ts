import type { TokenizerAndRendererExtension } from 'marked';
import { marked } from 'marked';

// Token interface for alert boxes
export interface AlertToken {
  type: 'alert';
  raw: string;
  alertType: 'info' | 'warning' | 'error' | 'success';
  text: string;
}

// Alert extension
export const alertBoxesExtension: TokenizerAndRendererExtension = {
  name: 'alert',
  level: 'block',
  tokenizer(src) {
    // 不使用 g 标志，因为 tokenizer 只需要匹配一次
    const alertRegex = /^:::(info|warning|error|success)\s*\n([^]*?)\n:::/;
    const match = alertRegex.exec(src);

    if (match) {
      const [raw, type, text] = match;
      return {
        type: 'alert',
        raw,
        alertType: type as 'info' | 'warning' | 'error' | 'success',
        text: text ? text.trim() : '',
      };
    }

    return undefined;
  },
  renderer(token) {
    const { alertType, text } = token as AlertToken;
    const classMap = {
      info: 'alert-info',
      warning: 'alert-warning',
      error: 'alert-error',
      success: 'alert-success',
    };

    // 使用 marked.parse 而不是 parseInline 来支持换行和段落
    // 处理文本中的换行，保留 markdown 格式
    const parsedContent = marked.parse(text);

    return `<div class="alert ${classMap[alertType]}">
      <div class="alert-content">
        ${parsedContent}
      </div>
    </div>`;
  },
};

// Helper function to register this extension
export function registerAlertBoxesExtension() {
  marked.use({ extensions: [alertBoxesExtension] });
}
