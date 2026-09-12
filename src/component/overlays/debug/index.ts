import { OverlayDefinition } from '../registry';
import { OVERLAY_CATALOG } from '../catalog';
import DebugOverlay from './DebugOverlay';
import DebugBuilder from './DebugBuilder';

export const debugOverlayDef: OverlayDefinition = {
  ...OVERLAY_CATALOG.debug,
    component: DebugOverlay,
    builder: DebugBuilder
};
