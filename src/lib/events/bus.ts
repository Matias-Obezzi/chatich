import { EventOf, StreamEvent, StreamEventType } from "./types";

export class EventBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: Map<string, Set<(e: any) => void>> = new Map();
  private anyListeners: Set<(e: StreamEvent) => void> = new Set();
  
  private seenIds: Set<string> = new Set();
  private seenIdsQueue: string[] = [];
  private readonly MAX_SEEN_IDS = 500;

  on<T extends StreamEventType>(type: T, fn: (e: EventOf<T>) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(fn);
    
    return () => {
      this.off(type, fn);
    };
  }

  onAny(fn: (e: StreamEvent) => void): () => void {
    this.anyListeners.add(fn);
    return () => {
      this.anyListeners.delete(fn);
    };
  }

  off<T extends StreamEventType>(type: T, fn: (e: EventOf<T>) => void): void {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(fn);
    }
  }

  emit(e: StreamEvent): void {
    if (this.seenIds.has(e.id)) {
      return;
    }
    
    this.seenIds.add(e.id);
    this.seenIdsQueue.push(e.id);
    
    if (this.seenIdsQueue.length > this.MAX_SEEN_IDS) {
      const removedId = this.seenIdsQueue.shift();
      if (removedId) {
        this.seenIds.delete(removedId);
      }
    }

    const typeListeners = this.listeners.get(e.type);
    if (typeListeners) {
      typeListeners.forEach(listener => {
        try {
          listener(e);
        } catch (error) {
          console.error(`Error in event listener for ${e.type}:`, error);
        }
      });
    }

    this.anyListeners.forEach(listener => {
      try {
        listener(e);
      } catch (error) {
        console.error(`Error in any event listener:`, error);
      }
    });
  }

  clear(): void {
    this.listeners.clear();
    this.anyListeners.clear();
    this.seenIds.clear();
    this.seenIdsQueue = [];
  }
}

export function createEventBus(): EventBus {
  return new EventBus();
}
