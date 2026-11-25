import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GameButton } from './GameButton';

interface ImageSceneProps {
  imageSrc: string;
  alt: string;
  caption?: string;
  stageClassName?: string;
  disableBack?: boolean;
  onBack: () => void;
  children?: ReactNode;
}

export function ImageScene({
  imageSrc,
  alt,
  caption,
  stageClassName = '',
  disableBack = false,
  onBack,
  children,
}: ImageSceneProps) {
  const [returning, setReturning] = useState(false);

  const handleBack = () => {
    if (returning || disableBack) return;
    setReturning(true);
    onBack();
  };

  return (
    <motion.div
      className="scene-layer closeup-layer"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className={`artwork-stage artwork-stage--paper ${stageClassName}`.trim()}>
        <img
          src={imageSrc}
          alt={alt}
          className="scene-image scene-image--contain"
          draggable={false}
        />
        {children}
      </div>

      {caption && (
        <div className="scene-caption" aria-live="polite">
          {caption}
        </div>
      )}

      <div className="scene-back-bar">
        <GameButton
          onClick={handleBack}
          disabled={returning || disableBack}
          ariaLabel="Back to Cabin"
        >
          ← Back
        </GameButton>
      </div>
    </motion.div>
  );
}
