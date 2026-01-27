/**
 * Payment with Close Example
 *
 * This example demonstrates how to close an account by transferring all remaining
 * ALGO to another account using the closeRemainderTo field in PaymentTransactionFields.
 *
 * Key concepts:
 * - closeRemainderTo: Specifies an account to receive all remaining ALGO after the transaction
 * - When an account is closed, its balance becomes 0
 * - The close-to account receives: (original balance - sent amount - fee)
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import {
  Transaction,
  TransactionType,
  assignFee,
  generateAddressWithSigners,
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
 * @example
 * ### Run the example
 * ```bash
 * npx tsx examples/transact/transact-02-payment-close.ts
 * ```
 *
 * {@includeCode ./transact-02-payment-close.ts}
 */
async function main() {
  printHeader('Payment with Close Example')

  // Step 1: Initialize clients
  printStep(1, 'Initialize Algod Client')
  const algod = createAlgodClient()
  const algorand = AlgorandClient.defaultLocalNet()
  printInfo('Connected to LocalNet Algod')

  // Step 2: Get a funded account from KMD (funding source)
  printStep(2, 'Get Funded Account from KMD')
  const fundingAccount = await getLocalNetFundedAccount(algorand)
  printInfo(`Funding account: ${shortenAddress(fundingAccount.addr.toString())}`)

  // Step 3: Generate temporary account to be closed
  printStep(3, 'Generate Temporary Account (will be closed)')
  const tempAccount = generateAccount()
  printInfo(`Temporary account: ${shortenAddress(tempAccount.addr.toString())}`)

  // Step 4: Generate close-to account (receives remaining balance)
  printStep(4, 'Generate Close-To Account (receives remainder)')
  const closeToAccount = generateAccount()
  printInfo(`Close-to account: ${shortenAddress(closeToAccount.addr.toString())}`)

  // Step 5: Fund the temporary account
  printStep(5, 'Fund Temporary Account')
  const fundAmount = 2_000_000n // 2 ALGO in microALGO (enough to cover min balance + tx amount + fee)

  const fundParams = await algod.suggestedParams()
  const fundTx = new Transaction({
    type: TransactionType.Payment,
    sender: fundingAccount.addr,
    firstValid: fundParams.firstValid,
    lastValid: fundParams.lastValid,
    genesisHash: fundParams.genesisHash,
    genesisId: fundParams.genesisId,
    payment: {
      receiver: tempAccount.addr,
      amount: fundAmount,
    },
  })
  const fundTxWithFee = assignFee(fundTx, {
    feePerByte: fundParams.fee,
    minFee: fundParams.minFee,
  })
  const signedFundTxns = await fundingAccount.signer([fundTxWithFee], [0])
  await algod.sendRawTransaction(signedFundTxns)
  await waitForConfirmation(algod, fundTxWithFee.txId())

  const tempBalanceAfterFund = await getAccountBalance(algorand, tempAccount.addr.toString())
  printInfo(`Funded temporary account with: ${formatAlgo(fundAmount)}`)
  printInfo(`Temporary account balance: ${formatAlgo(tempBalanceAfterFund.microAlgo)}`)

  // Step 6: Record initial close-to account balance
  printStep(6, 'Check Initial Close-To Account Balance')
  let closeToBalanceBefore: bigint
  try {
    const info = await getAccountBalance(algorand, closeToAccount.addr.toString())
    closeToBalanceBefore = info.microAlgo
  } catch {
    closeToBalanceBefore = 0n
  }
  printInfo(`Close-to account initial balance: ${formatAlgo(closeToBalanceBefore)}`)

  // Step 7: Create payment transaction with closeRemainderTo
  printStep(7, 'Create Payment Transaction with closeRemainderTo')
  const suggestedParams = await algod.suggestedParams()
  const paymentAmount = 100_000n // 0.1 ALGO sent to funding account (can be 0)

  // The key field: closeRemainderTo specifies where remaining balance goes
  const paymentFields: PaymentTransactionFields = {
    receiver: fundingAccount.addr, // Send a small amount to funding account
    amount: paymentAmount,
    closeRemainderTo: closeToAccount.addr, // All remaining balance goes here
  }

  const closeTx = new Transaction({
    type: TransactionType.Payment,
    sender: tempAccount.addr,
    firstValid: suggestedParams.firstValid,
    lastValid: suggestedParams.lastValid,
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    payment: paymentFields,
  })

  printInfo(`Payment amount: ${formatAlgo(paymentAmount)}`)
  printInfo(`closeRemainderTo: ${shortenAddress(closeToAccount.addr.toString())}`)

  // Step 8: Assign fee and sign the transaction
  printStep(8, 'Assign Fee and Sign Transaction')
  const closeTxWithFee = assignFee(closeTx, {
    feePerByte: suggestedParams.fee,
    minFee: suggestedParams.minFee,
  })
  const txFee = closeTxWithFee.fee ?? 0n
  printInfo(`Transaction fee: ${txFee} microALGO`)

  // Calculate expected remainder before signing
  const expectedRemainder = tempBalanceAfterFund.microAlgo - paymentAmount - BigInt(txFee)
  printInfo(`Expected remainder to close-to account: ${formatAlgo(expectedRemainder)}`)

  // Sign using the temp account's signer
  const signedCloseTxns = await tempAccount.signer([closeTxWithFee], [0])
  const txId = closeTxWithFee.txId()
  printInfo(`Transaction ID: ${txId}`)

  // Step 9: Submit and confirm the close transaction
  printStep(9, 'Submit Close Transaction')
  await algod.sendRawTransaction(signedCloseTxns)
  printInfo('Transaction submitted to network')

  const pendingInfo = await waitForConfirmation(algod, txId)
  printInfo(`Transaction confirmed in round: ${pendingInfo.confirmedRound}`)

  // Step 10: Verify closed account has 0 balance
  printStep(10, 'Verify Closed Account Balance')
  let tempBalanceAfterClose: bigint
  try {
    const info = await getAccountBalance(algorand, tempAccount.addr.toString())
    tempBalanceAfterClose = info.microAlgo
  } catch {
    // Account may not exist anymore after being closed
    tempBalanceAfterClose = 0n
  }
  printInfo(`Temporary account balance after close: ${formatAlgo(tempBalanceAfterClose)}`)

  if (tempBalanceAfterClose === 0n) {
    printSuccess('Temporary account successfully closed (balance is 0)')
  } else {
    throw new Error(`Expected closed account to have 0 balance, but got ${tempBalanceAfterClose}`)
  }

  // Step 11: Verify close-to account received the remainder
  printStep(11, 'Verify Close-To Account Received Remainder')
  const closeToBalanceAfter = await getAccountBalance(algorand, closeToAccount.addr.toString())
  printInfo(`Close-to account balance after: ${formatAlgo(closeToBalanceAfter.microAlgo)}`)

  const actualRemainder = closeToBalanceAfter.microAlgo - closeToBalanceBefore
  printInfo(`Actual remainder received: ${formatAlgo(actualRemainder)}`)
  printInfo(`Expected remainder: ${formatAlgo(expectedRemainder)}`)

  // Verify the close-to account received the expected remainder
  if (actualRemainder === expectedRemainder) {
    printSuccess(`Close-to account received correct remainder of ${formatAlgo(expectedRemainder)}`)
  } else {
    throw new Error(`Expected remainder ${expectedRemainder}, but got ${actualRemainder}`)
  }

  printSuccess('Payment with close example completed successfully!')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})

export { main as TransactPaymentCloseExample }