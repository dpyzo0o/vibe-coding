export const initialMarkdownContent = `# Marked Demo

Welcome to the **Marked** markdown parser demo!

## Features

- **Bold text** and *italic text*
- [Links](https://github.com/markedjs/marked)
- Lists:
  1. Ordered item 1
  2. Ordered item 2
  3. Ordered item 3
  
  - Unordered item
  - Another item
  - Yet another item

## Code Blocks

Inline code: \`const greeting = "Hello, World!";\`

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

## Tables

| Feature | Support |
|---------|---------|
| Tables | ✅ |
| Fenced code blocks | ✅ |
| Syntax highlighting | ✅ |

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

---

## Try it yourself!

Edit the markdown on the left to see the output on the right.
`;
