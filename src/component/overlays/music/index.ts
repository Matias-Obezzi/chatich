import type { OverlayDefinition } from '../registry';
import { OVERLAY_CATALOG } from '../catalog';
import MusicOverlay from './MusicOverlay';
import MusicBuilder from './MusicBuilder';

export const musicOverlayDef: OverlayDefinition = {
  ...OVERLAY_CATALOG.music,
  component: MusicOverlay,
  builder: MusicBuilder,
};
