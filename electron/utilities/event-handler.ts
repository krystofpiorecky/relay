export class EventHandler<T extends Record<string, any>> {
  private handlers: {
    [K in keyof T]?: Array<(value: T[K]) => void>
  } = {}

  on<K extends keyof T>(key: K, handler: (v: T[K]) => void) {
    if (!(key in this.handlers))
      this.handlers[key] = [];

    this.handlers[key]!.push(handler);
  }

  off<K extends keyof T>(key: K, handler: (v: T[K]) => void) {
    if (!(key in this.handlers))
      return;

    this.handlers[key] = this.handlers[key]!.filter(h => h !== handler);
  }

  invoke<K extends keyof T>(key: K, value: T[K]) {
    if (!(key in this.handlers))
      return;

    for (const handler of this.handlers[key]!)
      handler(value);
  }
}
