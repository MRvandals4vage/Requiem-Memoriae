import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GameButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export function GameButton({
  onClick,
  children,
  className = '',
  ariaLabel,
  disabled = false,
}: GameButtonProps) {
  return (
    <motion.button
      type="button"
      className={`storybook-button ${className}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
    >
      {children}
    </motion.button>
  );
}

