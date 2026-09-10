'use client';

import React from 'react';
import { useStream } from '@/contexts/streamContext';
import { StreamEvent, EventActor } from '@/lib/events/types';

export default function DebugPanel() {
    const { bus } = useStream();

    const createActor = (): EventActor => ({
        username: 'test_user_' + Math.floor(Math.random() * 1000),
        displayName: 'Test User',
        color: '#FF5733'
    });

    const emitEvent = (e: Partial<StreamEvent>) => {
        if (!bus) return;
        const fullEvent = {
            id: crypto.randomUUID(),
            platform: 'twitch' as const,
            channel: 'test_channel',
            timestamp: Date.now(),
            ...e
        } as StreamEvent;
        bus.emit(fullEvent);
    };

    const fireGiftBomb = () => {
        if (!bus) return;
        const actor = createActor();
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const event = {
                    id: crypto.randomUUID(),
                    platform: 'twitch' as const,
                    channel: 'test_channel',
                    timestamp: Date.now(),
                    type: 'sub.gift' as const,
                    actor,
                    count: 1
                } as StreamEvent;
                bus.emit(event);
            }, i * 200);
        }
    };

    return (
        <div className="bg-slate-800 text-white p-4 rounded shadow-lg flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold mb-2">Debug Actions</h3>
            <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded" onClick={() => emitEvent({ type: 'sub.new', actor: createActor(), tier: '1' })}>Simulate Sub</button>
            <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded" onClick={() => emitEvent({ type: 'sub.resub', actor: createActor(), months: 5, text: 'Love the stream!' })}>Simulate Resub</button>
            <button className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded" onClick={() => emitEvent({ type: 'sub.gift', actor: createActor(), count: 1 })}>Simulate Gift Sub</button>
            <button className="bg-fuchsia-600 hover:bg-fuchsia-700 px-3 py-1 rounded font-bold" onClick={fireGiftBomb}>Simulate Gift Bomb (x5)</button>
            <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded" onClick={() => emitEvent({ type: 'cheer', actor: createActor(), bits: 500, text: 'peepoCheer' })}>Simulate Cheer</button>
            <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded" onClick={() => emitEvent({ type: 'raid', actor: createActor(), viewers: 125 })}>Simulate Raid</button>
            <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded" onClick={() => emitEvent({ type: 'host', actor: createActor(), viewers: 42 })}>Simulate Host</button>
            <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded" onClick={() => emitEvent({ type: 'superchat', actor: createActor(), amount: 10, currency: 'USD', tierColor: '#FFD700', text: 'Great content!' })}>Simulate Superchat</button>
            <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded" onClick={() => emitEvent({ type: 'member.new', actor: createActor(), tierName: 'Gold Member' })}>Simulate New Member</button>
        </div>
    );
}
