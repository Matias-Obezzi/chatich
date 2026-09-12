import type { OverlayDefinition } from '../registry';
import { OVERLAY_CATALOG } from '../catalog';
import StatusOverlay from './StatusOverlay';
import StatusBuilder from './StatusBuilder';

export const statusOverlayDef: OverlayDefinition = {
  ...OVERLAY_CATALOG.status,
  component: StatusOverlay,
  builder: StatusBuilder,
};
