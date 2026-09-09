import type { OverlayDefinition } from '../registry';
import GoalsOverlay from './GoalsOverlay';
import GoalsBuilder from './GoalsBuilder';

export const goalsOverlayDef: OverlayDefinition = {
  id: 'goals',
  name: 'Goals Overlay',
  description: 'Muestra una barra de progreso para metas de subs, followers, bits o donaciones.',
  component: GoalsOverlay,
  builder: GoalsBuilder,
};
