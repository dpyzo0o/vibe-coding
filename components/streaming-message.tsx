import React from 'react';

import { useStream } from '@/hooks/use-stream';

export function StreamingMessage({
  text,
  animate = false,
}: {
  text: string;
  animate?: boolean;
}) {
  const contentRef = React.useRef('');
  const { stream, addPart } = useStream();

  React.useEffect(() => {
    if (!text || !animate) return;

    if (contentRef.current !== text) {
      const delta = text.slice(contentRef.current.length);
      if (delta) {
        addPart(delta);
      }
      contentRef.current = text;
    }
  }, [text, animate, addPart]);

  if (!animate) return text;

  return stream ?? text ?? '';
}
