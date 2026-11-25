export type SceneState =
  | 'INTRO'
  | 'TITLE_CAMP'
  | 'CABIN'
  | 'DESK'
  | 'CHEST'
  | 'BEDSIDE'
  | 'BOOKSHELF'
  | 'CABIN_EXTERIOR';

export type CabinHotspotId = 'DESK' | 'CHEST' | 'BEDSIDE' | 'BOOKSHELF' | 'WINDOW';

export interface HotspotConfig {
  id: CabinHotspotId;
  label: string;
  /** Percentage coordinates relative to the 16:9 cabin artwork container */
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex?: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
}

