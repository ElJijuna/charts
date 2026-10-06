import { useReducedMotion } from 'react-native-reanimated';
import { chartAnimation } from '@/core/chartAnimation';

// An explicit `animate` wins; otherwise animate unless the system requests reduced motion.
export function useChartAnimation(animate: boolean | undefined) {
  const reducedMotion = useReducedMotion();
  return (animate ?? !reducedMotion) ? chartAnimation : undefined;
}
