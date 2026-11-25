import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../assets/assetMap';

interface IntroPlayerProps {
  onEnded: () => void;
}

export function IntroPlayer({ onEnded }: IntroPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const endedRef = useRef(false);

  const finishIntro = () => {
    if (endedRef.current) return;
    endedRef.current = true;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onEnded();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    endedRef.current = false;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const resume = () => {
            window.removeEventListener('pointerdown', resume);
            window.removeEventListener('keydown', resume);
            if (!endedRef.current) {
              void video.play().catch(() => {});
            }
          };
          window.addEventListener('pointerdown', resume, { once: true, passive: true });
          window.addEventListener('keydown', resume, { once: true, passive: true });
        });
      }
    };

    attemptPlay();
  }, []);

  return (
    <motion.div
      className="scene-layer intro-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.85, ease: 'easeInOut' }}
    >
      <video
        ref={videoRef}
        className="intro-video"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finishIntro}
        onError={finishIntro}
      >
        <source src={ASSETS.introVideoH264} type="video/mp4" />
        <source src={ASSETS.introVideo} type="video/mp4" />
      </video>
    </motion.div>
  );
}
