import { useEffect } from 'react';
import { ASSETS } from '../assets/assetMap';
import type { JournalEntry } from '../types/game';
import { GameButton } from './GameButton';

interface ScrollMessageProps {
  entries: JournalEntry[];
  onClose: () => void;
}

export const SCROLL_MESSAGE_TEXT =
  'Five memories lie scattered across the past, fragments of a life you once shared. Walk through what was, and uncover what still remains. Find all five, and you may remember—the person you have forgotten.';

/**
 * Displays the Vintage Omega Journal illustration for discovered story notes.
 */
export function ScrollMessage({ entries, onClose }: ScrollMessageProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const summary = entries.map((e) => `${e.title}: ${e.body}`).join(' ');

  return (
    <div
      className="scroll-overlay-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Discovery Journal"
    >
      <div className="scroll-overlay-stage" onClick={(e) => e.stopPropagation()}>
        <img
          src={ASSETS.journalSketch}
          alt={summary || 'Vintage Omega Journal'}
          className="journal-sketch-image"
          draggable={false}
        />
        <div className="scroll-overlay-footer">
          <GameButton onClick={onClose} ariaLabel="Close Journal">
            Close Journal
          </GameButton>
        </div>
      </div>
    </div>
  );
}
