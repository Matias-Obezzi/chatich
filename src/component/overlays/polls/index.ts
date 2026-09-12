import type { OverlayDefinition } from '../registry';
import { OVERLAY_CATALOG } from '../catalog';
import PollsOverlay from './PollsOverlay';
import PollsBuilder from './PollsBuilder';

export const pollsOverlayDef: OverlayDefinition = {
  ...OVERLAY_CATALOG.polls,
  component: PollsOverlay,
  builder: PollsBuilder,
};
