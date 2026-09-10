import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'chatich_channels';

export type Channels = {
  twitch: string;
  kick: string;
  youtube: string;
};

const defaultChannels: Channels = {
  twitch: '',
  kick: '',
  youtube: '',
};

export function useChannels() {
  const [channels, setChannelsState] = useState<Channels>(defaultChannels);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setChannelsState(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load channels from local storage', e);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setChannelsState(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    const handleCustomChange = (e: CustomEvent<Channels>) => {
      setChannelsState(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('chatich_channels_update', handleCustomChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('chatich_channels_update', handleCustomChange as EventListener);
    };
  }, []);

  const updateChannels = useCallback((partial: Partial<Channels>) => {
    setChannelsState(prev => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('chatich_channels_update', { detail: updated }));
      } catch (e) {
        console.error('Failed to save channels to local storage', e);
      }
      return updated;
    });
  }, []);

  const appendChannelParams = useCallback((url: URL) => {
    if (channels.twitch) url.searchParams.set('twitch', channels.twitch);
    if (channels.kick) url.searchParams.set('kick', channels.kick);
    if (channels.youtube) url.searchParams.set('youtube', channels.youtube);
    return url;
  }, [channels]);

  return {
    channels,
    updateChannels,
    appendChannelParams
  };
}
