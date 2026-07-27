/**
 * Example: Transaction Leases
 *
 * This example demonstrates how to use transaction leases to prevent duplicate
 * transactions within a validity window:
 * - Sending a payment with a string lease
 * - Demonstrating duplicate rejection when reusing the same lease
 * - Sending a payment with a Uint8Array lease (32 bytes)
 *
 * A lease enforces a mutually exclusive transaction for a given sender within
 * the validity window. See the lease param in src/transactions/common.ts:28
 * and encodeLease() in src/transaction/transaction.ts:23.
 *
 * Prerequisites:
 * - LocalNet running (via `algokit localnet start`)
 */

import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { printError, printHeader, printInfo, printStep, printSuccess, shortenAddress } from '../shared/utils.js'

async function main() {
  printHeader('Transaction Leases Example')

  // Step 1: Setup
  printStep(1, 'Setup — create AlgorandClient, verify connection, create and fund accounts')

  const algorand = AlgorandClient.defaultLocalNet()

  try {
    await algorand.client.algod.status()
    printSuccess('Connected to LocalNet')
  } catch (error) {
    printError(`Failed to connect to LocalNet: ${error instanceof Error ? error.message : String(error)}`)
    printInfo('Make sure LocalNet is running (e.g., algokit localnet start)')
    return
  }

  const sender = algorand.account.random()
  const receiver = algorand.account.random()

  printInfo(`Sender:   ${shortenAddress(sender.addr.toString())}`)
  printInfo(`Receiver: ${shortenAddress(receiver.addr.toString())}`)

  // Fund sender
  const dispenser = await algorand.account.dispenserFromEnvironment()
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: sender.addr,
    amount: algo(10),
  })
  printSuccess('Funded sender with 10 ALGO')

  // Step 2: Send a payment with a string lease
  printStep(2, 'Send a payment with a string lease')
  printInfo('A lease prevents duplicate transactions from the same sender within the validity window')
  printInfo("Using lease: 'unique-lease-id'")

  const result1 = await algorand.send.payment({
    sender: sender.addr,
    receiver: receiver.addr,
    amount: algo(1),
    lease: 'unique-lease-id',
  })

  printInfo(`Transaction ID: ${result1.txIds[0]}`)
  printInfo(`Confirmed in round: ${result1.confirmation.confirmedRound}`)
  printSuccess('Payment with string lease sent successfully')

  // Step 3: Demonstrate duplicate rejection
  printStep(3, 'Demonstrate duplicate rejection — same sender + lease within validity window')
  printInfo('Sending the same payment with the same lease should be rejected...')

  try {
    await algorand.send.payment({
      sender: sender.addr,
      receiver: receiver.addr,
      amount: algo(1),
      lease: 'unique-lease-id',
    })
    printInfo('Unexpectedly succeeded — lease may have expired')
  } catch (error) {
    printSuccess('Duplicate transaction was rejected as expected')
    printError(`Error: ${error instanceof Error ? error.message : String(error)}`)
  }

  // Step 4: Send a payment with a Uint8Array lease (32 bytes)
  printStep(4, 'Send a payment with a Uint8Array lease (32 bytes)')
  printInfo('Leases can also be provided as a Uint8Array (up to 32 bytes, padded automatically)')

  const leaseBytes = new Uint8Array(32)
  crypto.getRandomValues(leaseBytes)
  printInfo(`Lease bytes (first 8): [${Array.from(leaseBytes.slice(0, 8)).map((b) => `0x${b.toString(16).padStart(2, '0')}`).join(', ')}...]`)

  const result2 = await algorand.send.payment({
    sender: sender.addr,
    receiver: receiver.addr,
    amount: algo(0.5),
    lease: leaseBytes,
  })

  printInfo(`Transaction ID: ${result2.txIds[0]}`)
  printInfo(`Confirmed in round: ${result2.confirmation.confirmedRound}`)
  printSuccess('Payment with Uint8Array lease sent successfully')

  printSuccess('Transaction Leases example completed!')
}

main().catch((error) => {
  printError(`Unhandled error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
