import { describe, expect, test } from '@jest/globals'
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
