import { OverlayDefinition } from '../registry';
import AlertsOverlay from './AlertsOverlay';
import AlertsBuilder from './AlertsBuilder';

export const alertsOverlayDef: OverlayDefinition = {
    id: 'alerts',
    name: 'Alerts',
    description: 'Displays stream alerts with a queue system',
    component: AlertsOverlay,
    builder: AlertsBuilder,
    params: [
        { name: 'position', type: 'enum', options: ['top-left', 'top-center', 'top-right', 'center', 'bottom-left', 'bottom-center', 'bottom-right'], default: 'top-center', description: 'Position of the alerts on screen' },
        { name: 'duration', type: 'number', default: 6000, description: 'Duration in milliseconds each alert is shown' },
        { name: 'theme', type: 'enum', options: ['dark', 'light', 'neon'], default: 'dark', description: 'Visual theme for the alerts' },
        { name: 'accent', type: 'string', description: 'Hex color without # to override the accent color' },
        { name: 'sound', type: 'enum', options: ['0', '1'], default: '0', description: 'Whether to play a sound on alert' },
        { name: 'events', type: 'string', description: 'Comma-separated list of event types to alert on (empty = all)' },
    ]
};
