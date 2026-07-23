"use client";
import { useCountdown } from "@/hooks/useCountdown";

export function Countdown({ target }: { target: Date }) {
  const { days, hours, minutes, seconds, arrived, ready } = useCountdown(target);

  if (arrived)
    return (
      <div className="countdown-arrived text-center text-sm sm:text-base font-semibold">
        The capsule unlocks today.
      </div>
    );

  const units: [string, number][] = [
    ["Days", days],
    ["Hours", hours],
    ["Min", minutes],
    ["Sec", seconds],
  ];

  return (
    <div className="countdown flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
      {units.map(([label, value]) => (
        <div
          className="countdown-unit flex flex-col items-center justify-center min-w-[3.25rem] sm:min-w-[4rem] md:min-w-[4.5rem] px-2 py-2 sm:px-3 sm:py-3"
          key={label}
        >
          <div className="countdown-digit text-xl sm:text-2xl md:text-3xl font-extrabold tabular-nums leading-none">
            {ready ? String(value).padStart(2, "0") : "--"}
          </div>
          <div className="countdown-label mt-1 text-[10px] sm:text-xs uppercase tracking-wide">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}