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

  test('handles max supply of Algos (10 billion) with bigint', () => {
    const maxSupplyMicroAlgos = 10_000_000_000_000_000n
    const amount = AlgoAmount.MicroAlgos(maxSupplyMicroAlgos)
    expect(amount.microAlgo).toBe(maxSupplyMicroAlgos)
    expect(amount.algo).toBe(10_000_000_000)
  })

  test('fractional algos conversion', () => {
    const amount = new AlgoAmount({ algos: 0.000001 })
    expect(amount.microAlgo).toBe(1n)
    expect(amount.algo).toBe(0.000001)
  })

  test('throws on negative number microAlgo', () => {
    expect(() => new AlgoAmount({ microAlgo: -1 })).toThrow('Value must be positive.')
  })

  test('throws on negative bigint microAlgo', () => {
    expect(() => new AlgoAmount({ microAlgo: -1n })).toThrow('Value must be positive.')
  })

  test('throws on negative number algo', () => {
    expect(() => new AlgoAmount({ algo: -1 })).toThrow('Value must be positive.')
  })

  test('throws on negative bigint algo', () => {
    expect(() => new AlgoAmount({ algo: -1n })).toThrow('Value must be positive.')
  })

  test('bigint to algo conversion preserves precision for large values', () => {
    const largeMicroAlgos = 9_007_199_254_740_993n // MAX_SAFE_INTEGER + 2
    const amount = new AlgoAmount({ microAlgo: largeMicroAlgos })

    expect(amount.algo).toBe(9007199254.740993)
  })

  test('small bigint microAlgo converts to fractional algo', () => {
    const amount = new AlgoAmount({ microAlgo: 1_000n })
    expect(amount.algo).toBe(0.001)
  })

  test('throws on fractional microAlgo', () => {
    expect(() => new AlgoAmount({ microAlgo: 1.5 })).toThrow('microAlgos must be a whole number.')
  })

  test('throws on unsafe number for microAlgo', () => {
    const unsafeNumber = Number.MAX_SAFE_INTEGER + 1
    expect(() => new AlgoAmount({ microAlgo: unsafeNumber })).toThrow(
      'Number must be a safe integer. Use bigint for values greater than 2^53 - 1.',
    )
  })

  test('throws on unsafe number for algo', () => {
    const unsafeNumber = Number.MAX_SAFE_INTEGER + 1
    expect(() => new AlgoAmount({ algo: unsafeNumber })).toThrow(
      'Number must be a safe integer. Use bigint for values greater than 2^53 - 1.',
    )
  })

  test('accepts bigint at MAX_SAFE_INTEGER for algo', () => {
    const safeBigInt = BigInt(Number.MAX_SAFE_INTEGER)
    const amount = new AlgoAmount({ algo: safeBigInt })
    expect(amount.microAlgo).toBe(safeBigInt * 1_000_000n)
  })

  test('accepts bigint exceeding MAX_SAFE_INTEGER for algo', () => {
    const largeBigInt = BigInt(Number.MAX_SAFE_INTEGER) + 1n
    const amount = new AlgoAmount({ algo: largeBigInt })
    expect(amount.microAlgo).toBe(largeBigInt * 1_000_000n)
  })

  test('accepts bigint exceeding MAX_SAFE_INTEGER for microAlgo', () => {
    const largeBigInt = BigInt(Number.MAX_SAFE_INTEGER) + 1n
    const amount = new AlgoAmount({ microAlgo: largeBigInt })
    expect(amount.microAlgo).toBe(largeBigInt)
  })
})
