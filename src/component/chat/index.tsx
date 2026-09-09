"use client";
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { useStream } from '@/contexts/streamContext';
import { Message } from '@/component/chat/message';
import { AnimatePresence } from 'framer-motion';

export type CustomStyles = Partial<{
  'username-color': string;
  'username-font-weight': string;
  'username-font-size': string;
  'message-background': string;
  'message-color': string;
  'message-font-weight': string;
  'message-font-size': string;
  'message-font-family': string;
  'message-text-decoration': string;
  'message-text-transform': string;
  'message-text-shadow': string;
  'message-border-radius': string;
  'message-padding': string;
  'message-margin': string;
  'message-box-shadow': string;
  'message-line-height': string;
  'message-letter-spacing': string;
  'message-word-spacing': string;
  'message-text-align': string;
  'message-text-overflow': string;
  'message-white-space': string;
  'row-background': string;
  'row-padding': string;
  'row-margin': string;
  'row-border-radius': string;
  'row-box-shadow': string;
  'row-text-align': string;
  'row-text-overflow': string;
  'row-white-space': string;
}>

export const ChatViewClient = () => {
  const { messages } = useStream();
  const searchParams = useSearchParams();
  const [styles, setStyles] = useState<{ [key: string]: string }>({});
  
  const layout = searchParams.get('layout') === 'vertical' ? 'vertical' : 'horizontal';
  const ttlParam = searchParams.get('ttl');
  const ttl = ttlParam ? parseInt(ttlParam, 10) : undefined;

  useEffect(() => {
    const stylesParam = searchParams.get('styles');
    if (stylesParam) {
      try {
        const styleObject = JSON.parse(stylesParam) as CustomStyles;
        setStyles(styleObject);
      } catch (e) {
        console.error("Failed to parse styles", e);
      }
    }
  }, [searchParams]);

  return (
    <div
      className={`flex ${layout === 'vertical' ? 'flex-col justify-end items-start' : 'flex-row items-end justify-end'} w-screen h-screen overflow-hidden gap-4 p-4 wrapper`}
      style={{
        background: styles['row-background'],
        padding: styles['row-padding'],
        margin: styles['row-margin'],
        borderRadius: styles['row-border-radius'],
        boxShadow: styles['row-box-shadow'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textAlign: styles['row-text-align'] as any || 'left',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textOverflow: styles['row-text-overflow'] as any || 'clip',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        whiteSpace: styles['row-white-space'] as any || (layout === 'vertical' ? 'normal' : 'nowrap'),
      }}
    >
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => <Message message={msg} key={msg.id} styles={styles} layout={layout} ttl={ttl} />)}
      </AnimatePresence>
    </div>
  )
}
