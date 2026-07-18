import { useEffect, useState } from "react";
import type { Spark } from "@/lib/types";

function makeSparks(count: number): Spark[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    bottom: -10 - Math.random() * 20,
    duration: 10 + Math.random() * 14,
    delay: Math.random() * 14,
    size: 1.5 + Math.random() * 2.5,
  }));
}

export function useSparks(count: number): Spark[] {
  // Start empty so server render and the client's first render match exactly.
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    // Only touch Math.random() after mount, on the client.
    setSparks(makeSparks(count));
  }, [count]);

  return sparks;
}