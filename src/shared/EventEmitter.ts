export interface IEventCallback {
  (...params: any[]): void
}

interface IEventsMap {
  [name: string]: IEventCallback
}

export class EventEmitter<T extends IEventsMap = IEventsMap> {
  protected _events: {
    [name: string]: Set<IEventCallback>
  }

  constructor() {
    this._events = {}
  }

  events(type: string) {
    if (!this._events[type]) {
      this._events[type] = new Set()
    }

    return this._events[type]
  }

  on<K extends keyof T>(type: K, func: T[K]) {
    this.events(type as string).add(func)
  }

  off<K extends keyof T>(type: K, func: T[K]) {
    this.events(type as string).delete(func)
  }

  emit<K extends keyof T>(type: K, ...args: Parameters<T[K]>) {
    const events = this.events(type as string)

    for (const func of events) {
      func(...args)
    }
  }

  clear<K extends keyof T>(type?: K) {
    if (type !== undefined) {
      const evts = this.events(type as string)

      evts && evts.clear()
    } else {
      this._events = {}
    }
  }
}
