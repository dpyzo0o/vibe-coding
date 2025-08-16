export const initialMarkdownContent = `# Marked Demo

Welcome to the **Marked** markdown parser demo with **custom extensions**!

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

## Enhanced Code Blocks

Our custom extension adds line numbers and highlighting:

\`\`\`javascript {linenos,highlight=2,4-5}
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

## Alert Boxes

:::info
**Information alert**: This is a useful tip or information box.
:::

:::warning
**Warning alert**: Be careful about this important warning.
:::

:::error
**Error alert**: Something went wrong! Please check this.
:::

:::success
**Success alert**: Great job! Everything is working correctly.
:::

## Regular Code Block

\`\`\`python
class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

calc = Calculator()
print(calc.add(5, 3))  # 8
\`\`\`

## Tables

| Feature | Support |
|---------|---------|
| Tables | ✅ |
| Fenced code blocks | ✅ |
| Line numbers | ✅ |
| Highlighting | ✅ |
| Alert boxes | ✅ |

## Blockquotes

> This is a regular blockquote.
> It can span multiple lines.

---

## Try it yourself!

Edit the markdown on the left to see the enhanced features in action!`;
