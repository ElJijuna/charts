import { act, renderHook } from '@testing-library/react-native';
import { useChartPointSelection } from '@/interaction/useChartPointSelection';

let nextFrame = 0;
const frames = new Map<number, (timestamp: number) => void>();

beforeEach(() => {
  frames.clear();
  nextFrame = 0;
  jest.spyOn(global, 'requestAnimationFrame').mockImplementation((callback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  jest.spyOn(global, 'cancelAnimationFrame').mockImplementation((frame) => {
    if (frame !== null && frame !== undefined) {
      frames.delete(frame);
    }
  });
});
afterEach(() => jest.restoreAllMocks());

async function flushFrame() {
  await act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => {
      callback(0);
    });
  });
}

it('coalesces movement and skips repeated selection without extra renders', async () => {
  const renders = jest.fn();
  const { result } = await renderHook(() => {
    renders();
    return useChartPointSelection();
  });
  const select = result.current.selectPoint;
  await act(() => {
    for (let index = 0; index < 100; index++) {
      select(index);
    }
  });
  expect(frames.size).toBe(1);
  expect(result.current.activePoint).toBeNull();
  const before = renders.mock.calls.length;
  await flushFrame();
  expect(result.current.activePoint).toBe(99);
  expect(renders).toHaveBeenCalledTimes(before + 1);
  expect(result.current.selectPoint).toBe(select);
  await act(() => {
    for (let index = 0; index < 100; index++) {
      select(99);
    }
  });
  expect(frames.size).toBe(0);
  expect(renders).toHaveBeenCalledTimes(before + 1);
});

it('crosses targets in a single frame without an intermediate clear render', async () => {
  const { result } = await renderHook(useChartPointSelection);
  await act(() => result.current.selectPoint(2));
  await flushFrame();
  await act(() => {
    result.current.clearPoint();
    result.current.selectPoint(3);
  });
  expect(frames.size).toBe(1);
  expect(result.current.activePoint).toBe(2);
  await flushFrame();
  expect(result.current.activePoint).toBe(3);
  await act(() => result.current.clearPoint());
  await flushFrame();
  expect(result.current.activePoint).toBeNull();
});

it('does not re-render when queued movement returns to the committed point', async () => {
  const renders = jest.fn();
  const { result } = await renderHook(() => {
    renders();
    return useChartPointSelection();
  });
  await act(() => result.current.selectPoint(1));
  await flushFrame();
  const before = renders.mock.calls.length;
  await act(() => {
    result.current.selectPoint(2);
    result.current.selectPoint(1);
  });
  await flushFrame();
  expect(renders).toHaveBeenCalledTimes(before);
});

it('clears invalid indexes and cancels pending work on unmount', async () => {
  const { result, unmount } = await renderHook(useChartPointSelection);
  await act(() => result.current.selectPoint(0));
  await flushFrame();
  for (const invalid of [Number.NaN, Number.POSITIVE_INFINITY, -1, 1.5]) {
    await act(() => result.current.selectPoint(invalid));
    await flushFrame();
    expect(result.current.activePoint).toBeNull();
  }
  await act(() => result.current.selectPoint(4));
  expect(frames.size).toBe(1);
  await unmount();
  expect(frames.size).toBe(0);
  expect(global.cancelAnimationFrame).toHaveBeenCalled();
});
