import { useState } from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../assets/assetMap';
import type { CabinHotspotId, HotspotConfig } from '../types/game';
import { Hotspot } from './Hotspot';

interface CabinSceneProps {
  onSelectHotspot: (target: CabinHotspotId) => void;
  scrollOpen: boolean;
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
  scrollOpen,
}: CabinSceneProps) {
  const [locked, setLocked] = useState(false);

  const handleSelect = (id: CabinHotspotId) => {
    if (locked || scrollOpen) return;
    setLocked(true);
    onSelectHotspot(id);
  };

  return (
    <motion.div
      className="scene-layer cabin-layer"
      initial={{ opacity: 0, scale: 1.015 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    >
      <div className="artwork-stage artwork-stage--cabin">
        <img
          src={ASSETS.cabinBackground}
          alt="Cozy rustic cabin bedroom"
          className="scene-image scene-image--cover"
          draggable={false}
        />

        {CABIN_HOTSPOTS.map((spot) => (
          <Hotspot
            key={spot.id}
            config={spot}
            onSelect={handleSelect}
            disabled={locked || scrollOpen}
          />
        ))}
      </div>
    </motion.div>
  );
}
