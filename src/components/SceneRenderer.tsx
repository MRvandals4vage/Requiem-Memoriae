import { AnimatePresence } from 'framer-motion';
import { ASSETS } from '../assets/assetMap';
import type { CabinHotspotId, SceneState } from '../types/game';
import { IntroPlayer } from './IntroPlayer';
import { TitleScreen } from './TitleScreen';
import { CabinScene } from './CabinScene';
import { ImageScene } from './ImageScene';
import { BookshelfScene } from './BookshelfScene';
import { ScrollHotspot } from './ScrollHotspot';

interface SceneRendererProps {
  scene: SceneState;
  scrollOpen: boolean;
  onIntroEnded: () => void;
  onStartGame: () => void;
  onSelectHotspot: (id: CabinHotspotId) => void;
  onBackToCabin: () => void;
  onOpenScroll: () => void;
}

export function SceneRenderer({
  scene,
  scrollOpen,
  onIntroEnded,
  onStartGame,
  onSelectHotspot,
  onBackToCabin,
  onOpenScroll,
}: SceneRendererProps) {
  return (
    <AnimatePresence mode="sync">
      {scene === 'INTRO' && (
        <IntroPlayer key="INTRO" onEnded={onIntroEnded} />
      )}

      {scene === 'TITLE_CAMP' && (
        <TitleScreen key="TITLE_CAMP" onStartGame={onStartGame} />
      )}

      {scene === 'CABIN' && (
        <CabinScene
          key="CABIN"
          onSelectHotspot={onSelectHotspot}
          scrollOpen={scrollOpen}
        />
      )}

      {scene === 'DESK' && (
        <ImageScene
          key="DESK"
          imageSrc={ASSETS.deskScene}
          alt="Close-up of the monochrome writing desk with headphones, glasses, FLA textbook, Water Pollution textbook, and feather pen"
          caption="Writing Desk"
          stageClassName="artwork-stage--desk"
          disableBack={scrollOpen}
          onBack={onBackToCabin}
        >
          <ScrollHotspot
            variant="desk"
            onOpen={onOpenScroll}
            isOpen={scrollOpen}
          />
        </ImageScene>
      )}

      {scene === 'CHEST' && (
        <ImageScene
          key="CHEST"
          imageSrc={ASSETS.chestScene}
          alt="Close-up of the riveted domed wooden storage chest"
          caption="Storage Chest"
          onBack={onBackToCabin}
        />
      )}

      {scene === 'BEDSIDE' && (
        <ImageScene
          key="BEDSIDE"
          imageSrc={ASSETS.bedsideScene}
          alt="Close-up of the bedside nightstand with lantern, flower vase, star-emblem book, and locked box"
          caption="Bedside Table"
          onBack={onBackToCabin}
        />
      )}

      {scene === 'BOOKSHELF' && (
        <BookshelfScene key="BOOKSHELF" onBack={onBackToCabin} />
      )}
    </AnimatePresence>
  );
}
