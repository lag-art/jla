import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaXmark } from "react-icons/fa6";

// common / Modal
// Used for gallery lightboxes (media/GalleryGrid), confirmations (forms),
// and any future dialog. Renders nothing when `isOpen` is false.
//
// Heuristics baked in:
//   - Portaled to document.body via createPortal — a Modal triggered from
//     deep inside e.g. a Card grid would otherwise inherit that ancestor's
//     stacking context / overflow:hidden and could get visually clipped or
//     stuck behind other content. Portaling guarantees it always sits on
//     top of the whole app regardless of where it's invoked from.
//   - Body scroll lock while open, restored exactly to its previous value
//     on close — prevents the page scrolling behind an open dialog.
//   - Focus is moved into the panel on open and restored to whatever
//     element triggered it on close, so keyboard/screen-reader users don't
//     lose their place — this is a real a11y requirement for dialogs, not
//     a nice-to-have.
//   - Escape key and backdrop click both close; clicks inside the panel
//     are stopped from bubbling to the backdrop.
//   - `size` (sm/md/lg/full) covers everything from a confirmation prompt
//     to a full gallery lightbox without a one-off className per usage.
//   - Motion respects prefers-reduced-motion (fades only, no slide/scale).

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)]",
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef(null);
  const triggerElRef = useRef(null);

  // Escape to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Body scroll lock, restored exactly
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Focus in on open, restore on close
  useEffect(() => {
    if (isOpen) {
      triggerElRef.current = document.activeElement;
      panelRef.current?.focus();
    } else {
      triggerElRef.current?.focus?.();
    }
  }, [isOpen]);

  const overlayMotion = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  const panelMotion = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
      };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...overlayMotion}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-(--z-modal) flex items-center justify-center bg-(--jla-navy-950)/72 p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            {...panelMotion}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${SIZES[size] || SIZES.md} bg-white rounded-md shadow-(--shadow-lg) max-h-[85dvh] overflow-y-auto p-6 sm:p-8 focus:outline-none`}
          >
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center justify-center w-9 h-9 rounded-full text-(--jla-slate) hover:bg-(--jla-navy-100) hover:text-(--jla-navy) transition-colors duration-150"
            >
              <FaXmark aria-hidden="true" />
            </button>

            {title && (
              <h3 className="font-(family-name:--font-display) font-semibold text-xl sm:text-2xl text-(--jla-navy) pr-10 mb-4">
                {title}
              </h3>
            )}

            <div className="font-(family-name:--font-body) text-(--jla-ink) leading-relaxed">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;