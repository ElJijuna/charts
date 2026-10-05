import { render } from '@testing-library/react-native';

import { SinglePointMarker } from './SinglePointMarker';

const mockScatter = jest.fn((_props: unknown) => null);
jest.mock('victory-native', () => ({ Scatter: (props: unknown) => mockScatter(props) }));

it('shows a lone valid sample, even with gaps; does not mark empty or multi-point paths', async () => {
  const point = { x: 12, xValue: 1, y: 30, yValue: 5 };
  const gap = { x: 24, xValue: 2, y: null, yValue: null };
  const screen = await render(<SinglePointMarker points={[point, gap]} color="#123456" />);
  expect(mockScatter).toHaveBeenCalledWith({ points: [point], color: '#123456', radius: 4 });
  mockScatter.mockClear();
  await screen.rerender(<SinglePointMarker points={[point, point]} color="#123456" />);
  expect(mockScatter).not.toHaveBeenCalled();
  await screen.rerender(<SinglePointMarker points={[gap]} color="#123456" />);
  expect(mockScatter).not.toHaveBeenCalled();
});
