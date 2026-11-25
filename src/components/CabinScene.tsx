import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSETS } from '../assets/assetMap';
import type { CabinHotspotId, HotspotConfig } from '../types/game';
import { Hotspot } from './Hotspot';

interface CabinSceneProps {
  onSelectHotspot: (target: Exclude<CabinHotspotId, 'WINDOW'>) => void;
  onWindowClick: () => void;
  scrollOpen: boolean;
  /** While the window dialogue/explore flow is active */
  windowActive: boolean;
  /** Show the "EXPLORE OUTSIDE" prompt */
  showExplorePrompt: boolean;
  onExploreOutside: () => void;
  onDismissWindow: () => void;
}

const CABIN_HOTSPOTS: HotspotConfig[] = [
  {
    id: 'BEDSIDE',
    label: 'Bedside Table',
    left: 2.5,
    top: 46.5,
    width: 14.5,
    height: 45,
    zIndex: 2,
  },
  {
    id: 'BOOKSHELF',
    label: 'Bookshelf',
    left: 81.5,
    top: 16.5,
    width: 18,
    height: 24,
    zIndex: 2,
  },
  {
    id: 'DESK',
    label: 'Writing Desk',
    left: 73.5,
    top: 43,
    width: 23.5,
    height: 39,
    zIndex: 2,
  },
  {
    id: 'CHEST',
    label: 'Storage Chest',
    left: 88.5,
    top: 63.5,
    width: 11.5,
    height: 27,
    zIndex: 3,
  },
];

export function CabinScene({
  onSelectHotspot,
  onWindowClick,
  scrollOpen,
  windowActive,
  showExplorePrompt,
  onExploreOutside,
  onDismissWindow,
}: CabinSceneProps) {
  const [locked, setLocked] = useState(false);

  const handleSelect = (id: CabinHotspotId) => {
    if (locked || scrollOpen || windowActive) return;
    if (id === 'WINDOW') return; // handled separately
    setLocked(true);
    onSelectHotspot(id as Exclude<CabinHotspotId, 'WINDOW'>);
  };

  const handleWindowClick = () => {
    if (locked || scrollOpen || windowActive) return;
    onWindowClick();
  };

  const isDisabled = locked || scrollOpen || windowActive;

  return (
    <motion.div
      className="scene-layer cabin-layer"
      initial={{ opacity: 0, scale: 1.015 }}
      animate={{
        opacity: 1,
        scale: windowActive ? 1.06 : 1,
      }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      style={{ transformOrigin: windowActive ? '50% 30%' : '50% 50%' }}
    >
      <div className="artwork-stage artwork-stage--cabin">
        <img
          src={ASSETS.cabinBackground}
          alt="Cozy rustic cabin bedroom"
          className="scene-image scene-image--cover"
          draggable={false}
        />

        {/* Regular hotspots (disabled when window active) */}
        {CABIN_HOTSPOTS.map((spot) => (
          <Hotspot
            key={spot.id}
            config={spot}
            onSelect={handleSelect}
            disabled={isDisabled}
          />
        ))}

        {/* Window hotspot — the central window in the bedroom artwork */}
        <button
          type="button"
          className="cabin-hotspot cabin-hotspot--window"
          style={{
            left: '30%',
            top: '8%',
            width: '40%',
            height: '38%',
            zIndex: 2,
          }}
          onClick={handleWindowClick}
          disabled={isDisabled}
          aria-label="Look out the window"
        >
          <span className="cabin-hotspot-tooltip" aria-hidden="true">
            Window
          </span>
        </button>
      </div>

      {/* Window interaction dialogue overlay */}
      <AnimatePresence>
        {windowActive && (
          <motion.div
            className="window-dialogue-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="window-dialogue-box"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="window-dialogue-text">
                "There's something outside... I should probably find out where I am."
              </p>

              <div className="window-dialogue-actions">
                {showExplorePrompt ? (
                  <>
                    <button
                      type="button"
                      className="storybook-button explore-outside-btn"
                      onClick={onExploreOutside}
                    >
                      Explore Outside
                    </button>
                    <button
                      type="button"
                      className="storybook-button window-dismiss-btn"
                      onClick={onDismissWindow}
                    >
                      Not Yet
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="storybook-button"
                    onClick={onDismissWindow}
                    aria-label="Continue"
                  >
                    Continue →
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
