import algosdk from 'algosdk'
import { describe, expect, test } from 'vitest'
import { AlgorandClient } from './algorand-client'

const suggestedParams = (firstValid: bigint): algosdk.SuggestedParams => ({
  fee: 1000n,
  firstValid,
  lastValid: firstValid + 1000n,
  genesisHash: new Uint8Array(32),
  genesisID: 'sandnet-v1',
  minFee: 1000n,
  flatFee: true,
})

const mockAlgod = (options: { devmode: boolean }) => {
  let firstValid = 1n
  const algod = {
    getTransactionParams: () => ({
      do: async () => suggestedParams(firstValid++),
    }),
    genesis: () => ({
      do: async () => JSON.stringify({ devmode: options.devmode }),
    }),
  }
  return algod as unknown as algosdk.Algodv2
}

describe('AlgorandClient suggested params cache', () => {
  test('does not cache suggested params when algod genesis reports devmode', async () => {
    const algorand = AlgorandClient.fromClients({ algod: mockAlgod({ devmode: true }) })

    const first = await algorand.getSuggestedParams()
    const second = await algorand.getSuggestedParams()

    expect(first.firstValid).toBe(1n)
    expect(second.firstValid).toBe(2n)
  })

  test('caches suggested params when algod is not in devmode', async () => {
    const algorand = AlgorandClient.fromClients({ algod: mockAlgod({ devmode: false }) })

    const first = await algorand.getSuggestedParams()
    const second = await algorand.getSuggestedParams()

    expect(first.firstValid).toBe(1n)
    expect(second.firstValid).toBe(1n)
  })

  test('keeps an explicit cache timeout even on a devmode network', async () => {
    const algorand = AlgorandClient.fromClients({ algod: mockAlgod({ devmode: true }) }).setSuggestedParamsCacheTimeout(10_000)

    const first = await algorand.getSuggestedParams()
    const second = await algorand.getSuggestedParams()

    expect(first.firstValid).toBe(1n)
    expect(second.firstValid).toBe(1n)
  })
})
