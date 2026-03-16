import { useEffect, useState } from 'react';

/**
 * useCountUp Hook
 * 
 * Animates a number from 0 to the target value with easing
 * Used for metric card value animations
 */
export function useCountUp(
  end: number,
  duration: number = 1000,
  enabled: boolean = true
): number {
  const [count, setCount] = useState(enabled ? 0 : end);

  useEffect(() => {
    if (!enabled) {
      setCount(end);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, enabled]);

  return count;
}
