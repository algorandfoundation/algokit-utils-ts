import { AVMTracesEventData, TealSourcesDebugEventData } from './debugging'

export enum EventType {
  TxnGroupSimulated = 'TxnGroupSimulated',
  AppCompiled = 'AppCompiled',
}

export type EventDataMap = {
  [EventType.TxnGroupSimulated]: AVMTracesEventData
  [EventType.AppCompiled]: TealSourcesDebugEventData
  [key: string]: unknown
}

export type AsyncEventListener<T = unknown> = (event: T, eventName: string | symbol) => Promise<void> | void

export class AsyncEventEmitter {
  private listenerWrapperMap = new WeakMap<AsyncEventListener, AsyncEventListener>()
  private listenerMap: Record<string | symbol, AsyncEventListener[]> = {}

  async emitAsync<K extends EventType>(eventName: K, event: EventDataMap[K]): Promise<void>
  async emitAsync(eventName: string | symbol, event: unknown): Promise<void>
  async emitAsync(eventName: string | symbol, event: unknown): Promise<void> {
    for (const listener of this.listenerMap[eventName] ?? []) {
      await listener(event, eventName)
    }
  }

  on<K extends EventType>(eventName: K, listener: AsyncEventListener<EventDataMap[K]>): AsyncEventEmitter
  on<T = unknown>(eventName: string | symbol, listener: AsyncEventListener<T>): AsyncEventEmitter
  on(eventName: string | symbol, listener: AsyncEventListener): AsyncEventEmitter {
    if (!this.listenerMap[eventName]) this.listenerMap[eventName] = []
    this.listenerMap[eventName].push(listener as AsyncEventListener)
    return this
  }

  once<K extends EventType>(eventName: K, listener: AsyncEventListener<EventDataMap[K]>): AsyncEventEmitter
  once<T = unknown>(eventName: string | symbol, listener: AsyncEventListener<T>): AsyncEventEmitter
  once(eventName: string | symbol, listener: AsyncEventListener): AsyncEventEmitter {
    const wrappedListener: AsyncEventListener = async (event, eventName) => {
      try {
        return await listener(event, eventName)
      } finally {
        this.removeListener(eventName, wrappedListener)
      }
    }
    this.listenerWrapperMap.set(listener, wrappedListener)
    return this.on(eventName, wrappedListener)
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
