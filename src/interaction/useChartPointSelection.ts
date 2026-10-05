import { useCallback, useEffect, useRef, useState } from 'react';

/** Selection state for a tooltip overlay, coalesced to one update per frame. */
export function useChartPointSelection() {
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const committedPoint = useRef<number | null>(null);
  const requestedPoint = useRef<number | null>(null);
  const frame = useRef<number | null>(null);

  const selectPoint = useCallback((point: number | null) => {
    const next = point !== null && Number.isInteger(point) && point >= 0 ? point : null;
    if (requestedPoint.current === next) {
      return;
    }
    requestedPoint.current = next;
    if (frame.current !== null) {
      return;
    }
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const latest = requestedPoint.current;
      if (committedPoint.current !== latest) {
        committedPoint.current = latest;
        setActivePoint(latest);
      }
    });
  }, []);

  const clearPoint = useCallback(() => selectPoint(null), [selectPoint]);

  useEffect(
    () => () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
      requestedPoint.current = committedPoint.current;
    },
    [],
  );

  return { activePoint, selectPoint, clearPoint };
}
