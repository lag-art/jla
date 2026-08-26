import { useEffect, useState } from "react";

// useCountdown
// Ticks down to `targetDate` (Date object or ISO string) every second.
// Consumed by components/common/CountdownTimer.jsx.
//
// Heuristics baked in:
//   - Stops its own interval once expired instead of ticking negative
//     forever — `isExpired` flips true and the interval clears itself.
//   - Recomputes immediately on `targetDate` change (not just on the next
//     interval tick), so switching to a different deadline updates the
//     displayed time instantly rather than waiting up to 1s.
//   - `isUrgent` flags when remaining time drops under `urgentThresholdMs`
//     (default 24h) — lets CountdownTimer switch to an attention-getting
//     style automatically as a deadline actually approaches, without the
//     caller having to compute that themselves.
//   - `totalMs` is exposed for anything that wants a progress bar/percentage
//     later, not just the broken-down d/h/m/s.

const DAY_MS = 1000 * 60 * 60 * 24;
const DEFAULT_URGENT_THRESHOLD_MS = DAY_MS;

const getTimeParts = (targetDate, urgentThresholdMs) => {
  const totalMs = new Date(targetDate).getTime() - Date.now();

  if (totalMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isExpired: true,
      isUrgent: false,
    };
  }

  return {
    days: Math.floor(totalMs / DAY_MS),
    hours: Math.floor((totalMs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((totalMs / (1000 * 60)) % 60),
    seconds: Math.floor((totalMs / 1000) % 60),
    totalMs,
    isExpired: false,
    isUrgent: totalMs <= urgentThresholdMs,
  };
};

const useCountdown = (targetDate, urgentThresholdMs = DEFAULT_URGENT_THRESHOLD_MS) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    targetDate
      ? getTimeParts(targetDate, urgentThresholdMs)
      : { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true, isUrgent: false }
  );

  useEffect(() => {
    if (!targetDate) return;

    setTimeLeft(getTimeParts(targetDate, urgentThresholdMs));

    const interval = setInterval(() => {
      const next = getTimeParts(targetDate, urgentThresholdMs);
      setTimeLeft(next);
      if (next.isExpired) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, urgentThresholdMs]);

  return timeLeft;
};

export default useCountdown;