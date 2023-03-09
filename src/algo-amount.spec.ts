import { describe, expect, test } from '@jest/globals'
import { AlgoAmount } from './algo-amount'

describe('algo-amount', () => {
  test('microalgos to microalgos', () => {
    expect(AlgoAmount.MicroAlgos(100).microAlgos).toBe(100)
  })
  test('algos to microalgos', () => {
    expect(AlgoAmount.Algos(100).microAlgos).toBe(100_000_000)
  })
  test('algos to algos', () => {
    expect(AlgoAmount.Algos(100).algos).toBe(100)
  })
  test('small microalgos to algos', () => {
    expect(AlgoAmount.MicroAlgos(1000).algos).toBe(0.001)
  })
  test('large microalgos to algos', () => {
    expect(AlgoAmount.MicroAlgos(100_000_000).algos).toBe(100)
  })
})
