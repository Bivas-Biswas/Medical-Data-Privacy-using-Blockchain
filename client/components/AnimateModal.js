import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { Dialog } from "@headlessui/react";
import cx from "classnames";

const AnimatedModal = ({
  isOpen,
  children,
  className,
  onClose,
  overlayClassName,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          open={isOpen}
          onClose={onClose || (() => {})}
          initial={{
            opacity: 0,
            scale: 0.6,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.4,
              type: "spring",
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.75,
            transition: {
              ease: "easeIn",
              duration: 0.15,
            },
          }}
          className="fixed inset-0 z-10 overflow-auto"
        >
          <div className="min-h-screen flex items-center justify-center pt-4 px-4">
            <Dialog.Overlay
              as={motion.div}
              initial={{
                opacity: 0,
                scale: 1,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.1,
                },
              }}
              className={cx(
                "fixed inset-0 bg-gray-900 bg-opacity-50",
                overlayClassName
              )}
            />
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className={cx(
                "inline-block z-20 relative bg-gray-800 rounded-md text-white shadow-xl",
                className
              )}
            >
              {children}
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal;
