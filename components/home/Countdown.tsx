"use client";
import { useCountdown } from "@/hooks/useCountdown";

export function Countdown({ target }: { target: Date }) {
  const { days, hours, minutes, seconds, arrived, ready } = useCountdown(target);

  if (arrived) return <div className="countdown-arrived">The capsule unlocks today.</div>;

  const units: [string, number][] = [
    ["Days", days],
    ["Hours", hours],
    ["Min", minutes],
    ["Sec", seconds],
  ];

  return (
    <div className="countdown">
      {units.map(([label, value]) => (
        <div className="countdown-unit" key={label}>
          <div className="countdown-digit">{ready ? String(value).padStart(2, "0") : "--"}</div>
          <div className="countdown-label">{label}</div>
        </div>
      ))}
    </div>
  );
}