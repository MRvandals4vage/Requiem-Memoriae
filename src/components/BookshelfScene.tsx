import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ASSETS } from '../assets/assetMap';
import { GameButton } from './GameButton';

interface BookshelfSceneProps {
  onBack: () => void;
}

export function BookshelfScene({ onBack }: BookshelfSceneProps) {
  const [returning, setReturning] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);

  const handleBack = () => {
    if (returning || journalOpen) return;
    setReturning(true);
    onBack();
  };

  useEffect(() => {
    if (!journalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setJournalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [journalOpen]);

  return (
    <motion.div
      className="scene-layer closeup-layer"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="artwork-stage artwork-stage--paper artwork-stage--bookshelf">
        <img
          src={ASSETS.bookshelfScene}
          alt="Rustic wooden shelf with potted ivy, leather-bound books, and an astrolabe"
          className="scene-image scene-image--contain"
          draggable={false}
        />

        {/* Clickable hotspot over the tilted journal book on the shelf */}
        <button
          type="button"
          className="cabin-hotspot bookshelf-book-hotspot"
          onClick={() => setJournalOpen(true)}
          disabled={journalOpen || returning}
          aria-label="Open Journal from shelf"
        >
          <span className="cabin-hotspot-tooltip" aria-hidden="true">
            Open Journal
          </span>
        </button>
      </div>

      <div className="scene-caption" aria-live="polite">
        Bookshelf
      </div>

      <div className="scene-back-bar">
        <GameButton
          onClick={handleBack}
          disabled={returning || journalOpen}
          ariaLabel="Back to Cabin"
        >
          ← Back
        </GameButton>
      </div>

      <AnimatePresence>
        {journalOpen && (
          <motion.div
            className="scroll-overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            onClick={() => setJournalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Vintage Omega Journal"
          >
            <motion.div
              className="scroll-overlay-stage"
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={ASSETS.journalSketch}
                alt="Journal — The First Message: A strange scroll was left on the desk. It speaks of five scattered memories and a person waiting to be remembered."
                className="journal-sketch-image"
                draggable={false}
              />
              <div className="scroll-overlay-footer">
                <GameButton
                  onClick={() => setJournalOpen(false)}
                  ariaLabel="Close Journal"
                >
                  Close Journal
                </GameButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
