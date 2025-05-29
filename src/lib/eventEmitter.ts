export class EventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private events: { [key: string]: Array<(...args: any[]) => void> } = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, listener: (...args: any[]) => void) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;
    for (const listener of this.events[event]) {
      listener(...args);
    }
  }
}