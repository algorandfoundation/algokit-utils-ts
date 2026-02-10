import { beforeAll, describe, expect, it } from 'vitest'
import { AlgorandClient } from './algorand-client'
import { algorandFixture } from './testing'

describe('NetworkManager', () => {
  describe('LocalNetManager', () => {
    const fixture = algorandFixture()
    let algorand: AlgorandClient

    beforeAll(async () => {
      await fixture.newScope()
      algorand = fixture.algorand
    })

    describe('blockWarp', () => {
      it('should advance to target round', async () => {
        const currentRound = await algorand.network.getLastRound()
        const targetRound = currentRound + 10n

        await algorand.network.localNet.blockWarp(targetRound)

        const newRound = await algorand.network.getLastRound()
        expect(newRound).toBeGreaterThanOrEqual(targetRound)
      })

      it('should do nothing if target round is already reached', async () => {
        const currentRound = await algorand.network.getLastRound()
        const targetRound = currentRound - 5n

        await algorand.network.localNet.blockWarp(targetRound)

        const newRound = await algorand.network.getLastRound()
        expect(newRound).toBeGreaterThanOrEqual(currentRound)
      })
    })

    describe('timeWarp', () => {
      it('should advance to target timestamp', async () => {
        const currentTimestamp = await algorand.network.getLatestTimestamp()
        const targetTimestamp = currentTimestamp + 3600n // 1 hour in the future

        await algorand.network.localNet.timeWarp(targetTimestamp)

        const newTimestamp = await algorand.network.getLatestTimestamp()
        expect(newTimestamp).toBeGreaterThanOrEqual(targetTimestamp)
      })

      it('should handle small time jumps', async () => {
        const currentTimestamp = await algorand.network.getLatestTimestamp()
        const targetTimestamp = currentTimestamp + 60n // 1 minute in the future

        await algorand.network.localNet.timeWarp(targetTimestamp)

        const newTimestamp = await algorand.network.getLatestTimestamp()
        expect(newTimestamp).toBeGreaterThanOrEqual(targetTimestamp)
      })

      it('should handle large time jumps', async () => {
        const currentTimestamp = await algorand.network.getLatestTimestamp()
        const targetTimestamp = currentTimestamp + 86400n // 1 day in the future

        await algorand.network.localNet.timeWarp(targetTimestamp)

        const newTimestamp = await algorand.network.getLatestTimestamp()
        expect(newTimestamp).toBeGreaterThanOrEqual(targetTimestamp)
      })
    })
  })

  describe.skip('waitUntilRound (testnet - manual)', () => {
    const algorand = AlgorandClient.testNet()

    it('should return immediately when target round is already reached', async () => {
      const currentRound = await algorand.network.getLastRound()
      const targetRound = currentRound - 10n

      const startTime = Date.now()
      await algorand.network.waitUntilRound(targetRound)
      const elapsed = Date.now() - startTime

      // Should return almost immediately (under 1 second)
      expect(elapsed).toBeLessThan(1000)
    })

    it('should wait for target round within 1 minute', async () => {
      const currentRound = await algorand.network.getLastRound()
      // Wait for ~10 rounds ahead (~30 seconds on testnet with ~3s block time)
      const targetRound = currentRound + 10n

      const startTime = Date.now()
      await algorand.network.waitUntilRound(targetRound)
      const elapsed = Date.now() - startTime

      const finalRound = await algorand.network.getLastRound()
      expect(finalRound).toBeGreaterThanOrEqual(targetRound)

      // Should complete within 1 minute
      expect(elapsed).toBeLessThan(60_000)
    }, 60_000)

    it('should wait for target round that takes more than 1 minute', async () => {
      const currentRound = await algorand.network.getLastRound()
      // Wait for ~25 rounds ahead (~75 seconds on testnet with ~3s block time)
      const targetRound = currentRound + 25n

      const startTime = Date.now()
      await algorand.network.waitUntilRound(targetRound)
      const elapsed = Date.now() - startTime

      const finalRound = await algorand.network.getLastRound()
      expect(finalRound).toBeGreaterThanOrEqual(targetRound)

      // Should take more than 1 minute but complete successfully
      expect(elapsed).toBeGreaterThan(60_000)
    }, 120_000)
  })

  describe.skip('waitUntilTimestamp (testnet - manual)', () => {
    const algorand = AlgorandClient.testNet()

    it('should return immediately when target timestamp is already reached', async () => {
      const currentTimestamp = await algorand.network.getLatestTimestamp()
      const targetTimestamp = currentTimestamp - 60n // 1 minute in the past

      const startTime = Date.now()
      await algorand.network.waitUntilTimestamp(targetTimestamp)
      const elapsed = Date.now() - startTime

      // Should return almost immediately (under 1 second)
      expect(elapsed).toBeLessThan(1000)
    })

    it('should wait for target timestamp within 1 minute', async () => {
      const currentTimestamp = await algorand.network.getLatestTimestamp()
      // Wait for 30 seconds into the future
      const targetTimestamp = currentTimestamp + 30n

      const startTime = Date.now()
      await algorand.network.waitUntilTimestamp(targetTimestamp)
      const elapsed = Date.now() - startTime

      const finalTimestamp = await algorand.network.getLatestTimestamp()
      expect(finalTimestamp).toBeGreaterThanOrEqual(targetTimestamp)

      // Should complete within 1 minute
      expect(elapsed).toBeLessThan(60_000)
    }, 60_000)

    it('should wait for target timestamp that takes more than 1 minute', async () => {
      const currentTimestamp = await algorand.network.getLatestTimestamp()
      // Wait for 75 seconds into the future
      const targetTimestamp = currentTimestamp + 75n

      const startTime = Date.now()
      await algorand.network.waitUntilTimestamp(targetTimestamp)
      const elapsed = Date.now() - startTime

      const finalTimestamp = await algorand.network.getLatestTimestamp()
      expect(finalTimestamp).toBeGreaterThanOrEqual(targetTimestamp)

      // Should take more than 1 minute but complete successfully
      expect(elapsed).toBeGreaterThan(60_000)
    }, 120_000)
  })
})
