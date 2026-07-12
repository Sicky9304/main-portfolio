import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const SmoothScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);

  // Global script to handle independent vertical scrolling for any element with overflow
  useEffect(() => {
    const handleGlobalWheel = (e) => {
      let el = e.target;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        const isScrollable = (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
        
        if (isScrollable) {
          const deltaY = e.deltaY;
          const scrollTop = el.scrollTop;
          const maxScroll = el.scrollHeight - el.clientHeight;
          
          const scrollingUp = deltaY < 0;
          const scrollingDown = deltaY > 0;
          
          // If we can scroll within this container, stop propagation so only this section scrolls
          if ((scrollingUp && scrollTop > 0) || (scrollingDown && scrollTop < maxScroll)) {
            e.stopPropagation();
            return;
          }
        }
        el = el.parentElement;
      }
    };

    window.addEventListener('wheel', handleGlobalWheel, { capture: true, passive: true });
    return () => {
      window.removeEventListener('wheel', handleGlobalWheel, { capture: true });
    };
  }, []);

  useEffect(() => {
    // Bypass Lenis smooth scrolling on admin dashboard routes to keep native scrolling active in edit containers
    if (window.location.pathname.startsWith('/sicky-admin')) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart for premium snappiness
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
    });

    lenisRef.current = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
};

