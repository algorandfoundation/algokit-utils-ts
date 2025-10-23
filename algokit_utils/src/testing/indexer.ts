/**
 * Runs the given indexer call until a 404 error is no longer returned.
 * Tried every 200ms up to 100 times.
 * Very rudimentary implementation designed for automated testing.
 * @example
 * ```typescript
 * const transaction = await runWhenIndexerCaughtUp(() => indexer.lookupTransactionByID(txnId).do())
 * ```
 * @param run The code to run
 * @returns The result (as a promise), or throws if the indexer didn't catch up in time
 */
export async function runWhenIndexerCaughtUp<T>(run: () => Promise<T>): Promise<T> {
  let result: T | null = null
  let ok = false
  let tries = 0
  while (!ok) {
    try {
      result = await run()
      ok = true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e?.status === 404) {
        tries++
        if (tries > 100) {
          throw e
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 200))
      } else {
        throw e
      }
    }
  }

  return result as T
}
