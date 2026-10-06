import { act, renderHook } from '@testing-library/react-native';
import { useBandPadding } from '@/core/useBandPadding';

const bounds = { left: 10, right: 610, top: 20, bottom: 320 };

describe('useBandPadding', () => {
  it('waits for the plot size, then pads half a band on each side', async () => {
    const { result } = await renderHook(() => useBandPadding(6, 'vertical'));

    expect(result.current.ready).toBe(false);
    expect(result.current.domainPadding).toEqual({ left: 0, right: 0 });

    await act(() => result.current.onChartBoundsChange(bounds));

    // 600px for 6 groups: points 100px apart, 50px from each edge.
    expect(result.current.ready).toBe(true);
    expect(result.current.domainPadding).toEqual({ left: 60, right: 60 });
  });

  it('pads the category axis vertically for horizontal charts', async () => {
    const { result } = await renderHook(() => useBandPadding(4, 'horizontal'));

    await act(() => result.current.onChartBoundsChange(bounds));

    expect(result.current.domainPadding).toEqual({ top: 50, bottom: 50 });
  });

  it('needs no padding and no wait for a single category', async () => {
    const { result } = await renderHook(() => useBandPadding(1, 'vertical'));

    expect(result.current.ready).toBe(true);
    expect(result.current.domainPadding).toEqual({ left: 0, right: 0 });
  });
});
