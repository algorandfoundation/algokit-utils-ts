import { ResourceReferenceDto } from '@algorandfoundation/algokit-transact/encoding/transaction-dto'
import { assert, describe, expect, test } from 'vitest'
import { OnApplicationComplete } from '../src/transactions/app-call'
import { Transaction, TransactionType, fromTransactionDto, toTransactionDto, validateTransaction } from '../src/transactions/transaction'
import { testData } from './common'
import {
  assertAssignFee,
  assertDecodeWithPrefix,
  assertDecodeWithoutPrefix,
  assertEncode,
  assertEncodeWithAuthAddress,
  assertEncodeWithSignature,
  assertEncodedTransactionType,
  assertExample,
  assertMultisigExample,
  assertTransactionId,
} from './transaction_asserts'

const txnTestData = Object.entries({
  ['app call']: testData.appCall,
  ['app create']: testData.appCreate,
  ['app update']: testData.appUpdate,
  ['app delete']: testData.appDelete,
})

describe('App Call', () => {
  // Polytest Suite: App Call

  describe('Transaction Tests', () => {
    // Polytest Group: Transaction Tests

    for (const [label, testData] of txnTestData) {
      test('example', async () => {
        await assertExample(label, testData)
      })

      test('multisig example', async () => {
        await assertMultisigExample(label, testData)
      })

      test('get transaction id', () => {
        assertTransactionId(label, testData)
      })

      test('assign fee', () => {
        assertAssignFee(label, testData)
      })

      test('get encoded transaction type', () => {
        assertEncodedTransactionType(label, testData)
      })

      test('decode without prefix', () => {
        assertDecodeWithoutPrefix(label, testData)
      })

      test('decode with prefix', () => {
        assertDecodeWithPrefix(label, testData)
      })

      test('encode with auth address', async () => {
        await assertEncodeWithAuthAddress(label, testData)
      })

      test('encode with signature', () => {
        assertEncodeWithSignature(label, testData)
      })

      test('encode', () => {
        assertEncode(label, testData)
      })
    }
  })

  describe('App Call Validation', () => {
    describe('App Creation Validation', () => {
      test('should throw error when approval program is missing for app creation', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 0n, // App creation
            onComplete: OnApplicationComplete.NoOp,
            // approvalProgram: missing - should cause error
            clearStateProgram: new Uint8Array([1, 2, 3]),
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('App call validation failed: Approval program is required')
      })

      test('should throw error when clear state program is missing for app creation', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 0n, // App creation
            onComplete: OnApplicationComplete.NoOp,
            approvalProgram: new Uint8Array([1, 2, 3]),
            // clearStateProgram: missing - should cause error
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('App call validation failed: Clear state program is required')
      })

      test('should throw error when extra program pages exceed maximum', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 0n, // App creation
            onComplete: OnApplicationComplete.NoOp,
            approvalProgram: new Uint8Array([1, 2, 3]),
            clearStateProgram: new Uint8Array([4, 5, 6]),
            extraProgramPages: 4, // Maximum is 3
          },
        }

        expect(() => validateTransaction(transaction)).toThrow(
          'App call validation failed: Extra program pages cannot exceed 3 pages, got 4',
        )
      })

      test('should throw error when approval program exceeds max size', () => {
        const largeProgram = new Uint8Array(2049) // Exceeds basic 2048 byte limit
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 0n, // App creation
            onComplete: OnApplicationComplete.NoOp,
            approvalProgram: largeProgram,
            clearStateProgram: new Uint8Array([4, 5, 6]),
            extraProgramPages: 0, // No extra pages
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('App call validation failed: Approval program cannot exceed 2048 bytes')
      })

      test('should throw error when clear state program exceeds max size', () => {
        const largeProgram = new Uint8Array(2049) // Exceeds basic 2048 byte limit
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 0n, // App creation
            onComplete: OnApplicationComplete.NoOp,
            approvalProgram: new Uint8Array([1, 2, 3]),
            clearStateProgram: largeProgram,
            extraProgramPages: 0, // No extra pages
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('App call validation failed: Clear state program cannot exceed 2048 bytes')
      })

      test('should throw error when combined programs exceed max size', () => {
        const mediumProgram1 = new Uint8Array(1500)
        const mediumProgram2 = new Uint8Array(1500) // Combined: 3000 > 2048
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 0n, // App creation
            onComplete: OnApplicationComplete.NoOp,
            approvalProgram: mediumProgram1,
            clearStateProgram: mediumProgram2,
            extraProgramPages: 0, // No extra pages
          },
        }

        expect(() => validateTransaction(transaction)).toThrow(
          'App call validation failed: Combined approval and clear state programs cannot exceed 2048 bytes',
        )
      })

      test('should throw error when global state schema exceeds maximum keys', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 0n, // App creation
            onComplete: OnApplicationComplete.NoOp,
            approvalProgram: new Uint8Array([1, 2, 3]),
            clearStateProgram: new Uint8Array([4, 5, 6]),
            globalStateSchema: {
              numUints: 32, // Max is 64 total
              numByteSlices: 33, // Combined: 65 > 64
            },
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('App call validation failed: Global state schema cannot exceed 64 keys')
      })

      test('should throw error when local state schema exceeds maximum keys', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 0n, // App creation
            onComplete: OnApplicationComplete.NoOp,
            approvalProgram: new Uint8Array([1, 2, 3]),
            clearStateProgram: new Uint8Array([4, 5, 6]),
            localStateSchema: {
              numUints: 8, // Max is 16 total
              numByteSlices: 9, // Combined: 17 > 16
            },
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('App call validation failed: Local state schema cannot exceed 16 keys')
      })

      test('should validate valid app creation transaction', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 0n, // App creation
            onComplete: OnApplicationComplete.NoOp,
            approvalProgram: new Uint8Array([1, 2, 3]),
            clearStateProgram: new Uint8Array([4, 5, 6]),
            globalStateSchema: {
              numUints: 32,
              numByteSlices: 32,
            },
            localStateSchema: {
              numUints: 8,
              numByteSlices: 8,
            },
            extraProgramPages: 3, // Maximum allowed
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate app creation with large programs when extra pages are provided', () => {
        const largeProgram = new Uint8Array(4000) // Requires extra pages
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 0n, // App creation
            onComplete: OnApplicationComplete.NoOp,
            approvalProgram: largeProgram,
            clearStateProgram: new Uint8Array([4, 5, 6]),
            extraProgramPages: 2, // Allows up to 6144 bytes total
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })
    })

    describe('App Update Validation', () => {
      test('should throw error when approval program is missing for app update', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n, // Existing app
            onComplete: OnApplicationComplete.UpdateApplication,
            // approvalProgram: missing - should cause error
            clearStateProgram: new Uint8Array([1, 2, 3]),
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('App call validation failed: Approval program is required')
      })

      test('should throw error when clear state program is missing for app update', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n, // Existing app
            onComplete: OnApplicationComplete.UpdateApplication,
            approvalProgram: new Uint8Array([1, 2, 3]),
            // clearStateProgram: missing - should cause error
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('App call validation failed: Clear state program is required')
      })

      test('should throw error when trying to modify immutable field (global state schema)', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n, // Existing app
            onComplete: OnApplicationComplete.UpdateApplication,
            approvalProgram: new Uint8Array([1, 2, 3]),
            clearStateProgram: new Uint8Array([4, 5, 6]),
            globalStateSchema: {
              // Immutable field - should cause error
              numUints: 16,
              numByteSlices: 16,
            },
          },
        }

        expect(() => validateTransaction(transaction)).toThrow(
          'App call validation failed: Global state schema is immutable and cannot be changed',
        )
      })

      test('should throw error when trying to modify immutable field (local state schema)', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n, // Existing app
            onComplete: OnApplicationComplete.UpdateApplication,
            approvalProgram: new Uint8Array([1, 2, 3]),
            clearStateProgram: new Uint8Array([4, 5, 6]),
            localStateSchema: {
              // Immutable field - should cause error
              numUints: 8,
              numByteSlices: 8,
            },
          },
        }

        expect(() => validateTransaction(transaction)).toThrow(
          'App call validation failed: Local state schema is immutable and cannot be changed',
        )
      })

      test('should throw error when trying to modify immutable field (extra program pages)', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n, // Existing app
            onComplete: OnApplicationComplete.UpdateApplication,
            approvalProgram: new Uint8Array([1, 2, 3]),
            clearStateProgram: new Uint8Array([4, 5, 6]),
            extraProgramPages: 2, // Immutable field - should cause error
          },
        }

        expect(() => validateTransaction(transaction)).toThrow(
          'App call validation failed: Extra program pages is immutable and cannot be changed',
        )
      })

      test('should validate valid app update transaction', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n, // Existing app
            onComplete: OnApplicationComplete.UpdateApplication,
            approvalProgram: new Uint8Array([1, 2, 3]),
            clearStateProgram: new Uint8Array([4, 5, 6]),
            // No immutable fields
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })
    })

    describe('App Call/Delete Validation', () => {
      test('should validate valid app call transaction', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n, // Existing app
            onComplete: OnApplicationComplete.NoOp,
            args: [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])],
            accountReferences: ['ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK'],
            appReferences: [456n, 789n],
            assetReferences: [101112n, 131415n],
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate valid app delete transaction', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n, // Existing app
            onComplete: OnApplicationComplete.DeleteApplication,
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate app opt-in transaction', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n, // Existing app
            onComplete: OnApplicationComplete.OptIn,
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate app close-out transaction', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n, // Existing app
            onComplete: OnApplicationComplete.CloseOut,
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate app clear state transaction', () => {
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n, // Existing app
            onComplete: OnApplicationComplete.ClearState,
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })
    })

    describe('Common Fields Validation', () => {
      test('should throw error when too many args are provided', () => {
        const manyArgs = Array.from({ length: 17 }, (_, i) => new Uint8Array([i])) // Max is 16
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n,
            onComplete: OnApplicationComplete.NoOp,
            args: manyArgs,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('App call validation failed: Args cannot exceed 16 arguments')
      })

      test('should throw error when args total size exceeds maximum', () => {
        const largeArg = new Uint8Array(2049) // Exceeds 2048 byte limit
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n,
            onComplete: OnApplicationComplete.NoOp,
            args: [largeArg],
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('App call validation failed: Args total size cannot exceed 2048 bytes')
      })

      test('should throw error when too many account references are provided', () => {
        const manyAccounts = Array.from({ length: 9 }, () => 'ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK') // Max is 8
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n,
            onComplete: OnApplicationComplete.NoOp,
            accountReferences: manyAccounts,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Account references cannot exceed 8 refs')
      })

      test('should throw error when too many app references are provided', () => {
        const manyApps = Array.from({ length: 9 }, (_, i) => BigInt(i + 1)) // Max is 8
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n,
            onComplete: OnApplicationComplete.NoOp,
            appReferences: manyApps,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('App references cannot exceed 8 refs')
      })

      test('should throw error when too many asset references are provided', () => {
        const manyAssets = Array.from({ length: 9 }, (_, i) => BigInt(i + 1)) // Max is 8
        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n,
            onComplete: OnApplicationComplete.NoOp,
            assetReferences: manyAssets,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Asset references cannot exceed 8 refs')
      })

      test('should validate app call with maximum allowed references', () => {
        // Since MAX_OVERALL_REFERENCES is 8, we need to distribute them
        const maxAccounts = Array.from({ length: 2 }, () => 'NY6DHEEFW73R2NUWY562U2NNKSKBKVYY5OOQFLD3M2II5RUNKRZDEGUGEA')
        const maxApps = Array.from({ length: 3 }, (_, i) => BigInt(i + 1))
        const maxAssets = Array.from({ length: 3 }, (_, i) => BigInt(i + 1))
        const maxArgs = Array.from({ length: 16 }, (_, i) => new Uint8Array([i]))

        const transaction: Transaction = {
          type: TransactionType.AppCall,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          appCall: {
            appId: 123n,
            onComplete: OnApplicationComplete.NoOp,
            args: maxArgs,
            accountReferences: maxAccounts,
            appReferences: maxApps,
            assetReferences: maxAssets,
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })
    })
  })

  describe('Encoding / decoding tests', () => {
    test('should decode access list', () => {
      const addr1 = 'FDMKB5D72THLYSJEBHBDHUE7XFRDOM5IHO44SOJ7AWPD6EZMWOQ2WKN7HQ'
      const txn: Transaction = {
        sender: 'BH55E5RMBD4GYWXGX5W5PJ5JAHPGM5OXKDQH5DC4O2MGI7NW4H6VOE4CP4',
        firstValid: 322575n,
        lastValid: 322575n,
        fee: 1000n,
        genesisId: 'testnet-v1.0',
        genesisHash: new Uint8Array(Buffer.from('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=', 'base64')),
        type: TransactionType.AppCall,
        appCall: {
          appId: 111n,
          onComplete: OnApplicationComplete.NoOp,
          accessReferences: [
            {
              holding: {
                assetId: 123n,
                address: addr1,
              },
            },
            { address: addr1 },
            { assetId: 123n },
          ],
        },
      }

      // This code is here to demonstrate the problem.
      // When encoding, the cross product references are added first,
      // so modify the access list encoding data to simulate how it may be encoded on chain.
      const txnDto = toTransactionDto(txn)
      const accessList = txnDto.al!
      // Index 2 is actually the holding reference.
      // Manually adjust the indexes, because we'll be re-ording the list.
      accessList[2]!.h!.d = 2
      accessList[2]!.h!.s = 3
      const updateAccessList: ResourceReferenceDto[] = []
      updateAccessList.push(accessList[2])
      updateAccessList.push(accessList[0])
      updateAccessList.push(accessList[1])
      txnDto.al = updateAccessList

      const decodedTxn = fromTransactionDto(txnDto)
      assert.deepStrictEqual(decodedTxn?.appCall!.accessReferences, txn?.appCall!.accessReferences)
    })
  })
})
