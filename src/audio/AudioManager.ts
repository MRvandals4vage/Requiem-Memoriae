import { ASSETS } from '../assets/assetMap';

type BlockedListener = (blocked: boolean) => void;

/**
 * Singleton manager for the opening soundtrack and ambient audio.
 * Kept outside React state/lifecycle so re-renders or StrictMode double-mounts
 * never create duplicate audio instances or restart playback.
 */
class OpeningAudioManager {
  private audio: HTMLAudioElement | null = null;
  private ambience: HTMLAudioElement | null = null;
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
   * Cleanly stops the opening soundtrack.
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
   * Start outdoor ambience (crossfade from indoor).
   */
  public startOutdoorAmbience(): void {
    if (!this.ambience) {
      this.ambience = new Audio(ASSETS.outdoorAmbience);
      this.ambience.loop = true;
      this.ambience.preload = 'auto';
      this.ambience.volume = 0;
    }
    if (this.ambience.paused) {
      this.ambience.play().catch(() => {/* ignore */});
    }
    // Fade in
    this.fadeVolume(this.ambience, 0, 0.18, 1200);
  }

  /**
   * Stop outdoor ambience (fade out).
   */
  public stopOutdoorAmbience(): void {
    if (!this.ambience) return;
    this.fadeVolume(this.ambience, this.ambience.volume, 0, 800, () => {
      if (this.ambience) {
        this.ambience.pause();
        this.ambience.currentTime = 0;
      }
    });
  }

  private fadeVolume(
    el: HTMLAudioElement,
    from: number,
    to: number,
    durationMs: number,
    onDone?: () => void,
  ): void {
    const steps = 30;
    const stepMs = durationMs / steps;
    const delta = (to - from) / steps;
    let current = from;
    el.volume = Math.max(0, Math.min(1, from));
    let count = 0;
    const id = setInterval(() => {
      count++;
      current += delta;
      el.volume = Math.max(0, Math.min(1, current));
      if (count >= steps) {
        clearInterval(id);
        el.volume = Math.max(0, Math.min(1, to));
        onDone?.();
      }
    }, stepMs);
  }

  /**
   * Audio hooks for parchment rustling when opening/closing the scroll.
   */
  public playScrollOpen(): void {
    // Hook for low-volume parchment unroll sound without interrupting soundtrack.
  }

  public playScrollClose(): void {
    // Hook for softer parchment roll-up sound without interrupting soundtrack.
  }
}

export const audioManager = new OpeningAudioManager();
