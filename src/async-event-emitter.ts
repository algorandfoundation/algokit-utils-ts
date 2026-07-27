import { EventDataMap, EventType } from './lifecycle-events'

export type AsyncEventListener<T = unknown> = (event: T, eventName: string | symbol) => Promise<void> | void

export class AsyncEventEmitter {
  private listenerWrapperMap = new WeakMap<AsyncEventListener, AsyncEventListener>()
  private listenerMap: Record<string | symbol, AsyncEventListener[]> = {}

  async emitAsync<K extends string | symbol>(eventName: K, event: K extends EventType ? EventDataMap[K] : unknown): Promise<void> {
    for (const listener of this.listenerMap[eventName] ?? []) {
      await listener(event, eventName)
    }
  }

  on<K extends string | symbol>(
    eventName: K,
    listener: AsyncEventListener<K extends EventType ? EventDataMap[K] : unknown>,
  ): AsyncEventEmitter {
    if (!this.listenerMap[eventName]) this.listenerMap[eventName] = []
    this.listenerMap[eventName].push(listener as AsyncEventListener)
    return this
  }

  once<K extends string | symbol>(
    eventName: K,
    listener: AsyncEventListener<K extends EventType ? EventDataMap[K] : unknown>,
  ): AsyncEventEmitter {
    const wrappedListener: AsyncEventListener = async (event, eventName) => {
      try {
        return await (listener as AsyncEventListener)(event, eventName)
      } finally {
        this.removeListener(eventName, wrappedListener)
      }
    }
    this.listenerWrapperMap.set(listener as AsyncEventListener, wrappedListener)
    return this.on(eventName, wrappedListener as AsyncEventListener<K extends EventType ? EventDataMap[K] : unknown>)
  }

  removeListener(eventName: string | symbol, listener: AsyncEventListener): AsyncEventEmitter {
    const wrappedListener = this.listenerWrapperMap.get(listener)
    if (wrappedListener) {
      this.listenerWrapperMap.delete(listener)
      if (this.listenerMap[eventName]?.indexOf(wrappedListener) !== -1) {
        this.listenerMap[eventName].splice(this.listenerMap[eventName].indexOf(wrappedListener), 1)
      }
    } else {
      if (this.listenerMap[eventName]?.indexOf(listener) !== -1) {
        this.listenerMap[eventName].splice(this.listenerMap[eventName].indexOf(listener), 1)
      }
    }

    return this
  }

  off = this.removeListener
}
