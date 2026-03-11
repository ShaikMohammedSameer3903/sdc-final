import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const BottomSheet = ({
  open,
  onClose,
  title,
  children,
  className = '',
  showHandle = true,
  closeOnBackdrop = true,
}) => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  const handleBackdropClick = () => {
    if (!closeOnBackdrop) return;
    if (onClose) onClose();
  };

  const sheetVariants = {
    hidden: {
      y: isMobile ? '100%' : 40,
      opacity: isMobile ? 1 : 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 260, damping: 24 },
    },
    exit: {
      y: isMobile ? '100%' : 40,
      opacity: isMobile ? 1 : 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />

          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`fixed z-[2010] left-0 right-0 ${
              isMobile ? 'bottom-0' : 'inset-y-0 flex items-center justify-center'
            }`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sheetVariants}
          >
            <div
              className={`${
                isMobile
                  ? 'rounded-t-3xl w-full max-h-[80vh] bg-white dark:bg-neutral-900 shadow-2xl pb-safe'
                  : 'rounded-3xl w-full max-w-lg bg-white dark:bg-neutral-900 shadow-2xl'
              } ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {showHandle && (
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
              )}

              {title && (
                <div className="px-5 pt-3 pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                    {title}
                  </h2>
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                    >
                      <i className="fa-solid fa-xmark" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}

              <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
