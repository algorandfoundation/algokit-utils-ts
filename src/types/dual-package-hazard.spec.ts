import * as algosdk from 'algosdk'
import assert from 'assert'

import { beforeEach, describe, it } from 'vitest'
import { TestNetDispenserApiClient } from './dispenser-client'

describe('Dual Package Hazard Solution', () => {
  describe('TestNetDispenserApiClient Symbol.hasInstance', () => {
    let client: TestNetDispenserApiClient

    beforeEach(() => {
      client = new TestNetDispenserApiClient({ authToken: 'test-token', requestTimeout: 5 })
    })

    it('should work with regular instanceof', () => {
      assert.strictEqual(client instanceof TestNetDispenserApiClient, true)
    })

    it('should work with custom Symbol.hasInstance', () => {
      assert.strictEqual(TestNetDispenserApiClient[Symbol.hasInstance](client), true)
    })

    it('should work with cross-module simulation', () => {
      const mockClient = {
        _isTestNetDispenserApiClient: true, // must match your hasInstance check
        _authToken: 'other-token',
        _requestTimeout: 15,
      } as any

      assert.strictEqual(TestNetDispenserApiClient[Symbol.hasInstance](mockClient), true)
    })

    it('should reject objects without marker', () => {
      const fakeClient = {
        _authToken: 'no-marker',
        _requestTimeout: 10,
      } as any

      assert.strictEqual(TestNetDispenserApiClient[Symbol.hasInstance](fakeClient), false)
    })
  })

  describe('Edge cases', () => {
    it('should handle primitive values', () => {
      assert.strictEqual(algosdk.Address[Symbol.hasInstance]('string'), false)
      assert.strictEqual(algosdk.Address[Symbol.hasInstance](123), false)
      assert.strictEqual(algosdk.Address[Symbol.hasInstance](true), false)
    })

    it('should handle empty objects', () => {
      assert.strictEqual(algosdk.Address[Symbol.hasInstance]({}), false)
      assert.strictEqual(algosdk.Transaction[Symbol.hasInstance]({}), false)
    })

    it('should handle objects with wrong marker values', () => {
      const wrongMarker = { _isAlgosdkAddress: 'true' } // string instead of boolean
      assert.strictEqual(algosdk.Address[Symbol.hasInstance](wrongMarker), false)
    })
  })
})
