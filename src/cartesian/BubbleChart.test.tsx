import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import type { PointsArray } from 'victory-native';

import { BubbleChart } from './BubbleChart';

const mockScatterSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

const firstPoint = { x: 0, xValue: 'A', y: 12, yValue: 12 };
const secondPoint = { x: 1, xValue: 'B', y: 18, yValue: 18 };
const thirdPoint = { x: 2, xValue: 'C', y: 15, yValue: 15 };
const points = [firstPoint, secondPoint, thirdPoint];

jest.mock('victory-native', () => ({
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({ points: { revenue: points } });
  },
  Scatter: (props: unknown) => {
    mockScatterSpy(props);
    return null;
  },
}));

const data = [
  { segment: 'A', revenue: 12, customers: 10 },
  { segment: 'B', revenue: 18, customers: 30 },
  { segment: 'C', revenue: 15, customers: 20 },
];

describe('BubbleChart', () => {
  beforeEach(() => {
    mockScatterSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('scales bubble radii from a third numeric field', async () => {
    const screen = await render(
      <BubbleChart
        accessibilityLabel="Segment performance"
        animate={false}
        color="#123456"
        data={data}
        maxRadius={20}
        minRadius={4}
        shape="star"
        sizeKey="customers"
        xKey="segment"
        yKey="revenue"
      />,
    );

    expect(screen.getByLabelText('Segment performance')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(expect.objectContaining({ yKeys: ['revenue'] }));
    expect(mockScatterSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        color: '#123456',
        points,
        shape: 'star',
      }),
    );

    const props = mockScatterSpy.mock.calls[0]?.[0] as {
      radius: (point: PointsArray[number]) => number;
    };
    expect(props.radius(firstPoint)).toBe(4);
    expect(props.radius(secondPoint)).toBe(20);
    expect(props.radius(thirdPoint)).toBe(12);
  });

  it('applies defaults and handles a constant size field', async () => {
    const constantData = data.map((item) => ({ ...item, customers: 10 }));
    const screen = await render(
      <BubbleChart data={constantData} sizeKey="customers" xKey="segment" yKey="revenue" />,
    );

    expect(screen.getByLabelText('Bubble chart')).toBeTruthy();
    expect(mockScatterSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        color: '#6750a4',
        shape: 'circle',
      }),
    );

    const props = mockScatterSpy.mock.calls[0]?.[0] as {
      radius: (point: PointsArray[number]) => number;
    };
    expect(props.radius(firstPoint)).toBe(11);
  });
});
