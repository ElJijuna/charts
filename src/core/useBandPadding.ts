import { useCallback, useMemo, useState } from 'react';
import type { ChartBounds } from 'victory-native';

/**
 * Domain padding that lays categories out as bands, so the first and last bar groups or
 * candles fit inside the plot instead of being centered on its edges.
 *
 * Without a viewport, Victory keeps the plot bounds fixed and pads the scale domain. A padding
 * of `length / (2 * (count - 1))` then spaces points `length / count` apart with half a band
 * before the first and after the last, which matches Victory's `length / count` group width.
 */
export function useBandPadding(count: number, orientation: 'vertical' | 'horizontal') {
  const [length, setLength] = useState(0);
  const onChartBoundsChange = useCallback(
    (bounds: ChartBounds) =>
      setLength(
        orientation === 'vertical' ? bounds.right - bounds.left : bounds.bottom - bounds.top,
      ),
    [orientation],
  );
  const padding = count > 1 && length > 0 ? length / (2 * (count - 1)) : 0;
  const domainPadding = useMemo(
    () =>
      orientation === 'vertical'
        ? { left: padding, right: padding }
        : { top: padding, bottom: padding },
    [orientation, padding],
  );

  // Draw marks only once the padding is known: a second layout right after mount interrupts
  // Victory's mount animation and leaves bars stuck between the two positions.
  const ready = count <= 1 || length > 0;

  return { domainPadding, onChartBoundsChange, ready };
}
