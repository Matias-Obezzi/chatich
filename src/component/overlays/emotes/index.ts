import { OverlayDefinition } from '../registry';
import EmotesOverlay from './EmotesOverlay';
import EmotesBuilder from './EmotesBuilder';

export const emotesOverlayDef: OverlayDefinition = {
  id: 'emotes',
  name: 'Emote Rain',
  description: 'Lluvia de emotes en pantalla ante eventos y mensajes',
  component: EmotesOverlay,
  builder: EmotesBuilder,
  params: [
    { name: 'density', type: 'enum', options: ['low', 'medium', 'high'], default: 'medium', description: 'Densidad de la lluvia' },
    { name: 'speed', type: 'enum', options: ['slow', 'normal', 'fast'], default: 'normal', description: 'Velocidad de caída' },
    { name: 'size', type: 'number', default: 40, description: 'Tamaño de los emotes en px' },
    { name: 'trigger', type: 'enum', options: ['all', 'special'], default: 'all', description: 'Eventos que disparan la lluvia' }
  ]
};
