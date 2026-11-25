import { useCallback, useEffect, useRef, useState } from 'react';
import { audioManager } from '../audio/AudioManager';
import { useScrollInteraction } from '../hooks/useScrollInteraction';
import type { CabinHotspotId, SceneState } from '../types/game';
import { SceneRenderer } from './SceneRenderer';
import { ScrollOverlay } from './ScrollOverlay';

export function Game() {
  const [scene, setScene] = useState<SceneState>('INTRO');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const {
    scrollOpen,
    openScroll,
    closeScroll,
  } = useScrollInteraction();

  // Attempt to start the opening soundtrack once when the game loads.
  useEffect(() => {
    audioManager.startOpening();
    return audioManager.subscribeBlocked(setAudioBlocked);
  }, []);

  // Track browser fullscreen state cleanly (Esc exits automatically).
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  const handleIntroEnded = useCallback(() => {
    setScene((prev) => (prev === 'INTRO' ? 'TITLE_CAMP' : prev));
  }, []);

  const handleStartGame = useCallback(() => {
    // Keep the soundtrack active across all scenes; also unlock if autoplay was blocked.
    audioManager.startOpening();
    setScene('CABIN');
  }, []);

  const handleSelectHotspot = useCallback((id: CabinHotspotId) => {
    setScene(id);
  }, []);

  const handleBackToCabin = useCallback(() => {
    setScene('CABIN');
  }, []);

  const enterFullscreen = useCallback(async () => {
    const container = viewportRef.current;
    if (!container || document.fullscreenElement) return;
    try {
      await container.requestFullscreen();
    } catch {
      // Ignore fullscreen rejection if browser blocks it.
    }
  }, []);

  return (
    <main ref={viewportRef} className="game-shell">
      <div className="game-viewport">
        <SceneRenderer
          scene={scene}
          scrollOpen={scrollOpen}
          onIntroEnded={handleIntroEnded}
          onStartGame={handleStartGame}
          onSelectHotspot={handleSelectHotspot}
          onBackToCabin={handleBackToCabin}
          onOpenScroll={openScroll}
        />

        <ScrollOverlay isOpen={scrollOpen} onClose={closeScroll} />

        {/* Subtle prompt only when browser blocks soundtrack autoplay */}
        {audioBlocked && (
          <button
            type="button"
            className="sound-unlock-pill"
            onClick={() => audioManager.startOpening()}
          >
            Click anywhere to enable soundtrack
          </button>
        )}

        {/* Show Enter Fullscreen only when not already in fullscreen (Esc exits fullscreen) */}
        {scene !== 'INTRO' && !isFullscreen && (
          <button
            type="button"
            className="fullscreen-toggle"
            onClick={enterFullscreen}
            aria-label="Enter Fullscreen"
            title="Enter Fullscreen (press Esc to exit)"
          >
            Fullscreen
          </button>
        )}
      </div>
    </main>
  );
}
