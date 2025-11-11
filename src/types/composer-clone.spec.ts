import * as algosdk from '@algorandfoundation/sdk'
import { describe, expect, test } from 'vitest'
import { TransactionSignerAccount } from './account'
import { AlgoAmount } from './amount'
import { deepCloneTransactionParams } from './composer-clone'

describe('deepCloneTransactionParams', () => {
  describe('primitive types', () => {
    test('clones object with primitive values', () => {
      const original = {
        sender: 'TESTADDRESS',
        amount: 1000n,
        number: 42,
        text: 'hello',
        flag: true,
        optional: undefined,
        nullable: null,
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
    })
  })

  describe('Address objects', () => {
    test('deep clones Address objects', () => {
      // Create valid addresses using constructor with Uint8Array
      const address1 = new algosdk.Address(new Uint8Array(32).fill(0))
      const address2 = new algosdk.Address(new Uint8Array(32).fill(1))
      const original = {
        sender: address1,
        receiver: address1,
      }

      const cloned = deepCloneTransactionParams(original)

      // Values should be equal
      expect(cloned.sender.toString()).toBe(original.sender.toString())
      expect(cloned.receiver.toString()).toBe(original.receiver.toString())

      // But should be different instances
      expect(cloned.sender).not.toBe(original.sender)
      expect(cloned.receiver).not.toBe(original.receiver)

      // Verify deep clone - modifying cloned shouldn't affect original
      cloned.sender = address2
      expect(original.sender.toString()).toBe(address1.toString())
      expect(cloned.sender.toString()).toBe(address2.toString())
    })

    test('handles mixed string and Address types', () => {
      const address = algosdk.Address.fromString('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ')
      const original = {
        sender: 'TESTADDRESS',
        receiver: address,
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned.sender).toBe('TESTADDRESS')
      expect(cloned.receiver).not.toBe(original.receiver)
      expect(cloned.receiver.toString()).toBe(original.receiver.toString())
    })
  })

  describe('Uint8Array', () => {
    test('deep clones Uint8Array', () => {
      const original = {
        note: new Uint8Array([1, 2, 3, 4]),
        lease: new Uint8Array([5, 6, 7, 8]),
        voteKey: new Uint8Array([9, 10, 11, 12]),
      }

      const cloned = deepCloneTransactionParams(original)

      // Values should be equal
      expect(cloned.note).toEqual(original.note)
      expect(cloned.lease).toEqual(original.lease)
      expect(cloned.voteKey).toEqual(original.voteKey)

      // But should be different instances
      expect(cloned.note).not.toBe(original.note)
      expect(cloned.lease).not.toBe(original.lease)

      // Verify deep clone - modifying cloned shouldn't affect original
      cloned.note[0] = 99
      expect(original.note[0]).toBe(1)

      cloned.lease[0] = 88
      expect(original.lease[0]).toBe(5)
    })
  })

  describe('arrays', () => {
    test('deep clones array of primitives (bigint)', () => {
      const original = {
        appReferences: [123n, 456n, 789n],
        assetReferences: [111n, 222n],
      }

      const cloned = deepCloneTransactionParams(original)

      // Values should be equal
      expect(cloned.appReferences).toEqual(original.appReferences)
      expect(cloned.assetReferences).toEqual(original.assetReferences)

      // But arrays should be different instances
      expect(cloned.appReferences).not.toBe(original.appReferences)
      expect(cloned.assetReferences).not.toBe(original.assetReferences)

      // Modifying cloned array shouldn't affect original
      cloned.appReferences.push(999n)
      expect(original.appReferences.length).toBe(3)
      expect(cloned.appReferences.length).toBe(4)

      cloned.appReferences[0] = 555n
      expect(original.appReferences[0]).toBe(123n)
    })

    test('deep clones array of Uint8Array (args)', () => {
      const original = {
        args: [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6]), new Uint8Array([7, 8, 9])],
      }

      const cloned = deepCloneTransactionParams(original)

      // Values should be equal
      expect(cloned.args).toEqual(original.args)

      // Array should be different instance
      expect(cloned.args).not.toBe(original.args)

      // Each Uint8Array should be different instance
      expect(cloned.args[0]).not.toBe(original.args[0])
      expect(cloned.args[1]).not.toBe(original.args[1])
      expect(cloned.args[2]).not.toBe(original.args[2])

      // Verify deep clone
      cloned.args.push(new Uint8Array([10, 11]))
      expect(original.args.length).toBe(3)

      cloned.args[0][0] = 99
      expect(original.args[0][0]).toBe(1)
    })

    test('deep clones array of Address objects (accountReferences)', () => {
      const addr1 = new algosdk.Address(new Uint8Array(32).fill(0))
      const addr2 = new algosdk.Address(new Uint8Array(32).fill(1))
      const original = {
        accountReferences: [addr1, 'STRINGADDRESS', addr2],
      }

      const cloned = deepCloneTransactionParams(original)

      // Values should be equal
      expect(cloned.accountReferences.length).toBe(3)
      expect(cloned.accountReferences[0].toString()).toBe(addr1.toString())
      expect(cloned.accountReferences[1]).toBe('STRINGADDRESS')
      expect(cloned.accountReferences[2].toString()).toBe(addr2.toString())

      // Array should be different instance
      expect(cloned.accountReferences).not.toBe(original.accountReferences)

      // Address objects should be different instances
      expect(cloned.accountReferences[0]).not.toBe(original.accountReferences[0])
      expect(cloned.accountReferences[2]).not.toBe(original.accountReferences[2])

      // String should be the same (immutable)
      expect(cloned.accountReferences[1]).toBe(original.accountReferences[1])

      // Verify deep clone
      cloned.accountReferences.push(new algosdk.Address(new Uint8Array(32).fill(2)))
      expect(original.accountReferences.length).toBe(3)
    })

    test('deep clones array of ABIValue (method call args)', () => {
      const uint8Arg = new Uint8Array([1, 2, 3])
      const addressArg = new algosdk.Address(new Uint8Array(32).fill(0))
      const original = {
        args: [
          'string value',
          42,
          123n,
          true,
          uint8Arg,
          addressArg,
          [1, 2, 3], // nested array
          undefined,
        ],
      }

      const cloned = deepCloneTransactionParams(original)

      // Values should be equal
      expect(cloned.args).toEqual(original.args)

      // Array should be different instance
      expect(cloned.args).not.toBe(original.args)

      // Uint8Array should be deep cloned
      expect(cloned.args[4]).not.toBe(original.args[4])
      expect(cloned.args[4]).toEqual(original.args[4])

      // Address should be deep cloned
      expect(cloned.args[5]).not.toBe(original.args[5])
      expect((cloned.args[5] as algosdk.Address).toString()).toBe(addressArg.toString())

      // Nested array should be deep cloned
      expect(cloned.args[6]).not.toBe(original.args[6])
      expect(cloned.args[6]).toEqual([1, 2, 3])

      // Verify deep clone
      cloned.args.push('new value')
      expect(original.args.length).toBe(8)
      ;(cloned.args[4] as Uint8Array)[0] = 99
      expect((original.args[4] as Uint8Array)[0]).toBe(1)
    })
  })

  describe('BoxReference', () => {
    test('deep clones BoxReference with Uint8Array name', () => {
      const original = {
        boxReferences: [
          {
            appId: 123n,
            name: new Uint8Array([1, 2, 3, 4]),
          },
        ],
      }

      const cloned = deepCloneTransactionParams(original)

      // Values should be equal
      expect(cloned.boxReferences[0].appId).toBe(123n)
      expect(cloned.boxReferences[0].name).toEqual(original.boxReferences[0].name)

      // Should be different instances
      expect(cloned.boxReferences).not.toBe(original.boxReferences)
      expect(cloned.boxReferences[0]).not.toBe(original.boxReferences[0])
      expect(cloned.boxReferences[0].name).not.toBe(original.boxReferences[0].name)

      // Verify deep clone
      ;(cloned.boxReferences[0].name as Uint8Array)[0] = 99
      expect((original.boxReferences[0].name as Uint8Array)[0]).toBe(1)
    })

    test('deep clones BoxReference with string name', () => {
      const original = {
        boxReferences: [
          {
            appId: 456n,
            name: 'boxName',
          },
        ],
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned.boxReferences[0].appId).toBe(456n)
      expect(cloned.boxReferences[0].name).toBe('boxName')
      expect(cloned.boxReferences).not.toBe(original.boxReferences)
      expect(cloned.boxReferences[0]).not.toBe(original.boxReferences[0])
    })

    test('deep clones mixed BoxReference and BoxIdentifier', () => {
      const original = {
        boxReferences: [
          'simpleBoxName',
          new Uint8Array([5, 6, 7]),
          {
            appId: 789n,
            name: new Uint8Array([8, 9, 10]),
          },
        ],
      }

      const cloned = deepCloneTransactionParams(original)

      // String should be same (immutable)
      expect(cloned.boxReferences[0]).toBe('simpleBoxName')

      // Uint8Array should be deep cloned
      expect(cloned.boxReferences[1]).not.toBe(original.boxReferences[1])
      expect(cloned.boxReferences[1]).toEqual(original.boxReferences[1])

      // BoxReference should be deep cloned
      expect(cloned.boxReferences[2]).not.toBe(original.boxReferences[2])
      const clonedRef = cloned.boxReferences[2] as { appId: bigint; name: Uint8Array }
      const originalRef = original.boxReferences[2] as { appId: bigint; name: Uint8Array }
      expect(clonedRef.name).not.toBe(originalRef.name)
      expect(clonedRef.name).toEqual(originalRef.name)

      // Verify deep clone
      ;(cloned.boxReferences[1] as Uint8Array)[0] = 99
      expect((original.boxReferences[1] as Uint8Array)[0]).toBe(5)
    })
  })

  describe('AccessReference', () => {
    test('deep clones AccessReference with simple fields', () => {
      const original = {
        accessReferences: [
          {
            address: 'TESTADDRESS',
            appId: 123n,
          },
          {
            assetId: 456n,
          },
        ],
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned.accessReferences).toEqual(original.accessReferences)
      expect(cloned.accessReferences).not.toBe(original.accessReferences)
      expect(cloned.accessReferences[0]).not.toBe(original.accessReferences[0])
      expect(cloned.accessReferences[1]).not.toBe(original.accessReferences[1])

      // Verify deep clone
      cloned.accessReferences.push({ appId: 999n, address: 'TESTADDRESS' })
      expect(original.accessReferences.length).toBe(2)
    })

    test('deep clones AccessReference with nested HoldingReference', () => {
      const original = {
        accessReferences: [
          {
            holding: {
              assetId: 123n,
              address: 'HOLDERADDRESS',
            },
          },
        ],
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned.accessReferences[0].holding).toEqual(original.accessReferences[0].holding)
      expect(cloned.accessReferences[0].holding).not.toBe(original.accessReferences[0].holding)

      // Verify deep clone
      cloned.accessReferences[0].holding!.assetId = 999n
      expect(original.accessReferences[0].holding!.assetId).toBe(123n)
    })

    test('deep clones AccessReference with nested LocalsReference', () => {
      const original = {
        accessReferences: [
          {
            locals: {
              appId: 456n,
              address: 'LOCALADDRESS',
            },
          },
        ],
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned.accessReferences[0].locals).toEqual(original.accessReferences[0].locals)
      expect(cloned.accessReferences[0].locals).not.toBe(original.accessReferences[0].locals)

      // Verify deep clone
      cloned.accessReferences[0].locals!.appId = 999n
      expect(original.accessReferences[0].locals!.appId).toBe(456n)
    })

    test('deep clones AccessReference with nested BoxReference', () => {
      const boxName = new Uint8Array([1, 2, 3])
      const original = {
        accessReferences: [
          {
            box: {
              appId: 789n,
              name: boxName,
            },
          },
        ],
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned.accessReferences[0].box).toEqual(original.accessReferences[0].box)
      expect(cloned.accessReferences[0].box).not.toBe(original.accessReferences[0].box)
      expect(cloned.accessReferences[0].box!.name).not.toBe(original.accessReferences[0].box!.name)

      // Verify deep clone
      ;(cloned.accessReferences[0].box!.name as Uint8Array)[0] = 99
      expect((original.accessReferences[0].box!.name as Uint8Array)[0]).toBe(1)
    })

    test('deep clones AccessReference with all nested types', () => {
      const original = {
        accessReferences: [
          {
            address: 'TESTADDRESS',
            holding: { assetId: 111n, address: 'HOLDER1' },
            locals: { appId: 222n, address: 'LOCAL1' },
            box: { appId: 333n, name: new Uint8Array([4, 5, 6]) },
          },
        ],
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned.accessReferences[0]).toEqual(original.accessReferences[0])
      expect(cloned.accessReferences[0]).not.toBe(original.accessReferences[0])
      expect(cloned.accessReferences[0].holding).not.toBe(original.accessReferences[0].holding)
      expect(cloned.accessReferences[0].locals).not.toBe(original.accessReferences[0].locals)
      expect(cloned.accessReferences[0].box).not.toBe(original.accessReferences[0].box)
      expect(cloned.accessReferences[0].box!.name).not.toBe(original.accessReferences[0].box!.name)

      // Verify deep clone
      cloned.accessReferences[0].holding!.assetId = 999n
      cloned.accessReferences[0].locals!.appId = 888n
      ;(cloned.accessReferences[0].box!.name as Uint8Array)[0] = 99

      expect(original.accessReferences[0].holding!.assetId).toBe(111n)
      expect(original.accessReferences[0].locals!.appId).toBe(222n)
      expect((original.accessReferences[0].box!.name as Uint8Array)[0]).toBe(4)
    })
  })

  describe('TransactionSignerAccount', () => {
    test('deep clones TransactionSignerAccount', () => {
      const mockSigner = () => Promise.resolve([])
      const address = new algosdk.Address(new Uint8Array(32).fill(0))
      const original: { signer: TransactionSignerAccount } = {
        signer: {
          addr: address,
          signer: mockSigner,
        },
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned.signer.addr.toString()).toBe(original.signer.addr.toString())
      expect(cloned.signer.addr).not.toBe(original.signer.addr)
      expect(cloned.signer.signer).toBe(original.signer.signer) // Function should be same reference
    })
  })

  describe('ABIMethod', () => {
    test('deep clones ABIMethod', () => {
      const method = new algosdk.ABIMethod({
        name: 'testMethod',
        args: [{ name: 'arg1', type: 'uint64' }],
        returns: { type: 'string' },
      })

      const original = {
        method,
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned.method).not.toBe(original.method)
      expect(cloned.method.name).toBe(original.method.name)
      expect(cloned.method.getSignature()).toBe(original.method.getSignature())
    })
  })

  describe('AlgoAmount (immutable)', () => {
    test('returns same AlgoAmount instance (immutable)', () => {
      const original = {
        amount: AlgoAmount.Algos(10),
        fee: AlgoAmount.MicroAlgos(1000),
      }

      const cloned = deepCloneTransactionParams(original)

      // AlgoAmount is immutable, so same instance is fine
      expect(cloned.amount).toBe(original.amount)
      expect(cloned.fee).toBe(original.fee)
    })
  })

  describe('complex nested structures', () => {
    test('deep clones complex transaction params with multiple nested types', () => {
      const addr1 = new algosdk.Address(new Uint8Array(32).fill(0))
      const addr2 = new algosdk.Address(new Uint8Array(32).fill(1))

      const original = {
        sender: addr1,
        receiver: addr2,
        note: new Uint8Array([1, 2, 3]),
        lease: new Uint8Array([4, 5, 6]),
        args: [new Uint8Array([7, 8, 9]), new Uint8Array([10, 11, 12])],
        accountReferences: [addr1, 'STRINGADDRESS', addr2],
        appReferences: [123n, 456n],
        assetReferences: [789n],
        boxReferences: [
          'boxName',
          new Uint8Array([13, 14]),
          {
            appId: 999n,
            name: new Uint8Array([15, 16]),
          },
        ],
        accessReferences: [
          {
            address: 'ACCESS1',
            holding: { assetId: 111n, address: 'HOLDER' },
          },
          {
            box: {
              appId: 222n,
              name: new Uint8Array([17, 18]),
            },
          },
        ],
        amount: AlgoAmount.Algos(5),
      }

      const cloned = deepCloneTransactionParams(original)

      // Verify all values are equal
      expect(cloned.sender.toString()).toBe(original.sender.toString())
      expect(cloned.receiver.toString()).toBe(original.receiver.toString())
      expect(cloned.note).toEqual(original.note)
      expect(cloned.lease).toEqual(original.lease)
      expect(cloned.args).toEqual(original.args)
      expect(cloned.accountReferences[0].toString()).toBe(original.accountReferences[0].toString())
      expect(cloned.appReferences).toEqual(original.appReferences)
      expect(cloned.assetReferences).toEqual(original.assetReferences)
      expect(cloned.boxReferences).toEqual(original.boxReferences)
      expect(cloned.accessReferences).toEqual(original.accessReferences)
      expect(cloned.amount).toBe(original.amount)

      // Verify all mutable objects are different instances
      expect(cloned.sender).not.toBe(original.sender)
      expect(cloned.receiver).not.toBe(original.receiver)
      expect(cloned.note).not.toBe(original.note)
      expect(cloned.lease).not.toBe(original.lease)
      expect(cloned.args).not.toBe(original.args)
      expect(cloned.args[0]).not.toBe(original.args[0])
      expect(cloned.accountReferences).not.toBe(original.accountReferences)
      expect(cloned.appReferences).not.toBe(original.appReferences)
      expect(cloned.boxReferences).not.toBe(original.boxReferences)
      expect(cloned.accessReferences).not.toBe(original.accessReferences)

      // Verify deep clone - modify cloned without affecting original
      cloned.note[0] = 99
      cloned.args[0][0] = 88
      cloned.appReferences.push(777n)
      cloned.accessReferences[0].holding!.assetId = 555n
      ;(cloned.boxReferences[2] as { appId: bigint; name: Uint8Array }).name[0] = 66

      expect(original.note[0]).toBe(1)
      expect(original.args[0][0]).toBe(7)
      expect(original.appReferences.length).toBe(2)
      expect(original.accessReferences[0].holding!.assetId).toBe(111n)
      expect((original.boxReferences[2] as { appId: bigint; name: Uint8Array }).name[0]).toBe(15)
    })
  })

  describe('edge cases', () => {
    test('handles empty object', () => {
      const original = {}
      const cloned = deepCloneTransactionParams(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
    })

    test('handles empty arrays', () => {
      const original = {
        args: [],
        accountReferences: [],
        appReferences: [],
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned).toEqual(original)
      expect(cloned.args).not.toBe(original.args)
      expect(cloned.accountReferences).not.toBe(original.accountReferences)
      expect(cloned.appReferences).not.toBe(original.appReferences)
    })

    test('handles null and undefined values', () => {
      const original = {
        value: null,
        optional: undefined,
        defined: 'test',
      }

      const cloned = deepCloneTransactionParams(original)

      expect(cloned).toEqual(original)
      expect(cloned.value).toBeNull()
      expect(cloned.optional).toBeUndefined()
      expect(cloned.defined).toBe('test')
    })
  })
})
