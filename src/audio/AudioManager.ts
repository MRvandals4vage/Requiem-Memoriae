import { ASSETS } from '../assets/assetMap';

type BlockedListener = (blocked: boolean) => void;

/**
 * Singleton manager for the opening soundtrack.
 * Kept outside React state/lifecycle so re-renders or StrictMode double-mounts
 * never create duplicate audio instances or restart playback.
 */
class OpeningAudioManager {
  private audio: HTMLAudioElement | null = null;
  private shouldPlay = false;
  private unlockBound = false;
  private blocked = false;
  private listeners = new Set<BlockedListener>();

  private ensureAudio(): HTMLAudioElement {
    if (!this.audio) {
      const el = new Audio(ASSETS.openingSoundtrack);
      el.loop = true;
      el.preload = 'auto';
      el.volume = 0.25;
      this.audio = el;
    }
    return this.audio;
  }

  private setBlocked(value: boolean): void {
    if (this.blocked === value) return;
    this.blocked = value;
    this.listeners.forEach((fn) => fn(value));
  }

  public subscribeBlocked(listener: BlockedListener): () => void {
    this.listeners.add(listener);
    listener(this.blocked);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private handleFirstInteraction = (): void => {
    if (!this.shouldPlay) {
      this.detachUnlockListeners();
      return;
    }
    const audio = this.ensureAudio();
    if (!audio.paused) {
      this.setBlocked(false);
      this.detachUnlockListeners();
      return;
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.setBlocked(false);
          this.detachUnlockListeners();
        })
        .catch(() => {
          // Keep listener attached if browser still requires another gesture.
        });
    }
  };

  private attachUnlockListeners(): void {
    if (this.unlockBound) return;
    this.unlockBound = true;
    window.addEventListener('pointerdown', this.handleFirstInteraction, { capture: true, passive: true });
    window.addEventListener('keydown', this.handleFirstInteraction, { capture: true, passive: true });
  }

  private detachUnlockListeners(): void {
    if (!this.unlockBound) return;
    this.unlockBound = false;
    window.removeEventListener('pointerdown', this.handleFirstInteraction, { capture: true });
    window.removeEventListener('keydown', this.handleFirstInteraction, { capture: true });
  }

  /**
   * Starts the opening soundtrack if not already playing.
   * Falls back to starting on first user interaction if browser autoplay blocks it.
   */
  public startOpening(): void {
    this.shouldPlay = true;
    const audio = this.ensureAudio();

    if (!audio.paused) {
      this.setBlocked(false);
      this.detachUnlockListeners();
      return;
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.setBlocked(false);
          this.detachUnlockListeners();
        })
        .catch(() => {
          if (this.shouldPlay) {
            this.setBlocked(true);
            this.attachUnlockListeners();
          }
        });
    }
  }

  /**
   * Cleanly stops the opening soundtrack when entering the cabin.
   */
  public stopOpening(): void {
    this.shouldPlay = false;
    this.setBlocked(false);
    this.detachUnlockListeners();
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  /**
   * Audio hooks for parchment rustling when opening/closing the scroll.
   * Ready to wire up when dedicated rustle SFX assets are added.
   */
  public playScrollOpen(): void {
    // Hook for low-volume parchment unroll sound without interrupting soundtrack.
  }

  public playScrollClose(): void {
    // Hook for softer parchment roll-up sound without interrupting soundtrack.
  }
}

export const audioManager = new OpeningAudioManager();
