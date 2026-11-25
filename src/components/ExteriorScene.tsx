import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSETS } from '../assets/assetMap';

interface ExteriorSceneProps {
  onBack: () => void;
}

type DialogueId =
  | 'intro'
  | 'path'
  | 'campers'
  | 'campfire'
  | 'temple'
  | 'cabins'
  | null;

interface DialogueContent {
  text: string;
  prompt?: string;
}

const DIALOGUES: Record<string, DialogueContent> = {
  intro: {
    text: '...Okay. Definitely not home.',
  },
  path: {
    text: 'The path winds through the cabins and towards the heart of the camp. You can hear distant voices and the occasional clang of metal.',
    prompt: 'Follow the Path',
  },
  campers: {
    text: 'A few campers are gathered around the fire, talking amongst themselves. Nobody seems particularly surprised to be here.',
  },
  campfire: {
    text: 'The fire crackles quietly. It looks like this is where the campers gather in the evenings.',
  },
  temple: {
    text: 'The building dominates the courtyard. Its columns and strange emblem make it look far older than the surrounding cabins.',
  },
  cabins: {
    text: 'Rows of cabins line the courtyard. Each seems to have its own distinctive emblem.',
  },
};

export function ExteriorScene({ onBack }: ExteriorSceneProps) {
  const [interactionsEnabled, setInteractionsEnabled] = useState(false);
  const [activeDialogue, setActiveDialogue] = useState<DialogueId>('intro');
  const [returning, setReturning] = useState(false);

  // Show intro dialogue, then enable interactions after it's dismissed
  useEffect(() => {
    // intro auto-starts; interactions enabled after player dismisses it
  }, []);

  const closeDialogue = () => {
    if (activeDialogue === 'intro') {
      setInteractionsEnabled(true);
    }
    setActiveDialogue(null);
  };

  const openDialogue = (id: DialogueId) => {
    if (!interactionsEnabled || returning) return;
    setActiveDialogue(id);
  };

  const handleBack = () => {
    if (returning) return;
    setReturning(true);
    onBack();
  };

  const isDisabled = !interactionsEnabled || returning || activeDialogue !== null;

  return (
    <motion.div
      className="scene-layer cabin-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
    >
      <div className="artwork-stage artwork-stage--exterior">
        <img
          src={ASSETS.exteriorScene}
          alt="Cabin porch view overlooking Asteria camp courtyard"
          className="scene-image scene-image--cover"
          draggable={false}
        />

        {/* PATH hotspot — lower-centre, the path leading into camp */}
        <button
          type="button"
          className="cabin-hotspot"
          style={{ left: '35%', top: '70%', width: '30%', height: '25%', zIndex: 3 }}
          onClick={() => openDialogue('path')}
          disabled={isDisabled}
          aria-label="Path to camp"
        >
          <span className="cabin-hotspot-tooltip" aria-hidden="true">Path to Camp</span>
        </button>

        {/* CAMPERS hotspot — mid area */}
        <button
          type="button"
          className="cabin-hotspot"
          style={{ left: '25%', top: '55%', width: '20%', height: '20%', zIndex: 3 }}
          onClick={() => openDialogue('campers')}
          disabled={isDisabled}
          aria-label="Inspect campers"
        >
          <span className="cabin-hotspot-tooltip" aria-hidden="true">Campers</span>
        </button>

        {/* CAMPFIRE hotspot — lower-left area */}
        <button
          type="button"
          className="cabin-hotspot"
          style={{ left: '15%', top: '62%', width: '14%', height: '18%', zIndex: 3 }}
          onClick={() => openDialogue('campfire')}
          disabled={isDisabled}
          aria-label="Inspect campfire"
        >
          <span className="cabin-hotspot-tooltip" aria-hidden="true">Campfire</span>
        </button>

        {/* TEMPLE hotspot — upper-centre/right, prominent building */}
        <button
          type="button"
          className="cabin-hotspot"
          style={{ left: '50%', top: '20%', width: '30%', height: '35%', zIndex: 3 }}
          onClick={() => openDialogue('temple')}
          disabled={isDisabled}
          aria-label="Inspect temple"
        >
          <span className="cabin-hotspot-tooltip" aria-hidden="true">Temple</span>
        </button>

        {/* CABINS hotspot — right side */}
        <button
          type="button"
          className="cabin-hotspot"
          style={{ left: '75%', top: '45%', width: '20%', height: '30%', zIndex: 3 }}
          onClick={() => openDialogue('cabins')}
          disabled={isDisabled}
          aria-label="Inspect nearby cabins"
        >
          <span className="cabin-hotspot-tooltip" aria-hidden="true">Nearby Cabins</span>
        </button>

        {/* RETURN hotspot — left/front porch area */}
        <button
          type="button"
          className="cabin-hotspot cabin-hotspot--return"
          style={{ left: '2%', top: '60%', width: '14%', height: '30%', zIndex: 3 }}
          onClick={handleBack}
          disabled={!interactionsEnabled || returning}
          aria-label="Return to cabin bedroom"
        >
          <span className="cabin-hotspot-tooltip" aria-hidden="true">Return to Cabin</span>
        </button>
      </div>

      {/* Scene label */}
      <div className="scene-caption" aria-live="polite">
        Outside — Asteria Camp
      </div>

      {/* Dialogue overlay */}
      <AnimatePresence>
        {activeDialogue && DIALOGUES[activeDialogue] && (
          <motion.div
            className="window-dialogue-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className="window-dialogue-box"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="window-dialogue-text">
                {DIALOGUES[activeDialogue].text}
              </p>
              <div className="window-dialogue-actions">
                <button
                  type="button"
                  className="storybook-button"
                  onClick={closeDialogue}
                >
                  {activeDialogue === 'intro' ? 'Look around →' : 'Close'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

