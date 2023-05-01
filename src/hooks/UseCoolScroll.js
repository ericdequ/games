import { useRef, useCallback } from 'react';

export const useCoolScroll = () => {
  const scrollAnimationFrame = useRef(null);

  const scrollTo = useCallback((element, target, duration) => {
    const startTime = performance.now();
    const startPosition = element.scrollTop;
    const distance = target - startPosition;
    const overshoot = 0.1; // You can adjust this value to change the overshoot effect
    const oscillations = 6; // You can adjust this value to change the number of oscillations

    const elasticEaseInOut = (t, overshoot) => {
      const ts = (t /= 1) * t;
      const tc = ts * t;
      return t < 0.5
        ? (2 / 2.75 * (7.5625 * tc * ts + overshoot) * t * Math.sin((t - 0.5 / 1.5) * (2 * Math.PI) * 1.5 / 0.3)) / 2
        : 2 / 2.75 * (7.5625 * tc * ts + overshoot) * (t -= 2 / 2.75) * Math.sin((t - 0.5 / 1.5) * (2 * Math.PI) * 1.5 / 0.3) / 2 + 1;
    };

    const scrollStep = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easing = elasticEaseInOut(progress, overshoot);

      element.scrollTop = startPosition + distance * easing;

      if (elapsed < duration) {
        scrollAnimationFrame.current = requestAnimationFrame(scrollStep);
      }
    };

    scrollAnimationFrame.current = requestAnimationFrame(scrollStep);
  }, []);

  const cancelScroll = useCallback(() => {
    if (scrollAnimationFrame.current) {
      cancelAnimationFrame(scrollAnimationFrame.current);
    }
  }, []);

  return { scrollTo, cancelScroll };
};
