import type { OverlayDefinition } from '../registry';
import { OVERLAY_CATALOG } from '../catalog';
import ScreenOverlay from './ScreenOverlay';
import ScreenBuilder from './ScreenBuilder';

export const screenOverlayDef: OverlayDefinition = {
  ...OVERLAY_CATALOG.screen,
  component: ScreenOverlay,
  builder: ScreenBuilder,
};
