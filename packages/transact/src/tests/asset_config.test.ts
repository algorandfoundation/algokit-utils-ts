import { describe, expect, test } from 'vitest'
import { Transaction, TransactionType, validateTransaction } from '../transactions/transaction'
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
  ['asset create']: testData.assetCreate,
  ['asset config']: testData.assetReconfigure,
  ['asset destroy']: testData.assetDestroy,
})

describe('AssetConfig', () => {
  // Polytest Suite: AssetConfig

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

  describe('Asset Config Validation', () => {
    describe('Asset Creation Validation', () => {
      test('should throw error when total is missing for asset creation', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 0n, // Asset creation
            // total is missing - should cause error
            decimals: 2,
            assetName: 'Test Asset',
            unitName: 'TA',
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Asset config validation failed: Total is required')
      })

      test('should throw error when decimals exceed maximum', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 0n, // Asset creation
            total: 1000000n,
            decimals: 20, // Maximum is 19
            assetName: 'Test Asset',
            unitName: 'TA',
          },
        }

        expect(() => validateTransaction(transaction)).toThrow(
          'Asset config validation failed: Decimals cannot exceed 19 decimal places, got 20',
        )
      })

      test('should throw error when unit name is too long', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 0n, // Asset creation
            total: 1000000n,
            decimals: 2,
            assetName: 'Test Asset',
            unitName: 'TOOLONGUNITNAME', // Maximum is 8 bytes
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Asset config validation failed: Unit name cannot exceed 8 bytes, got 15')
      })

      test('should throw error when asset name is too long', () => {
        const longName = 'A'.repeat(33) // Maximum is 32 bytes
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 0n, // Asset creation
            total: 1000000n,
            decimals: 2,
            assetName: longName,
            unitName: 'TA',
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Asset config validation failed: Asset name cannot exceed 32 bytes, got 33')
      })

      test('should throw error when URL is too long', () => {
        const longUrl = `https://${'a'.repeat(90)}` // Total > 96 bytes
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 0n, // Asset creation
            total: 1000000n,
            decimals: 2,
            assetName: 'Test Asset',
            unitName: 'TA',
            url: longUrl,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Asset config validation failed: Url cannot exceed 96 bytes')
      })

      test('should throw multiple errors for asset creation with multiple invalid fields', () => {
        const longName = 'A'.repeat(33)
        const longUrl = `https://${'a'.repeat(90)}`
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 0n, // Asset creation
            // total is missing - ERROR 1
            decimals: 20, // Too large - ERROR 2
            assetName: longName, // Too long - ERROR 3
            unitName: 'TOOLONGUNITNAME', // Too long - ERROR 4
            url: longUrl, // Too long - ERROR 5
          },
        }

        try {
          validateTransaction(transaction)
        } catch (error) {
          const errorMessage = (error as Error).message
          expect(errorMessage).toContain('Asset config validation failed:')
          expect(errorMessage).toContain('Total is required')
          expect(errorMessage).toContain('Decimals cannot exceed 19 decimal places')
          expect(errorMessage).toContain('Asset name cannot exceed 32 bytes')
          expect(errorMessage).toContain('Unit name cannot exceed 8 bytes')
          expect(errorMessage).toContain('Url cannot exceed 96 bytes')
        }
      })

      test('should validate valid asset creation transaction', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 0n, // Asset creation
            total: 1000000n,
            decimals: 2,
            defaultFrozen: false,
            assetName: 'Test Asset',
            unitName: 'TA',
            url: 'https://example.com',
            metadataHash: new Uint8Array(32),
            manager: 'ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK',
            reserve: 'BNSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK',
            freeze: 'CNSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK',
            clawback: 'DNSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK',
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate asset creation with minimum valid values', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 0n, // Asset creation
            total: 1n, // Minimum valid total
            decimals: 0, // Minimum decimals
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate asset creation with maximum valid values', () => {
        const maxName = 'A'.repeat(32) // Maximum asset name length
        const maxUnitName = 'MAXUNIT8' // 8 bytes maximum
        const maxUrl = `https://${'a'.repeat(88)}` // 96 bytes total (7 + 89 = 96)
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 0n, // Asset creation
            total: 18446744073709551615n, // Max uint64
            decimals: 19, // Maximum decimals
            assetName: maxName,
            unitName: maxUnitName,
            url: maxUrl,
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate asset creation with default frozen true', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 0n, // Asset creation
            total: 1000000n,
            decimals: 2,
            defaultFrozen: true, // Frozen by default
            freeze: 'ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK', // Required for frozen assets
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })
    })

    describe('Asset Configuration/Reconfiguration Validation', () => {
      test('should throw error when trying to modify immutable field (total)', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 123n, // Existing asset
            total: 2000000n, // Trying to modify immutable field
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Asset config validation failed: Total is immutable and cannot be changed')
      })

      test('should throw error when trying to modify immutable field (decimals)', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 123n, // Existing asset
            decimals: 3, // Trying to modify immutable field
          },
        }

        expect(() => validateTransaction(transaction)).toThrow(
          'Asset config validation failed: Decimals is immutable and cannot be changed',
        )
      })

      test('should throw multiple errors when trying to modify multiple immutable fields', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 123n, // Existing asset
            total: 2000000n, // Immutable - ERROR 1
            decimals: 3, // Immutable - ERROR 2
            defaultFrozen: true, // Immutable - ERROR 3
            assetName: 'New Name', // Immutable - ERROR 4
            unitName: 'NEW', // Immutable - ERROR 5
            url: 'https://new.com', // Immutable - ERROR 6
            metadataHash: new Uint8Array(32), // Immutable - ERROR 7
          },
        }

        try {
          validateTransaction(transaction)
        } catch (error) {
          const errorMessage = (error as Error).message
          expect(errorMessage).toContain('Asset config validation failed:')
          expect(errorMessage).toContain('Total is immutable and cannot be changed')
          expect(errorMessage).toContain('Decimals is immutable and cannot be changed')
          expect(errorMessage).toContain('Default frozen is immutable and cannot be changed')
          expect(errorMessage).toContain('Asset name is immutable and cannot be changed')
          expect(errorMessage).toContain('Unit name is immutable and cannot be changed')
          expect(errorMessage).toContain('Url is immutable and cannot be changed')
          expect(errorMessage).toContain('Metadata hash is immutable and cannot be changed')
        }
      })

      test('should validate valid asset reconfiguration', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 123n, // Existing asset
            manager: 'ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK', // Can modify
            reserve: 'BNSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK', // Can modify
            freeze: 'CNSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK', // Can modify
            clawback: 'DNSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK', // Can modify
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate valid asset destruction (no params)', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 123n, // Existing asset to destroy
            // No other params for destruction
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate asset reconfiguration removing all special addresses', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 123n, // Existing asset
            manager: '', // Remove manager (set to zero address)
            reserve: '', // Remove reserve
            freeze: '', // Remove freeze
            clawback: '', // Remove clawback
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate asset reconfiguration with single field change', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.AssetConfig,
          sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
          firstValid: 1000n,
          lastValid: 2000n,
          assetConfig: {
            assetId: 123n, // Existing asset
            manager: 'ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK', // Only changing manager
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })
    })
  })
})
