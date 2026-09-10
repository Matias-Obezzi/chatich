'use client';

import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStreamEvent } from '@/contexts/streamContext';
import { StreamEvent } from '@/lib/events/types';
import DebugPanel from '../debug/DebugPanel';

const DEFAULT_EMOTES = ['🎮', '🕹️', '👾', '🏆', '⭐', '🔥', '💯', '👻', '💀', '🤡', '👽', 'Kappa', 'Pog', 'LUL', 'KEKW', 'GG'];

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  size: number;
  text: string;
};

export default function EmotesOverlay() {
  const searchParams = useSearchParams();
  const density = searchParams.get('density') || 'medium';
  const speed = searchParams.get('speed') || 'normal';
  const sizeParam = parseInt(searchParams.get('size') || '40', 10);
  const trigger = searchParams.get('trigger') || 'all';
  const isDebug = searchParams.get('debug') === '1';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const lastIdRef = useRef(0);
  const cachedSpritesRef = useRef<Record<string, HTMLCanvasElement>>({});

  let densityMultiplier = 1;
  if (density === 'low') densityMultiplier = 0.5;
  if (density === 'high') densityMultiplier = 2;

  let speedMultiplier = 1;
  if (speed === 'slow') speedMultiplier = 0.5;
  if (speed === 'fast') speedMultiplier = 2;

  useEffect(() => {
    const sprites: Record<string, HTMLCanvasElement> = {};
    for (const emote of DEFAULT_EMOTES) {
      const c = document.createElement('canvas');
      c.width = 80;
      c.height = 80;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.font = 'bold 56px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        
        if (emote.length > 2) { // It's a text emote like Kappa
          ctx.fillStyle = '#ffffff';
          ctx.fillText(emote, 40, 40);
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#000000';
          ctx.strokeText(emote, 40, 40);
        } else {
          ctx.fillText(emote, 40, 40);
        }
      }
      sprites[emote] = c;
    }
    cachedSpritesRef.current = sprites;
  }, []);

  const spawnParticles = (count: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const width = canvas.width;
    const maxParticles = density === 'high' ? 120 : 80;
    
    for (let i = 0; i < count; i++) {
      if (particlesRef.current.length >= maxParticles) break;
      const text = DEFAULT_EMOTES[Math.floor(Math.random() * DEFAULT_EMOTES.length)];
      particlesRef.current.push({
        id: lastIdRef.current++,
        x: Math.random() * width,
        y: -sizeParam - Math.random() * 50,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() * 3 + 2) * speedMultiplier,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.1,
        size: sizeParam * (0.8 + Math.random() * 0.4),
        text
      });
    }
  };

  const handleEvent = (e: StreamEvent) => {
    let burstCount = 0;
    switch (e.type) {
      case 'chat.message':
        if (trigger === 'all') {
          burstCount = 1;
        }
        break;
      case 'sub.new':
      case 'sub.resub':
      case 'member.new':
        burstCount = 20;
        break;
      case 'sub.gift':
        burstCount = (e.count || 1) * 10;
        break;
      case 'raid':
      case 'host':
        burstCount = Math.min((e.viewers || 10) * 2, 200);
        break;
      case 'superchat':
        burstCount = 30;
        break;
    }
    
    if (burstCount > 0) {
      spawnParticles(Math.ceil(burstCount * densityMultiplier));
    }
  };

  useStreamEvent('chat.message', handleEvent);
  useStreamEvent('sub.new', handleEvent);
  useStreamEvent('sub.resub', handleEvent);
  useStreamEvent('sub.gift', handleEvent);
  useStreamEvent('raid', handleEvent);
  useStreamEvent('host', handleEvent);
  useStreamEvent('superchat', handleEvent);
  useStreamEvent('member.new', handleEvent);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'test_burst') {
        spawnParticles(event.data.count * densityMultiplier);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [densityMultiplier, sizeParam, speedMultiplier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let lastTime = performance.now();

    const animate = (time: number) => {
      const dtRaw = (time - lastTime) / 16.66;
      const dt = Math.min(dtRaw, 2);
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeCount = 0;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.vr * dt;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        const sprite = cachedSpritesRef.current[p.text];
        if (sprite) {
          ctx.drawImage(sprite, -p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();

        if (p.y - p.size < canvas.height) {
          particlesRef.current[activeCount++] = p;
        }
      }

      particlesRef.current.length = activeCount;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-transparent overflow-hidden pointer-events-none fixed inset-0">
      {isDebug && (
        <div className="absolute top-4 left-4 z-50 pointer-events-auto bg-slate-900/90 p-4 rounded-xl border border-slate-700 text-white flex flex-col gap-2">
          <h3 className="font-bold mb-2">Debug Rain</h3>
          <button 
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm"
            onClick={() => spawnParticles(20 * densityMultiplier)}
          >
            Lluvia (20)
          </button>
          <button 
            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm"
            onClick={() => spawnParticles(100 * densityMultiplier)}
          >
            Raid (100)
          </button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
