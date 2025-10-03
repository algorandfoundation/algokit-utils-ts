import * as algosdk from 'algosdk'
import assert from 'assert'

import { beforeEach, describe, it } from 'vitest'
import { MultisigAccount } from './account'
import { AlgorandClientTransactionCreator } from './algorand-client-transaction-creator'
import { TransactionComposer } from './composer'
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
        _isTestNetDispenserApiClient: true,
        _authToken: 'other-token',
        _requestTimeout: 15,
      }

      assert.strictEqual(TestNetDispenserApiClient[Symbol.hasInstance](mockClient), true)
    })

    it('should reject objects without marker', () => {
      const fakeClient = {
        _authToken: 'no-marker',
        _requestTimeout: 10,
      }

      assert.strictEqual(TestNetDispenserApiClient[Symbol.hasInstance](fakeClient), false)
    })
  })

  describe('AlgorandClientTransactionCreator Symbol.hasInstance', () => {
    let creator: AlgorandClientTransactionCreator

    beforeEach(() => {
      const newGroup = () => ({}) as TransactionComposer
      creator = new AlgorandClientTransactionCreator(newGroup)
    })

    it('should work with regular instanceof', () => {
      assert.strictEqual(creator instanceof AlgorandClientTransactionCreator, true)
    })

    it('should work with custom Symbol.hasInstance', () => {
      assert.strictEqual(AlgorandClientTransactionCreator[Symbol.hasInstance](creator), true)
    })

    it('should work with cross-module simulation', () => {
      const mockCreator = {
        _isAlgorandClientTransactionCreator: true,
        _newGroup: () => ({}),
      }

      assert.strictEqual(AlgorandClientTransactionCreator[Symbol.hasInstance](mockCreator), true)
    })

    it('should reject objects without marker', () => {
      const fakeCreator = { _newGroup: () => ({}) }
      assert.strictEqual(AlgorandClientTransactionCreator[Symbol.hasInstance](fakeCreator), false)
    })
  })

  describe('SigningAccount Symbol.hasInstance', () => {
    let creator: AlgorandClientTransactionCreator

    beforeEach(() => {
      const newGroup = () => ({}) as TransactionComposer
      creator = new AlgorandClientTransactionCreator(newGroup)
    })

    it('should work with regular instanceof', () => {
      assert.strictEqual(creator instanceof AlgorandClientTransactionCreator, true)
    })

    it('should work with custom Symbol.hasInstance', () => {
      assert.strictEqual(AlgorandClientTransactionCreator[Symbol.hasInstance](creator), true)
    })

    it('should work with cross-module simulation', () => {
      const mockCreator = {
        _isAlgorandClientTransactionCreator: true,
        _newGroup: () => ({}),
      }

      assert.strictEqual(AlgorandClientTransactionCreator[Symbol.hasInstance](mockCreator), true)
    })

    it('should reject objects without marker', () => {
      const fakeCreator = { _newGroup: () => ({}) }
      assert.strictEqual(AlgorandClientTransactionCreator[Symbol.hasInstance](fakeCreator), false)
    })
  })

  describe('MultisigAccount Symbol.hasInstance', () => {
    let msig: MultisigAccount

    beforeEach(() => {
      const a1 = algosdk.generateAccount()
      const a2 = algosdk.generateAccount()
      const a3 = algosdk.generateAccount()

      const params: algosdk.MultisigMetadata = {
        version: 1,
        threshold: 2,
        addrs: [a1.addr, a2.addr, a3.addr],
      }

      const signingAccounts: algosdk.Account[] = [a1, a3]

      msig = new MultisigAccount(params, signingAccounts)
    })

    it('should work with regular instanceof', () => {
      assert.strictEqual(msig instanceof MultisigAccount, true)
    })

    it('should work with custom Symbol.hasInstance', () => {
      assert.strictEqual(MultisigAccount[Symbol.hasInstance](msig), true)
    })

    it('should work with cross-module simulation', () => {
      const mockMsig = {
        _isMultisigAccount: true,
        _params: { version: 1, threshold: 1, addrs: [] },
        _signingAccounts: [],
        _addr: 'FAKEADDR',
      }

      assert.strictEqual(MultisigAccount[Symbol.hasInstance](mockMsig), true)
    })

    it('should reject objects without marker', () => {
      const fakeMsig = {
        _params: { version: 1, threshold: 1, addrs: [] },
      }

      assert.strictEqual(MultisigAccount[Symbol.hasInstance](fakeMsig), false)
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
      const wrongMarker = { _isAlgosdkAddress: 'true' }
      assert.strictEqual(algosdk.Address[Symbol.hasInstance](wrongMarker), false)
    })
  })
})
