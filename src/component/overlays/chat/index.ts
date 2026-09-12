import { ChatViewClient } from '@/component/chat';
import type { OverlayDefinition } from '../registry';
import { OVERLAY_CATALOG } from '../catalog';
import ChatBuilder from './ChatBuilder';

export const chatOverlayDef: OverlayDefinition = {
  ...OVERLAY_CATALOG.chat,
  component: ChatViewClient,
  builder: ChatBuilder,
};
