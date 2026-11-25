import { useState } from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../assets/assetMap';

interface TitleScreenProps {
  onStartGame: () => void;
}

export function TitleScreen({ onStartGame }: TitleScreenProps) {
  const [starting, setStarting] = useState(false);

  const handleStartClick = () => {
    if (starting) return;
    setStarting(true);
    onStartGame();
  };

  return (
    <motion.div
      className="scene-layer title-camp-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: 'easeInOut' }}
    >
      {/* Bottom layer: Greek demigod summer camp background */}
      <img
        src={ASSETS.campBackground}
        alt="Greek demigod summer camp courtyard"
        className="scene-image scene-image--cover"
        draggable={false}
      />

      {/* Soft paper-wash vignette for depth without obscuring the camp */}
      <div className="camp-atmosphere-overlay" aria-hidden="true" />

      {/* Middle + Top layers: Emblem wrapper preserving exact 1672:941 aspect ratio */}
      <motion.div
        className="title-emblem-container"
        initial={{ opacity: 0, y: 10, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, delay: 0.15, ease: 'easeOut' }}
      >
        <img
          src={ASSETS.titleEmblem}
          alt="Requiem Memoriae — Five memories. One forgotten story. A person waiting to be remembered."
          className="title-emblem-image"
          draggable={false}
        />

        {/* Top layer: Interactive React button aligned precisely over the START GAME plaque */}
        <motion.button
          type="button"
          className="start-game-hitbox"
          onClick={handleStartClick}
          disabled={starting}
          aria-label="Start Game"
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

