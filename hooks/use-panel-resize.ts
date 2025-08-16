'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePanelResizeOptions {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onResize?: (width: number) => void;
}

export function usePanelResize({
  defaultWidth = 50,
  minWidth = 20,
  maxWidth = 80,
  onResize,
}: UsePanelResizeOptions = {}) {
  const [leftPanelWidth, setLeftPanelWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse move for resizing
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Limit the width between minWidth and maxWidth
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newLeftWidth));
      setLeftPanelWidth(clampedWidth);
      onResize?.(clampedWidth);
    },
    [isDragging, minWidth, maxWidth, onResize]
  );

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle mouse down to start dragging
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    leftPanelWidth,
    rightPanelWidth: 100 - leftPanelWidth,
    isDragging,
    containerRef,
    handleMouseDown,
    setLeftPanelWidth,
  };
}
