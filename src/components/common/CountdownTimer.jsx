import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import useCountdown from "../../hooks/useCountdown";

// common / CountdownTimer
// Two variants off one hook, so a single component serves both contexts:
//   - variant="inline" (default) — compact "12h:34m:56s" text, used inside
//     NoticeBanner where space is tight.
//   - variant="blocks" — a full responsive Days/Hrs/Min/Sec display, sized
//     for a standalone hero section (e.g. a Nominations deadline block).
//
// Heuristics baked in:
//   - Renders nothing once expired — a countdown reading "00:00:00:00"
//     forever isn't useful information; the caller's own logic (e.g.
//     NoticeBanner's date-window check) is what should actually remove
//     the surrounding content once a deadline passes.
//   - `isUrgent` (from useCountdown, <24h left by default) triggers a
//     subtle pulse + color shift automatically — no caller-side logic
//     needed to make an imminent deadline visually read as urgent.
//   - Accessibility: does NOT use aria-live for the ticking numbers —
//     announcing a change every second would be unusable noise for screen
//     reader users. Instead it exposes a single static aria-label with the
//     actual formatted deadline date/time, read once on encounter.
//   - Motion (the urgency pulse) respects prefers-reduced-motion, falling
//     back to a static color change.

const pad = (n) => String(n).padStart(2, "0");

const formatDeadline = (targetDate) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(targetDate));
  } catch {
    return String(targetDate);
  }
};

const CountdownTimer = ({ targetDate, variant = "inline", className = "" }) => {
  const shouldReduceMotion = useReducedMotion();
  const { days, hours, minutes, seconds, isExpired, isUrgent } = useCountdown(targetDate);

  const deadlineLabel = useMemo(
    () => (targetDate ? `Deadline: ${formatDeadline(targetDate)}` : ""),
    [targetDate]
  );

  if (isExpired) return null;

  const pulse =
    isUrgent && !shouldReduceMotion
      ? { animate: { opacity: [1, 0.6, 1] }, transition: { duration: 1.2, repeat: Infinity } }
      : {};

  if (variant === "blocks") {
    const units = [
      days > 0 && { label: "Days", value: days },
      { label: "Hrs", value: hours },
      { label: "Min", value: minutes },
      { label: "Sec", value: seconds },
    ].filter(Boolean);

    return (
      <div
        role="timer"
        aria-label={deadlineLabel}
        className={`flex items-center gap-2 sm:gap-3 ${className}`}
      >
        {units.map((unit) => (
          <motion.div
            key={unit.label}
            {...pulse}
            className={`flex flex-col items-center justify-center rounded-md border px-3 py-2.5 sm:px-4 sm:py-3.5 min-w-14 sm:min-w-18 ${
              isUrgent
                ? "bg-red-600/10 border-red-600/40"
                : "bg-(--jla-navy-800) border-(--jla-navy-700)"
            }`}
          >
            <span
              className={`font-mono font-semibold text-xl sm:text-3xl tabular-nums ${
                isUrgent ? "text-red-500" : "text-(--jla-gold)"
              }`}
            >
              {pad(unit.value)}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wide text-white/60 mt-0.5">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    );
  }

  // Default: inline
  return (
    <motion.span
      {...pulse}
      role="timer"
      aria-label={deadlineLabel}
      className={`inline-flex items-center gap-1 font-mono text-xs tabular-nums ${
        isUrgent ? "text-red-600 font-semibold" : ""
      } ${className}`}
    >
      {days > 0 && (
        <>
          <span>{days}d</span>
          <span aria-hidden="true">·</span>
        </>
      )}
      <span>{pad(hours)}h</span>
      <span aria-hidden="true">:</span>
      <span>{pad(minutes)}m</span>
      <span aria-hidden="true">:</span>
      <span>{pad(seconds)}s</span>
    </motion.span>
  );
};

export default CountdownTimer;