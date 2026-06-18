import { useEffect, useRef, useState } from 'react';
import type { PerformanceSnapshot } from '@/types';

interface PerfMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

const BYTES_PER_MB = 1024 * 1024;

/**
 * Samples runtime performance: JS heap usage (Chromium `performance.memory`),
 * a rolling FPS estimate and live DOM node count. Only runs while `active`.
 */
export function usePerformanceMonitor(active: boolean): PerformanceSnapshot {
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot>({
    usedJsHeapMb: null,
    totalJsHeapMb: null,
    jsHeapLimitMb: null,
    fps: 0,
    domNodes: 0,
  });
  const frames = useRef(0);
  const lastFpsAt = useRef(performance.now());
  const fpsRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    const loop = () => {
      frames.current += 1;
      const now = performance.now();
      if (now - lastFpsAt.current >= 1000) {
        fpsRef.current = Math.round((frames.current * 1000) / (now - lastFpsAt.current));
        frames.current = 0;
        lastFpsAt.current = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const interval = window.setInterval(() => {
      const mem = (performance as Performance & { memory?: PerfMemory }).memory;
      setSnapshot({
        usedJsHeapMb: mem ? +(mem.usedJSHeapSize / BYTES_PER_MB).toFixed(1) : null,
        totalJsHeapMb: mem ? +(mem.totalJSHeapSize / BYTES_PER_MB).toFixed(1) : null,
        jsHeapLimitMb: mem ? +(mem.jsHeapSizeLimit / BYTES_PER_MB).toFixed(1) : null,
        fps: fpsRef.current,
        domNodes: document.getElementsByTagName('*').length,
      });
    }, 1000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearInterval(interval);
    };
  }, [active]);

  return snapshot;
}
