import type { ComponentType } from 'react';
import { alertsOverlayDef } from './alerts';
import { debugOverlayDef } from './debug';
import { chatOverlayDef } from './chat';
import { goalsOverlayDef } from './goals';
import { emotesOverlayDef } from './emotes';
import { pollsOverlayDef } from './polls';
import { statusOverlayDef } from './status';
import { screenOverlayDef } from './screen';
import { musicOverlayDef } from './music';

export type OverlayDefinition = {
  id: string;
  name: string;
  description: string;
  component: ComponentType;
  builder?: ComponentType;
  params?: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'enum';
    options?: string[];
    default?: string | number | boolean;
    description: string;
  }>;
};

export const OVERLAYS: Record<string, OverlayDefinition> = {
  alerts: alertsOverlayDef,
  debug: debugOverlayDef,
  chat: chatOverlayDef,
  goals: goalsOverlayDef,
  emotes: emotesOverlayDef,
  polls: pollsOverlayDef,
  status: statusOverlayDef,
  screen: screenOverlayDef,
  music: musicOverlayDef,
};

export function getOverlay(id: string): OverlayDefinition | undefined {
  return OVERLAYS[id];
}
