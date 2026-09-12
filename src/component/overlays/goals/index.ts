import type { OverlayDefinition } from '../registry';
import { OVERLAY_CATALOG } from '../catalog';
import GoalsOverlay from './GoalsOverlay';
import GoalsBuilder from './GoalsBuilder';

export const goalsOverlayDef: OverlayDefinition = {
  ...OVERLAY_CATALOG.goals,
  component: GoalsOverlay,
  builder: GoalsBuilder,
};
