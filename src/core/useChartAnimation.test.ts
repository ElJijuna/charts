import { renderHook } from '@testing-library/react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { chartAnimation } from '@/core/chartAnimation';
import { useChartAnimation } from '@/core/useChartAnimation';

const mockUseReducedMotion = jest.mocked(useReducedMotion);

describe('useChartAnimation', () => {
  afterEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it('animates by default when reduced motion is off', async () => {
    const { result } = await renderHook(() => useChartAnimation(undefined));

    expect(result.current).toBe(chartAnimation);
  });

  it('disables animation by default when reduced motion is on', async () => {
    mockUseReducedMotion.mockReturnValue(true);

    const { result } = await renderHook(() => useChartAnimation(undefined));

    expect(result.current).toBeUndefined();
  });

  it('lets an explicit animate prop override the system setting', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    const enabled = await renderHook(() => useChartAnimation(true));

    mockUseReducedMotion.mockReturnValue(false);
    const disabled = await renderHook(() => useChartAnimation(false));

    expect(enabled.result.current).toBe(chartAnimation);
    expect(disabled.result.current).toBeUndefined();
  });
});
