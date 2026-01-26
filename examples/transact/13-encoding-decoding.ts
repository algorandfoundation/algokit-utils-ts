/**
 * Encoding/Decoding Example
 *
 * This example demonstrates how to serialize and deserialize transactions
 * using the transact package:
 * - encodeTransaction() to get msgpack bytes with TX prefix
 * - encodeTransactionRaw() to get msgpack bytes without prefix
 * - decodeTransaction() to reconstruct transaction from bytes
 * - encodeSignedTransaction() and decodeSignedTransaction() for signed transactions
 * - txId() for calculating transaction ID
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import {
  Transaction,
  TransactionType,
  assignFee,
  decodeSignedTransaction,
  decodeTransaction,
  encodeSignedTransaction,
  encodeTransaction,
  encodeTransactionRaw,
  generateAddressWithSigners,
  type PaymentTransactionFields,
  type SignedTransaction,
} from '@algorandfoundation/algokit-utils/transact'
import nacl from 'tweetnacl'
import {
  createAlgodClient,
  printHeader,
  printInfo,
  printStep,
  printSuccess,
  shortenAddress,
} from './shared/utils.js'

/**
 * Generates a random ed25519 keypair and creates an AddressWithSigners
 */
function generateAccount() {
  const keypair = nacl.sign.keyPair()
  const addressWithSigners = generateAddressWithSigners({
    ed25519Pubkey: keypair.publicKey,
    rawEd25519Signer: async (bytesToSign: Uint8Array) => {
      return nacl.sign.detached(bytesToSign, keypair.secretKey)
    },
  })
  return { keypair, ...addressWithSigners }
}

/**
 * Gets a funded account from LocalNet's KMD wallet
 */
async function getLocalNetFundedAccount(algorand: AlgorandClient) {
  return await algorand.account.kmd.getLocalNetDispenserAccount()
}

/**
 * Converts bytes to hex string for display
 */
function bytesToHex(bytes: Uint8Array, maxLength?: number): string {
  const hex = Buffer.from(bytes).toString('hex')
  if (maxLength && hex.length > maxLength) {
    return `${hex.slice(0, maxLength)  }...`
  }
  return hex
}

/**
 * Compare two transactions field by field
 */
function compareTransactions(original: Transaction, decoded: Transaction): boolean {
  // Compare basic fields
  if (original.type !== decoded.type) return false
  if (original.sender.toString() !== decoded.sender.toString()) return false
  if (original.firstValid !== decoded.firstValid) return false
  if (original.lastValid !== decoded.lastValid) return false
  if (original.fee !== decoded.fee) return false
  if (original.genesisId !== decoded.genesisId) return false

  // Compare genesis hash
  if (original.genesisHash && decoded.genesisHash) {
    if (original.genesisHash.length !== decoded.genesisHash.length) return false
    for (let i = 0; i < original.genesisHash.length; i++) {
      if (original.genesisHash[i] !== decoded.genesisHash[i]) return false
    }
  } else if (original.genesisHash !== decoded.genesisHash) {
    return false
  }

  // Compare payment fields if present
  if (original.payment && decoded.payment) {
    if (original.payment.receiver.toString() !== decoded.payment.receiver.toString()) return false
    if (original.payment.amount !== decoded.payment.amount) return false
  } else if (original.payment !== decoded.payment) {
    return false
  }

  return true
}

async function main() {
  printHeader('Encoding/Decoding Example')

  // Step 1: Initialize clients
  printStep(1, 'Initialize Algod Client')
  const algod = createAlgodClient()
  const algorand = AlgorandClient.defaultLocalNet()
  printInfo('Connected to LocalNet Algod')

  // Step 2: Get accounts
  printStep(2, 'Get Accounts')
  const sender = await getLocalNetFundedAccount(algorand)
  printInfo(`Sender address: ${shortenAddress(sender.addr.toString())}`)

  const receiver = generateAccount()
  printInfo(`Receiver address: ${shortenAddress(receiver.addr.toString())}`)

  // Step 3: Create a transaction object
  printStep(3, 'Create Transaction Object')
  const suggestedParams = await algod.suggestedParams()

  const paymentFields: PaymentTransactionFields = {
    receiver: receiver.addr,
    amount: 1_000_000n, // 1 ALGO
  }

  const transaction = new Transaction({
    type: TransactionType.Payment,
    sender: sender.addr,
    firstValid: suggestedParams.firstValid,
    lastValid: suggestedParams.lastValid,
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    payment: paymentFields,
  })

  const txWithFee = assignFee(transaction, {
    feePerByte: suggestedParams.fee,
    minFee: suggestedParams.minFee,
  })

  printInfo(`Transaction type: ${txWithFee.type}`)
  printInfo(`Amount: 1,000,000 microALGO`)
  printInfo(`Fee: ${txWithFee.fee} microALGO`)

  // Step 4: Use encodeTransaction() to get msgpack bytes with TX prefix
  printStep(4, 'Encode Transaction with TX Prefix (encodeTransaction)')

  const encodedWithPrefix = encodeTransaction(txWithFee)
  printInfo(`Encoded bytes length: ${encodedWithPrefix.length} bytes`)
  printInfo(`First bytes (hex): ${bytesToHex(encodedWithPrefix, 40)}`)
  printInfo('')
  printInfo('The "TX" prefix (0x5458) is prepended for domain separation.')
  printInfo('This prevents the same bytes from being valid in multiple contexts.')
  printInfo(`TX in ASCII: "${String.fromCharCode(encodedWithPrefix[0])}${String.fromCharCode(encodedWithPrefix[1])}"`)

  // Step 5: Use encodeTransactionRaw() to get msgpack bytes without prefix
  printStep(5, 'Encode Transaction Raw (encodeTransactionRaw)')

  const encodedRaw = encodeTransactionRaw(txWithFee)
  printInfo(`Raw encoded bytes length: ${encodedRaw.length} bytes`)
  printInfo(`First bytes (hex): ${bytesToHex(encodedRaw, 40)}`)
  printInfo('')
  printInfo(`Difference in length: ${encodedWithPrefix.length - encodedRaw.length} bytes (TX prefix)`)
  printInfo('Use encodeTransactionRaw() when the signing tool adds its own prefix.')

  // Step 6: Use decodeTransaction() to reconstruct from bytes
  printStep(6, 'Decode Transaction (decodeTransaction)')

  // Decode from bytes with prefix
  const decodedFromPrefix = decodeTransaction(encodedWithPrefix)
  printInfo('Decoded from bytes with TX prefix:')
  printInfo(`  Type: ${decodedFromPrefix.type}`)
  printInfo(`  Sender: ${shortenAddress(decodedFromPrefix.sender.toString())}`)
  printInfo(`  Amount: ${decodedFromPrefix.payment?.amount} microALGO`)
  printInfo(`  Fee: ${decodedFromPrefix.fee} microALGO`)

  // Decode from raw bytes (without prefix)
  const decodedFromRaw = decodeTransaction(encodedRaw)
  printInfo('')
  printInfo('Decoded from raw bytes (without prefix):')
  printInfo(`  Type: ${decodedFromRaw.type}`)
  printInfo(`  Sender: ${shortenAddress(decodedFromRaw.sender.toString())}`)
  printInfo(`  Amount: ${decodedFromRaw.payment?.amount} microALGO`)
  printInfo('')
  printInfo('Note: decodeTransaction() auto-detects and handles both formats.')

  // Step 7: Verify decoded transaction matches original
  printStep(7, 'Verify Decoded Transaction Matches Original')

  const matchesOriginal = compareTransactions(txWithFee, decodedFromPrefix)
  if (matchesOriginal) {
    printSuccess('Decoded transaction matches original!')
  } else {
    printInfo('Warning: Decoded transaction differs from original')
  }

  printInfo('')
  printInfo('Field comparison:')
  printInfo(`  Type: ${txWithFee.type} === ${decodedFromPrefix.type} ✓`)
  printInfo(`  Sender: ${txWithFee.sender.toString() === decodedFromPrefix.sender.toString() ? '✓' : '✗'}`)
  printInfo(`  Receiver: ${txWithFee.payment?.receiver.toString() === decodedFromPrefix.payment?.receiver.toString() ? '✓' : '✗'}`)
  printInfo(`  Amount: ${txWithFee.payment?.amount === decodedFromPrefix.payment?.amount ? '✓' : '✗'}`)
  printInfo(`  Fee: ${txWithFee.fee === decodedFromPrefix.fee ? '✓' : '✗'}`)
  printInfo(`  First valid: ${txWithFee.firstValid === decodedFromPrefix.firstValid ? '✓' : '✗'}`)
  printInfo(`  Last valid: ${txWithFee.lastValid === decodedFromPrefix.lastValid ? '✓' : '✗'}`)

  // Step 8: Demonstrate encodeSignedTransaction() and decodeSignedTransaction()
  printStep(8, 'Encode and Decode Signed Transaction')

  // Sign the transaction
  const signedTxBytes = await sender.signer([txWithFee], [0])
  printInfo(`Signed transaction bytes length: ${signedTxBytes[0].length} bytes`)

  // Decode the signed transaction
  const decodedSignedTx = decodeSignedTransaction(signedTxBytes[0])
  printInfo('')
  printInfo('Decoded SignedTransaction structure:')
  printInfo(`  txn.type: ${decodedSignedTx.txn.type}`)
  printInfo(`  txn.sender: ${shortenAddress(decodedSignedTx.txn.sender.toString())}`)
  printInfo(`  sig length: ${decodedSignedTx.sig?.length ?? 0} bytes (ed25519 signature)`)

  // Re-encode the signed transaction
  const reEncodedSignedTx = encodeSignedTransaction(decodedSignedTx)
  printInfo('')
  printInfo('Re-encoded signed transaction:')
  printInfo(`  Length: ${reEncodedSignedTx.length} bytes`)

  // Verify re-encoded matches original
  let signedBytesMatch = reEncodedSignedTx.length === signedTxBytes[0].length
  if (signedBytesMatch) {
    for (let i = 0; i < reEncodedSignedTx.length; i++) {
      if (reEncodedSignedTx[i] !== signedTxBytes[0][i]) {
        signedBytesMatch = false
        break
      }
    }
  }

  if (signedBytesMatch) {
    printSuccess('Re-encoded signed transaction matches original!')
  } else {
    printInfo('Re-encoded signed transaction differs (may be due to canonicalization)')
  }

  // Step 9: Show transaction ID calculation using txId()
  printStep(9, 'Calculate Transaction ID (txId)')

  const txId = txWithFee.txId()
  printInfo(`Transaction ID: ${txId}`)
  printInfo('')
  printInfo('Transaction ID calculation:')
  printInfo('  1. Encode transaction with TX prefix')
  printInfo('  2. Hash the bytes using SHA-512/256')
  printInfo('  3. Base32 encode the hash (first 52 characters)')
  printInfo('')
  printInfo(`ID length: ${txId.length} characters`)

  // Verify the decoded transaction has the same ID
  const decodedTxId = decodedFromPrefix.txId()
  if (txId === decodedTxId) {
    printSuccess('Decoded transaction has same ID as original!')
  } else {
    printInfo('Warning: Transaction IDs differ')
  }

  // Step 10: Demonstrate round-trip encoding with SignedTransaction structure
  printStep(10, 'Create and Encode SignedTransaction Manually')

  // Create a SignedTransaction structure manually (for demonstration)
  const manualSignedTx: SignedTransaction = {
    txn: txWithFee,
    sig: decodedSignedTx.sig, // Reuse the signature from earlier
  }

  const manualEncodedSignedTx = encodeSignedTransaction(manualSignedTx)
  printInfo(`Manually created SignedTransaction encoded: ${manualEncodedSignedTx.length} bytes`)

  const manualDecodedSignedTx = decodeSignedTransaction(manualEncodedSignedTx)
  printInfo(`Decoded back: txn.type=${manualDecodedSignedTx.txn.type}, sig present=${!!manualDecodedSignedTx.sig}`)

  // Summary
  printStep(11, 'Summary')
  printInfo('')
  printInfo('Encoding functions:')
  printInfo('  encodeTransaction(tx)     - Returns msgpack bytes WITH "TX" prefix')
  printInfo('  encodeTransactionRaw(tx)  - Returns msgpack bytes WITHOUT prefix')
  printInfo('  encodeSignedTransaction() - Encodes signed transaction for network')
  printInfo('')
  printInfo('Decoding functions:')
  printInfo('  decodeTransaction(bytes)       - Decodes bytes to Transaction')
  printInfo('                                   (auto-detects prefix)')
  printInfo('  decodeSignedTransaction(bytes) - Decodes bytes to SignedTransaction')
  printInfo('')
  printInfo('Other utilities:')
  printInfo('  tx.txId() - Calculate transaction ID (hash of encoded bytes)')
  printInfo('')
  printInfo('Use cases:')
  printInfo('  - Serialize transactions for storage or transmission')
  printInfo('  - Deserialize transactions received from external sources')
  printInfo('  - Calculate transaction IDs for tracking and verification')
  printInfo('  - Inspect signed transactions to verify signature presence')

  printSuccess('Encoding/Decoding example completed!')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
