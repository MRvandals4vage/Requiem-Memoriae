import { motion } from 'framer-motion';
import { ASSETS } from '../assets/assetMap';

interface ScrollHotspotProps {
  variant: 'cabin' | 'desk';
  onOpen: () => void;
  disabled?: boolean;
  isOpen?: boolean;
}

export function ScrollHotspot({
  variant,
  onOpen,
  disabled = false,
  isOpen = false,
}: ScrollHotspotProps) {
  return (
    <motion.button
      type="button"
      className={`scroll-hotspot scroll-hotspot--${variant}`}
      onClick={() => {
        if (!disabled && !isOpen) onOpen();
      }}
      disabled={disabled || isOpen}
      aria-label="Inspect sealed scroll on desk"
      animate={{
        opacity: isOpen ? 0 : 1,
        scale: isOpen ? 1.08 : 1,
      }}
      whileHover={disabled || isOpen ? undefined : { scale: 1.035 }}
      whileTap={disabled || isOpen ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <img
        src={ASSETS.scrollClosed}
        alt="Sealed parchment scroll with Omega wax seal"
        className="scroll-hotspot-image"
        draggable={false}
      />
      <span className="cabin-hotspot-tooltip" aria-hidden="true">
        Examine Scroll
      </span>
    </motion.button>
  );
}

