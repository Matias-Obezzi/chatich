'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStreamEvent } from '@/contexts/streamContext';

export type GoalsOverlayProps = {
  config?: {
    type: string;
    title: string;
    target: number;
    current: number;
    theme: string;
    color: string;
  };
};

export default function GoalsOverlay({ config }: GoalsOverlayProps) {
  const searchParams = useSearchParams();
  
  const goalType = config?.type || searchParams.get('type') || 'subs';
  const title = config?.title || searchParams.get('title') || 'Goal';
  const target = config?.target ?? parseInt(searchParams.get('target') || '100', 10);
  const initialValue = config?.current ?? parseInt(searchParams.get('current') || '0', 10);
  const theme = config?.theme || searchParams.get('theme') || 'default';
  const color = config?.color || searchParams.get('color') || '#8B5CF6';

  const [current, setCurrent] = useState(initialValue);
  const [justReached, setJustReached] = useState(false);

  useEffect(() => {
    setCurrent(initialValue);
  }, [initialValue]);

  // Handle subs and members
  useStreamEvent('sub.new', (e) => { if (goalType === 'subs') setCurrent((c) => c + 1); });
  useStreamEvent('sub.resub', (e) => { if (goalType === 'subs') setCurrent((c) => c + 1); });
  useStreamEvent('sub.gift', (e) => { if (goalType === 'subs') setCurrent((c) => c + e.count); });
  useStreamEvent('member.new', (e) => { if (goalType === 'subs') setCurrent((c) => c + 1); });

  // Handle bits
  useStreamEvent('cheer', (e) => { if (goalType === 'bits') setCurrent((c) => c + e.bits); });

  // Handle donations (superchats)
  useStreamEvent('superchat', (e) => { if (goalType === 'donations') setCurrent((c) => c + e.amount); });

  useEffect(() => {
    if (current >= target && target > 0) {
      setJustReached(true);
      const timer = setTimeout(() => setJustReached(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [current, target]);

  const percentage = Math.min((current / target) * 100, 100);

  // Themes handling
  const bgStyles = theme === 'glass' ? 'bg-black/30 backdrop-blur-md border border-white/10 shadow-xl' : 'bg-slate-900/80 border border-slate-700 shadow-lg';
  const barColor = color;
  
  return (
    <div className="w-full h-full bg-transparent flex items-center justify-center p-8 overflow-hidden pointer-events-none">
      <motion.div 
        className={`w-full max-w-xl rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden ${bgStyles}`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: justReached ? [1, 1.05, 1] : 1,
          boxShadow: justReached ? `0 0 40px ${barColor}` : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-end font-bold text-white z-10 px-2 drop-shadow-md font-sans">
          <span className="text-xl uppercase tracking-wider">{title}</span>
          <span className="text-2xl">
            {current} <span className="text-sm text-white/70">/ {target}</span>
          </span>
        </div>

        <div className="h-8 w-full bg-black/50 rounded-full overflow-hidden relative border border-white/5 z-10">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ backgroundColor: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          />
          {/* Animated shine effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>

        {justReached && (
          <motion.div 
            className="absolute inset-0 z-0 bg-white/20 mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: 3 }}
          />
        )}
      </motion.div>
    </div>
  );
}
