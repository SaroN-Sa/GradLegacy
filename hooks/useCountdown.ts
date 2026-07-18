import { useEffect, useState } from "react";

export function useCountdown(target: Date) {
  // null until the first client-side tick, so server render and the
  // client's initial render match exactly (neither one calls Date.now()).
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(target.getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const ready = remaining !== null;
  const clamped = Math.max(remaining ?? 0, 0);

  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    arrived: ready && clamped <= 0,
    ready,
  };
}