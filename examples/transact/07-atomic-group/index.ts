/**
 * Atomic Transaction Group Example
 *
 * This example demonstrates how to group multiple transactions atomically.
 * All transactions in a group either succeed together or fail together.
 * It shows:
 * - Creating multiple payment transactions
 * - Using groupTransactions() to assign a group ID
 * - Signing all transactions with the same signer
 * - Submitting as a single atomic group
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import {
  Transaction,
  TransactionType,
  assignFee,
  generateAddressWithSigners,
  groupTransactions,
  type PaymentTransactionFields,
} from '@algorandfoundation/algokit-utils/transact'
import nacl from 'tweetnacl'
import {
  createAlgodClient,
  formatAlgo,
  getAccountBalance,
  printHeader,
  printInfo,
  printStep,
  printSuccess,
  shortenAddress,
  waitForConfirmation,
} from '../shared/utils.js'

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

async function main() {
  printHeader('Atomic Transaction Group Example')

  // Step 1: Initialize clients
  printStep(1, 'Initialize Algod Client')
  const algod = createAlgodClient()
  const algorand = AlgorandClient.defaultLocalNet()
  printInfo('Connected to LocalNet Algod')

  // Step 2: Get a funded account from KMD (sender for all transactions)
  printStep(2, 'Get Funded Account from KMD')
  const sender = await getLocalNetFundedAccount(algorand)
  const senderBalance = await getAccountBalance(algorand, sender.addr.toString())
  printInfo(`Sender address: ${shortenAddress(sender.addr.toString())}`)
  printInfo(`Sender balance: ${formatAlgo(senderBalance.microAlgo)}`)

  // Step 3: Generate 3 receiver accounts
  printStep(3, 'Generate 3 Receiver Accounts')
  const receiver1 = generateAccount()
  const receiver2 = generateAccount()
  const receiver3 = generateAccount()

  printInfo(`Receiver 1: ${shortenAddress(receiver1.addr.toString())}`)
  printInfo(`Receiver 2: ${shortenAddress(receiver2.addr.toString())}`)
  printInfo(`Receiver 3: ${shortenAddress(receiver3.addr.toString())}`)

  // Step 4: Get suggested transaction parameters
  printStep(4, 'Get Suggested Transaction Parameters')
  const suggestedParams = await algod.suggestedParams()
  printInfo(`First valid round: ${suggestedParams.firstValid}`)
  printInfo(`Last valid round: ${suggestedParams.lastValid}`)
  printInfo(`Min fee: ${suggestedParams.minFee} microALGO`)

  // Step 5: Create 3 payment transactions with different amounts
  printStep(5, 'Create 3 Payment Transactions')
  const amounts = [1_000_000n, 2_000_000n, 3_000_000n] // 1, 2, 3 ALGO

  // Create payment fields for each receiver
  const paymentFields1: PaymentTransactionFields = {
    receiver: receiver1.addr,
    amount: amounts[0],
  }
  const paymentFields2: PaymentTransactionFields = {
    receiver: receiver2.addr,
    amount: amounts[1],
  }
  const paymentFields3: PaymentTransactionFields = {
    receiver: receiver3.addr,
    amount: amounts[2],
  }

  // Create base transactions
  const tx1 = new Transaction({
    type: TransactionType.Payment,
    sender: sender.addr,
    firstValid: suggestedParams.firstValid,
    lastValid: suggestedParams.lastValid,
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    payment: paymentFields1,
  })

  const tx2 = new Transaction({
    type: TransactionType.Payment,
    sender: sender.addr,
    firstValid: suggestedParams.firstValid,
    lastValid: suggestedParams.lastValid,
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    payment: paymentFields2,
  })

  const tx3 = new Transaction({
    type: TransactionType.Payment,
    sender: sender.addr,
    firstValid: suggestedParams.firstValid,
    lastValid: suggestedParams.lastValid,
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    payment: paymentFields3,
  })

  printInfo(`Transaction 1: ${formatAlgo(amounts[0])} to Receiver 1`)
  printInfo(`Transaction 2: ${formatAlgo(amounts[1])} to Receiver 2`)
  printInfo(`Transaction 3: ${formatAlgo(amounts[2])} to Receiver 3`)

  // Step 6: Assign fees to all transactions
  printStep(6, 'Assign Transaction Fees')
  const tx1WithFee = assignFee(tx1, {
    feePerByte: suggestedParams.fee,
    minFee: suggestedParams.minFee,
  })
  const tx2WithFee = assignFee(tx2, {
    feePerByte: suggestedParams.fee,
    minFee: suggestedParams.minFee,
  })
  const tx3WithFee = assignFee(tx3, {
    feePerByte: suggestedParams.fee,
    minFee: suggestedParams.minFee,
  })

  printInfo(`Fee per transaction: ${tx1WithFee.fee} microALGO`)
  printInfo(`Total fees: ${(tx1WithFee.fee ?? 0n) + (tx2WithFee.fee ?? 0n) + (tx3WithFee.fee ?? 0n)} microALGO`)

  // Step 7: Group the transactions using groupTransactions()
  printStep(7, 'Group Transactions with groupTransactions()')
  const transactionsWithFees = [tx1WithFee, tx2WithFee, tx3WithFee]
  const groupedTransactions = groupTransactions(transactionsWithFees)

  // All transactions now have the same group ID
  const groupId = groupedTransactions[0].group
  printInfo(`Group ID assigned to all transactions`)
  printInfo(`Group ID (base64): ${groupId ? Buffer.from(groupId).toString('base64') : 'undefined'}`)
  printInfo(`All 3 transactions now share the same group ID`)

  // Step 8: Sign all transactions with the same signer
  printStep(8, 'Sign All Transactions')

  // Sign each transaction (all from same sender)
  const signedTx1 = await sender.signer([groupedTransactions[0]], [0])
  const signedTx2 = await sender.signer([groupedTransactions[1]], [0])
  const signedTx3 = await sender.signer([groupedTransactions[2]], [0])

  printInfo('All 3 transactions signed successfully')

  // Get transaction IDs for confirmation tracking
  const txId1 = groupedTransactions[0].txId()
  const txId2 = groupedTransactions[1].txId()
  const txId3 = groupedTransactions[2].txId()

  printInfo(`Transaction 1 ID: ${txId1}`)
  printInfo(`Transaction 2 ID: ${txId2}`)
  printInfo(`Transaction 3 ID: ${txId3}`)

  // Step 9: Submit as a single group using concatenated bytes
  printStep(9, 'Submit Atomic Group')

  // Concatenate all signed transaction bytes
  const concatenatedBytes = new Uint8Array([...signedTx1[0], ...signedTx2[0], ...signedTx3[0]])

  printInfo(`Submitting ${groupedTransactions.length} grouped transactions as a single atomic unit`)

  await algod.sendRawTransaction(concatenatedBytes)
  printInfo('Atomic group submitted to network')

  // Wait for confirmation of the first transaction (all will be confirmed together)
  const pendingInfo = await waitForConfirmation(algod, txId1)
  printInfo(`Atomic group confirmed in round: ${pendingInfo.confirmedRound}`)

  // Step 10: Verify all receivers received their amounts
  printStep(10, 'Verify All Receivers Received Amounts')

  const receiver1Balance = await getAccountBalance(algorand, receiver1.addr.toString())
  const receiver2Balance = await getAccountBalance(algorand, receiver2.addr.toString())
  const receiver3Balance = await getAccountBalance(algorand, receiver3.addr.toString())

  printInfo(`Receiver 1 balance: ${formatAlgo(receiver1Balance.microAlgo)} (expected: ${formatAlgo(amounts[0])})`)
  printInfo(`Receiver 2 balance: ${formatAlgo(receiver2Balance.microAlgo)} (expected: ${formatAlgo(amounts[1])})`)
  printInfo(`Receiver 3 balance: ${formatAlgo(receiver3Balance.microAlgo)} (expected: ${formatAlgo(amounts[2])})`)

  // Verify all balances match expected amounts
  const allCorrect =
    receiver1Balance.microAlgo === amounts[0] &&
    receiver2Balance.microAlgo === amounts[1] &&
    receiver3Balance.microAlgo === amounts[2]

  if (allCorrect) {
    printSuccess('All receivers received their expected amounts!')
  } else {
    throw new Error('One or more receivers did not receive the expected amount')
  }

  // Step 11: Demonstrate atomicity concept
  printStep(11, 'Atomicity Explanation')
  printInfo('Group transactions succeed or fail together:')
  printInfo('- If any transaction in the group fails validation, ALL fail')
  printInfo('- If all transactions pass validation, ALL succeed')
  printInfo('- This is crucial for atomic swaps, multi-party payments, etc.')
  printInfo('')
  printInfo('Example failure scenarios that would cause ALL transactions to fail:')
  printInfo('- Insufficient funds for any payment')
  printInfo('- Invalid signature on any transaction')
  printInfo('- Mismatched group IDs between transactions')

  // Get final sender balance
  const senderFinalBalance = await getAccountBalance(algorand, sender.addr.toString())
  const totalSent = amounts[0] + amounts[1] + amounts[2]
  const totalFees = (tx1WithFee.fee ?? 0n) + (tx2WithFee.fee ?? 0n) + (tx3WithFee.fee ?? 0n)

  printInfo('')
  printInfo(`Total ALGO sent: ${formatAlgo(totalSent)}`)
  printInfo(`Total fees paid: ${formatAlgo(totalFees)}`)
  printInfo(`Sender balance change: ${formatAlgo(senderBalance.microAlgo - senderFinalBalance.microAlgo)}`)

  printSuccess('Atomic transaction group example completed!')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
