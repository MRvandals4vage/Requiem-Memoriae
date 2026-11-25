import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ASSETS } from '../assets/assetMap';
import { GameButton } from './GameButton';
import { SCROLL_MESSAGE_TEXT } from './ScrollMessage';

interface ScrollOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScrollOverlay({ isOpen, onClose }: ScrollOverlayProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="scroll-overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Opened Parchment Scroll"
        >
          {/* Centered unrolling scroll */}
          <motion.div
            className="scroll-overlay-stage"
            initial={{ opacity: 0, scale: 0.78, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={ASSETS.scrollOpened}
              alt={SCROLL_MESSAGE_TEXT}
              className="scroll-opened-image"
              draggable={false}
              initial={{ clipPath: 'inset(0 45% 0 45%)', opacity: 0.35 }}
              animate={{ clipPath: 'inset(0 0% 0 0%)', opacity: 1 }}
              exit={{ clipPath: 'inset(0 18% 0 18%)', opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              className="scroll-overlay-footer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.45 }}
            >
              <GameButton onClick={onClose} ariaLabel="Close Scroll">
                Close Scroll
              </GameButton>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

