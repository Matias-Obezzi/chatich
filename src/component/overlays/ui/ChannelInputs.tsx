'use client';

import React from 'react';
import { useChannels, type Channels } from '@/lib/useChannels';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';

type PlatformInput = {
    key: keyof Channels;
    label: string;
    placeholder: string;
    dotClass: string;
};

const PLATFORMS: PlatformInput[] = [
    { key: 'twitch', label: 'Twitch', placeholder: 'ibai', dotClass: 'bg-twitch' },
    { key: 'kick', label: 'Kick', placeholder: 'elxokas', dotClass: 'bg-kick' },
    { key: 'youtube', label: 'YouTube (ID del canal)', placeholder: 'UC...', dotClass: 'bg-youtube' },
];

/**
 * Inputs de canal compartidos por todos los builders: siempre con label visible
 * y el color de cada plataforma. Los valores se persisten en localStorage vía useChannels.
 */
export default function ChannelInputs({ className }: { className?: string }) {
    const { channels, updateChannels } = useChannels();

    return (
        <div className={className}>
            <div className="space-y-3">
                {PLATFORMS.map((platform) => (
                    <div key={platform.key}>
                        <Label htmlFor={`channel-${platform.key}`} className="text-sm font-medium text-text/90 mb-1.5">
                            <span className={`w-2 h-2 rounded-full ${platform.dotClass}`} aria-hidden="true" />
                            {platform.label}
                        </Label>
                        <Input
                            id={`channel-${platform.key}`}
                            type="text"
                            value={channels[platform.key]}
                            placeholder={platform.placeholder}
                            onChange={(e) => updateChannels({ [platform.key]: e.target.value })}
                        />
                    </div>
                ))}
            </div>
            <p className="text-xs text-muted mt-2">Completá solo las plataformas que uses.</p>
        </div>
    );
}
