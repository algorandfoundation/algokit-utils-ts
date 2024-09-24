/**
 * An asynchronous event listener
 */
export type AsyncEventListener = (event: unknown, eventName: string | symbol) => Promise<void> | void

/** Simple asynchronous event emitter class.
 *
 * **Note:** This class is not thread-safe.
 */
export class AsyncEventEmitter {
  private listenerWrapperMap = new WeakMap<AsyncEventListener, AsyncEventListener>()
  private listenerMap: Record<string | symbol, AsyncEventListener[]> = {}

  /**
   * Emit an event and wait for all registered listeners to be run one-by-one
   * in the order they were registered.
   *
   * @param eventName The name of the event
   * @param event The event payload
   */
  async emitAsync(eventName: string | symbol, event: unknown): Promise<void> {
    for (const listener of this.listenerMap[eventName] ?? []) {
      await listener(event, eventName)
    }
  }

  /**
   * Register an event listener for the given event.
   * @param eventName The name of the event
   * @param listener The listener to trigger
   * @returns The `AsyncEventEmitter` so you can chain registrations
   */
  on(eventName: string | symbol, listener: AsyncEventListener): AsyncEventEmitter {
    if (!this.listenerMap[eventName]) this.listenerMap[eventName] = []
    this.listenerMap[eventName].push(listener)
    return this
  }

  /**
   * Register an event listener for the given event that is only fired once.
   * @param eventName The name of the event
   * @param listener The listener to trigger
   * @returns The `AsyncEventEmitter` so you can chain registrations
   */
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

  /**
   * Removes an event listener from the given event.
   * @param eventName The name of the event
   * @param listener The listener to remove
   * @returns The `AsyncEventEmitter` so you can chain registrations
   */
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

  /**
   * Alias for `removeListener`.
   */
  off = this.removeListener
}
