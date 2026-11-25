import { useCallback, useState } from 'react';
import { audioManager } from '../audio/AudioManager';
import type { JournalEntry } from '../types/game';

const FIRST_MESSAGE_ENTRY: JournalEntry = {
  id: 'first-message',
  title: 'The First Message',
  body: 'A strange scroll was left on the desk. It speaks of five scattered memories and a person waiting to be remembered.',
};

export function useScrollInteraction() {
  const [scrollDiscovered, setScrollDiscovered] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const openScroll = useCallback(() => {
    setScrollOpen(true);
    audioManager.playScrollOpen();

    setScrollDiscovered((alreadyDiscovered) => {
      if (!alreadyDiscovered) {
        setJournalEntries((prev) =>
          prev.some((entry) => entry.id === FIRST_MESSAGE_ENTRY.id)
            ? prev
            : [...prev, FIRST_MESSAGE_ENTRY]
        );
      }
      return true;
    });
  }, []);

  const closeScroll = useCallback(() => {
    setScrollOpen(false);
    audioManager.playScrollClose();
  }, []);

  return {
    scrollDiscovered,
    scrollOpen,
    journalEntries,
    openScroll,
    closeScroll,
  };
}

