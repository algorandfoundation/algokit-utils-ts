import { describe, expect, test } from 'vitest'
import { testData } from './common'
import { decodeTransaction } from '../src/transactions/transaction'

describe('Generic Transaction', () => {
  // Polytest Suite: Generic Transaction

  describe('Generic Transaction Tests', () => {
    // Polytest Group: Generic Transaction Tests

    test("malformed bytes", () => {
      const badBytes = testData.simplePayment.unsignedBytes.slice(13, 37)
      expect(() => decodeTransaction(badBytes)).toThrow()
    })

    test("encode 0 bytes", () => {
      expect(() => decodeTransaction(new Uint8Array(0))).toThrow('attempted to decode 0 bytes')
    })
  })
})
