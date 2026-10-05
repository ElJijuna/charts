import { type PointsArray, Scatter } from 'victory-native';

/** A path with one sample has no visible length or area. Show the sample itself. */
export function SinglePointMarker({ points, color }: { points: PointsArray; color: string }) {
  let single: PointsArray[number] | undefined;
  for (const point of points) {
    if (!Number.isFinite(point.x) || point.y === null || !Number.isFinite(point.y)) {
      continue;
    }
    if (single) {
      return null;
    }
    single = point;
  }
  return single ? <Scatter points={[single]} color={color} radius={4} /> : null;
}
