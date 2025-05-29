"use client";
import { useContext, useEffect, useState } from 'react'
import { MessagesContext } from '../contexts/messagesContext';
import { Message } from '../component/message';

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

function ChannelPage() {
  const { messages } = useContext(MessagesContext);
  const [styles, setStyles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const styles = queryParams.get('styles');
    if (styles) {
      const styleObject = JSON.parse(styles) as CustomStyles;
      setStyles(styleObject);
    }
  }, []);

  return (
    <div
      className="flex flex-row items-center justify-end w-screen gap-4 p-4 wrapper"
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
        whiteSpace: styles['row-white-space'] as any || 'nowrap',
      }}
    >
      {messages.map((msg, index) => <Message message={msg} key={index} styles={styles} />)}
    </div>
  )
}

export default ChannelPage

