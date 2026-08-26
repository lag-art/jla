import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa6";

// common / Button
// Polymorphic, heuristic button: it infers WHAT to render from the props
// you pass, so callers never choose the wrong tag by hand.
//   - `to`     -> internal route  -> renders <Link>
//   - `href`   -> external URL    -> renders <a target="_blank">
//   - neither  -> in-page action  -> renders <button>
// Handles loading/disabled/icon states uniformly across all three so a
// "Submit" button and a "Join JLA" nav CTA share one visual language.

const VARIANTS = {
  primary:
    "bg-[var(--jla-gold)] text-[var(--jla-navy-950)] hover:bg-[var(--jla-gold-300)] border border-transparent",
  secondary:
    "bg-transparent text-[var(--jla-navy)] border border-[var(--jla-navy)] hover:bg-[var(--jla-navy)] hover:text-white",
  ghost:
    "bg-transparent text-[var(--jla-navy)] border-0 border-b border-[var(--jla-gold)] rounded-none px-0 hover:text-[var(--jla-gold-600)]",
  danger:
    "bg-red-600 text-white border border-transparent hover:bg-red-700",
};

const SIZES = {
  sm: "text-xs px-4 py-2 gap-1.5",
  md: "text-sm px-7 py-3.5 gap-2",
  lg: "text-base px-9 py-4 gap-2.5",
};

const Button = forwardRef(
  (
    {
      children,
      to,
      href,
      onClick,
      type = "button",
      variant = "primary",
      size = "md",
      iconLeft: IconLeft,
      iconRight: IconRight,
      isLoading = false,
      disabled = false,
      fullWidth = false,
      className = "",
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const classes = [
      "inline-flex items-center justify-center font-semibold uppercase tracking-wide rounded-sm",
      "transition-colors duration-200 ease-out cursor-pointer select-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--jla-gold)] focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      VARIANTS[variant] || VARIANTS.primary,
      variant !== "ghost" ? SIZES[size] || SIZES.md : "text-sm gap-2 py-1",
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const content = (
      <>
        {isLoading ? (
          <motion.span
            className="inline-flex"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner aria-hidden="true" />
          </motion.span>
        ) : (
          IconLeft && <IconLeft aria-hidden="true" />
        )}
        <span>{children}</span>
        {!isLoading && IconRight && <IconRight aria-hidden="true" />}
      </>
    );

    const motionProps = {
      whileTap: isDisabled ? {} : { scale: 0.97 },
    };

    // Internal route
    if (to && !isDisabled) {
      return (
        <motion.span {...motionProps} className="inline-block">
          <Link ref={ref} to={to} className={classes} aria-busy={isLoading} {...rest}>
            {content}
          </Link>
        </motion.span>
      );
    }

    // External link
    if (href && !isDisabled) {
      return (
        <motion.span {...motionProps} className="inline-block">
          <a
            ref={ref}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={classes}
            aria-busy={isLoading}
            {...rest}
          >
            {content}
          </a>
        </motion.span>
      );
    }

    // In-page action (also the fallback when `to`/`href` is set but disabled,
    // so a disabled Link never navigates)
    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={classes}
        whileTap={isDisabled ? {} : { scale: 0.97 }}
        {...rest}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;