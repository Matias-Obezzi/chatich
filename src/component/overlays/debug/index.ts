import { OverlayDefinition } from '../registry';
import DebugOverlay from './DebugOverlay';

export const debugOverlayDef: OverlayDefinition = {
    id: 'debug',
    name: 'Debug Tool',
    description: 'Utility overlay to emit synthetic events',
    component: DebugOverlay
};
