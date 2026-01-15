import { describe, expect, test } from 'vitest'
import { algos, microAlgos, transactionFees } from '../amount'
import { AlgoAmount } from './amount'

describe('amount', () => {
  test('toString on 1', () => {
    expect(`${microAlgos(1)}`).toBe(`1 µALGO`)
  })
  test('toString on big amount', () => {
    expect(`${algos(100)}`).toBe(`100,000,000 µALGO`)
  })
  test('microalgos to microalgos', () => {
    expect(microAlgos(100).microAlgo).toBe(100n)
  })
  test('algos to microalgos', () => {
    expect(algos(100).microAlgo).toBe(100_000_000n)
  })
  test('algos to algos', () => {
    expect(algos(100).algo).toBe(100)
  })
  test('small microalgos to algos', () => {
    expect(microAlgos(1000).algo).toBe(0.001)
  })
  test('large microalgos to algos', () => {
    expect(microAlgos(100_000_000).algo).toBe(100)
  })
  test('single transaction fee', () => {
    expect(transactionFees(1).microAlgo).toBe(1_000n)
  })
  test('multiple transaction fees', () => {
    expect(transactionFees(10).microAlgo).toBe(10_000n)
  })
  test('algos via Number.prototype', () => {
    expect((100).algo()).toBeInstanceOf(AlgoAmount)
    expect((100).algo().algo).toBe(100)
  })
  test('microAlgos via Number.prototype', () => {
    expect((100).microAlgo()).toBeInstanceOf(AlgoAmount)
    expect((100).microAlgo().microAlgo).toBe(100n)
  })
})

describe('AlgoAmount conversions', () => {
  test('accepts number and bigint for microAlgo', () => {
    expect(new AlgoAmount({ microAlgo: 1_000_000 }).microAlgo).toBe(1_000_000n)
    expect(new AlgoAmount({ microAlgo: 1_000_000n }).microAlgo).toBe(1_000_000n)
  })

  test('accepts number and bigint for algo', () => {
    expect(new AlgoAmount({ algo: 5 }).microAlgo).toBe(5_000_000n)
    expect(new AlgoAmount({ algo: 5n }).microAlgo).toBe(5_000_000n)
  })

  test('accepts max supply of Algos (10 billion)', () => {
    expect(new AlgoAmount({ algo: 10_000_000_000n }).microAlgo).toBe(10_000_000_000_000_000n)
    expect(new AlgoAmount({ algo: 10_000_000_000 }).microAlgo).toBe(10_000_000_000_000_000n)
  })

  test('handles max supply of Algos (10 billion) with bigint', () => {
    const maxSupplyMicroAlgos = 10_000_000_000_000_000n
    const amount = AlgoAmount.MicroAlgos(maxSupplyMicroAlgos)
    expect(amount.microAlgo).toBe(maxSupplyMicroAlgos)
    // Expect error because the microAlgo is above MAX_SAFE_INTEGER
    expect(() => amount.algo).toThrow('Microalgos should be positive and less than 2^53 - 1')
  })

  test('fractional algos conversion', () => {
    const amount = new AlgoAmount({ algos: 0.000001 })
    expect(amount.microAlgo).toBe(1n)
    expect(amount.algo).toBe(0.000001)
  })

  test('handle microAlgo as MAX_SAFE_INTEGER', () => {
    const atMax = new AlgoAmount({ microAlgo: BigInt(Number.MAX_SAFE_INTEGER) })
    expect(atMax.algo).toBe(Number.MAX_SAFE_INTEGER / 1e6)
  })

  test('small bigint microAlgo converts to fractional algo', () => {
    const amount = new AlgoAmount({ microAlgo: 1_000n })
    expect(amount.algo).toBe(0.001)
  })

  test('throw on above MAX_SAFE_INTEGER microAlgo when accessing algo', () => {
    expect(() => new AlgoAmount({ microAlgo: BigInt(Number.MAX_SAFE_INTEGER) + 1n }).algo).toThrow(
      'Microalgos should be positive and less than 2^53 - 1',
    )
    expect(() => new AlgoAmount({ microAlgo: Number.MAX_SAFE_INTEGER + 1 }).algo).toThrow(
      'Microalgos should be positive and less than 2^53 - 1',
    )
  })

  test('throws on negative microAlgo when accessing algo', () => {
    const amountFromBigint = new AlgoAmount({ microAlgo: -1n })
    expect(() => amountFromBigint.algo).toThrow('Microalgos should be positive and less than 2^53 - 1')

    const amountFromNumber = new AlgoAmount({ microAlgo: -1 })
    expect(() => amountFromNumber.algo).toThrow('Microalgos should be positive and less than 2^53 - 1.')
  })

  test('throws on floating point microAlgo when accessing algo', () => {
    expect(() => new AlgoAmount({ microAlgo: 1.5 })).toThrow('The number 1.5 cannot be converted to a BigInt because it is not an integer')
  })
})
