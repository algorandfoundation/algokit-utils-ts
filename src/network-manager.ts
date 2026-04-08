import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import type { AlgorandClient } from './algorand-client'
import { AlgoAmount } from './amount'

/** Options for waiting until a specific timestamp is reached on the blockchain. */
export interface WaitUntilTimestampOptions {
  /** Estimated block time in seconds, used to calculate rounds to wait. Should be slightly lower than average to undershoot. Defaults to 2.7. */
  blockTimeSeconds?: number
  /** Polling interval in milliseconds when close to target. Defaults to 1000. */
  pollingIntervalMs?: number
  /** Timeout in milliseconds for the polling loop. Defaults to 5000. */
  pollingTimeoutMs?: number
}

/**
 * Manager for LocalNet-specific network operations.
 * These methods only work on LocalNet and will throw an error if called on other networks.
 */
export class LocalNetManager {
  private _algod: AlgodClient
  private _networkManager: NetworkManager
  private _algorand: AlgorandClient

  /** @param algod The algod client to use for LocalNet operations */
  constructor(algod: AlgodClient, networkManager: NetworkManager, algorand: AlgorandClient) {
    this._algod = algod
    this._networkManager = networkManager
    this._algorand = algorand
  }

  private async _ensureLocalNet(): Promise<void> {
    if (!(await this._algorand.client.isLocalNet())) {
      throw new Error('LocalNet methods are only available when connected to a LocalNet network')
    }
  }

  /**
   * Generates a single block by sending a zero-amount payment transaction from the dispenser to itself.
   * This triggers block creation in LocalNet dev mode.
   */
  private async _generateBlock(): Promise<void> {
    const algorand = this._algorand
    const dispenser = await algorand.account.localNetDispenser()
    await algorand.send.payment({
      sender: dispenser,
      receiver: dispenser,
      amount: AlgoAmount.MicroAlgo(0),
      note: 'algokit-utils:block-generation',
    })
  }

  /**
   * Advances the blockchain by generating blocks until the target round is reached.
   * @param targetRound The round number to advance to
   * @throws Error if not connected to LocalNet
   * @example
   * ```typescript
   * // Advance LocalNet to round 100
   * await algorand.network.localNet.blockWarp(100n)
   * ```
   */
  async blockWarp(targetRound: bigint): Promise<void> {
    await this._ensureLocalNet()

    // Generate blocks until we reach the target round
    while ((await this._networkManager.getLastRound()) < targetRound) {
      await this._generateBlock()
    }
  }

  /**
   * Advances the blockchain timestamp to a target Unix timestamp.
   * @param targetTimestamp The target Unix timestamp in seconds
   * @throws Error if not connected to LocalNet
   * @example
   * ```typescript
   * // Advance LocalNet time by 1 hour
   * const oneHourFromNow = BigInt(Math.floor(Date.now() / 1000)) + 3600n
   * await algorand.network.localNet.timeWarp(oneHourFromNow)
   * ```
   */
  async timeWarp(targetTimestamp: bigint): Promise<void> {
    await this._ensureLocalNet()

    const currentTimestamp = await this._networkManager.getLatestTimestamp()
    const offsetSeconds = Number(targetTimestamp - currentTimestamp)

    // Set the timestamp offset so the next block will have the target timestamp
    await this._algod.setBlockTimeStampOffset(offsetSeconds)
    // Generate a block with the new timestamp
    await this._generateBlock()
    // Reset the offset to use real clock for subsequent blocks
    await this._algod.setBlockTimeStampOffset(0)
  }
}

/**
 * Manager for network-related operations.
 * Provides utilities for querying blockchain state and waiting for specific conditions.
 */
export class NetworkManager {
  private _algod: AlgodClient
  private _algorand: AlgorandClient
  private _localNet: LocalNetManager | undefined

  /**
   * Create a new NetworkManager instance.
   * @param algod The algod client to use for network operations
   * @param algorand The AlgorandClient instance (for LocalNet operations)
   */
  constructor(algod: AlgodClient, algorand: AlgorandClient) {
    this._algod = algod
    this._algorand = algorand
  }

  /**
   * Get the last committed round number.
   * @returns The last round number
   * @example
   * ```typescript
   * const lastRound = await algorand.network.getLastRound()
   * console.log(`Current round: ${lastRound}`)
   * ```
   */
  async getLastRound(): Promise<bigint> {
    const status = await this._algod.status()
    return status.lastRound
  }

  /**
   * Get the Unix timestamp of the latest block.
   *
   * Note: This method makes two sequential API calls (status then block fetch).
   * The round may advance between these calls, so the returned timestamp may not
   * be from the actual latest timestamp.
   *
   * @returns The UNIX timestamp of the last round
   * @example
   * ```typescript
   * const timestamp = await algorand.network.getLatestTimestamp()
   * console.log(`Latest block time: ${new Date(Number(timestamp) * 1000)}`)
   * ```
   */
  async getLatestTimestamp(): Promise<bigint> {
    const status = await this._algod.status()
    const block = await this._algod.block(status.lastRound)
    return block.block.header.timestamp
  }

  /**
   * Wait until a specific round is reached.
   *
   * @param targetRound The round number to wait for
   * @throws Error if timeout is reached before the target round
   * @example
   * ```typescript
   * // Wait for round 1000
   * await algorand.network.waitUntilRound(1000n)
   *
   * // Wait with a 30 second timeout
   * await algorand.network.waitUntilRound(1000n, 30000)
   * ```
   */
  async waitUntilRound(targetRound: bigint): Promise<void> {
    let status = await this._algod.status()

    // statusAfterBlock has 1 min timeout, loop if target not reached
    while (status.lastRound < targetRound) {
      status = await this._algod.statusAfterBlock(status.lastRound)
    }
  }

  /**
   * Wait until a specific Unix timestamp is reached on the blockchain.
   *
   * @param targetTimestamp The target Unix timestamp in seconds
   * @param options Optional parameters for waiting
   * @example
   * ```typescript
   * // Wait until a specific time
   * const futureTime = BigInt(Math.floor(Date.now() / 1000)) + 60n // 1 minute from now
   * await algorand.network.waitUntilTimestamp(futureTime)
   *
   * // Wait with custom timing parameters
   * await algorand.network.waitUntilTimestamp(futureTime, { blockTimeSeconds: 3.0, pollingIntervalMs: 500 })
   * ```
   */
  async waitUntilTimestamp(targetTimestamp: bigint, options?: WaitUntilTimestampOptions): Promise<void> {
    // Note: this method reduces the number of calls to algod
    //  by estimating the number of rounds to wait first
    //  then wait for the target round to be committed
    //  then poll every second for the right timestamp

    // blockTimeSeconds should be slightly lower than the average block time so that it will undershoot
    const blockTimeSeconds = options?.blockTimeSeconds ?? 2.7
    const pollingIntervalMs = options?.pollingIntervalMs ?? 1000
    const pollingTimeoutMs = options?.pollingTimeoutMs ?? 5000

    const currentStatus = await this._algod.status()
    const currentRound = currentStatus.lastRound
    const currentBlock = await this._algod.block(currentRound)
    const currentBlockTimestamp = currentBlock.block.header.timestamp

    if (currentBlockTimestamp >= targetTimestamp) return

    const secondsToWait = Number(targetTimestamp - currentBlockTimestamp)
    const roundsToWait = Math.floor(secondsToWait / blockTimeSeconds)

    // Wait for estimated round
    if (roundsToWait > 1) {
      await this.waitUntilRound(currentRound + BigInt(roundsToWait))
    }

    const pollingStartTime = Date.now()
    while (true) {
      const latestTimeStamp = await this.getLatestTimestamp()
      if (latestTimeStamp > targetTimestamp) {
        return
      }

      if (Date.now() - pollingStartTime >= pollingTimeoutMs) {
        throw new Error(`Timeout waiting for timestamp ${targetTimestamp} (current: ${latestTimeStamp})`)
      }

      await new Promise((resolve) => setTimeout(resolve, pollingIntervalMs))
    }
  }

  /**
   * Get LocalNet-specific network utilities.
   * These methods only work when connected to a LocalNet network and will throw
   * an error if called on other networks.
   *
   * @returns The LocalNetManager instance
   * @example
   * ```typescript
   * // Block warp on LocalNet
   * await algorand.network.localNet.blockWarp(100n)
   *
   * // Time warp on LocalNet
   * await algorand.network.localNet.timeWarp(BigInt(Date.now() / 1000) + 3600n)
   * ```
   */
  get localNet(): LocalNetManager {
    if (!this._localNet) {
      this._localNet = new LocalNetManager(this._algod, this, this._algorand)
    }
    return this._localNet
  }
}
