import type { SkFont } from '@shopify/react-native-skia';
import { useFont } from '@shopify/react-native-skia';
import { renderHook } from '@testing-library/react-native';
import { useChartAxisOptions } from '@/core/useChartAxisOptions';
import { defaultChartTheme } from '@/theme/defaultTheme';

const mockUseFont = jest.mocked(useFont);
const loadedFont = { size: 14 } as unknown as SkFont;
const explicitFont = { size: 10 } as unknown as SkFont;

describe('useChartAxisOptions', () => {
  afterEach(() => {
    mockUseFont.mockReset();
    mockUseFont.mockReturnValue(null);
  });

  it('loads the font from fontSource and fontSize', async () => {
    mockUseFont.mockReturnValue(loadedFont);

    const { result } = await renderHook(() =>
      useChartAxisOptions({ fontSource: 'Inter.ttf', fontSize: 14 }, defaultChartTheme),
    );

    expect(mockUseFont).toHaveBeenCalledWith('Inter.ttf', 14);
    expect(result.current.font).toBe(loadedFont);
  });

  it('defaults the loaded font size to 12 and has no font without a source', async () => {
    const { result } = await renderHook(() => useChartAxisOptions(undefined, defaultChartTheme));

    expect(mockUseFont).toHaveBeenCalledWith(undefined, 12);
    expect(result.current.font).toBeNull();
  });

  it('prefers an explicit font and skips loading fontSource', async () => {
    mockUseFont.mockReturnValue(loadedFont);

    const { result } = await renderHook(() =>
      useChartAxisOptions({ font: explicitFont, fontSource: 'Inter.ttf' }, defaultChartTheme),
    );

    expect(mockUseFont).toHaveBeenCalledWith(null, 12);
    expect(result.current.font).toBe(explicitFont);
  });

  it('draws no lines or labels and loads no font when axes are hidden', async () => {
    const { result } = await renderHook(() => useChartAxisOptions(false, defaultChartTheme));

    expect(result.current).toEqual({
      font: null,
      lineWidth: 0,
      lineColor: 'transparent',
      labelColor: 'transparent',
    });
    expect(mockUseFont).toHaveBeenCalledWith(null, 12);
  });

  it('makes only the grid transparent when grid is disabled', async () => {
    const { result } = await renderHook(() =>
      useChartAxisOptions({ grid: false, x: { lineColor: '#111' } }, defaultChartTheme),
    );

    expect(result.current.lineColor).toEqual({ grid: 'transparent', frame: '#111' });
  });
});
