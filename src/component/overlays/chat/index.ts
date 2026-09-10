import { ChatViewClient } from '@/component/chat';
import type { OverlayDefinition } from '../registry';
import ChatBuilder from './ChatBuilder';

export const chatOverlayDef: OverlayDefinition = {
  id: 'chat',
  name: 'Chat Overlay',
  description: 'Muestra el chat en vivo con soporte para múltiples plataformas.',
  component: ChatViewClient,
  builder: ChatBuilder,
};
