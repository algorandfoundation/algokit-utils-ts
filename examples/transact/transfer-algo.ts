import { AlgorandClient } from '../../src'
import { AlgoAmount } from '../../src/types/amount'

/**
 * Example: Transferring Algo between accounts.
 *
 * This example demonstrates how to:
 * - Create an AlgorandClient connected to LocalNet
 * - Generate test accounts with funding
 * - Transfer Algo from one account to another
 * - Check account balances
 *
 * ## Setup
 *
 * First, create an AlgorandClient and set up your accounts:
 *
 * {@includeCode ./transfer-algo.ts#setup}
 *
 * ## Transfer Algo
 *
 * Send a payment transaction between accounts:
 *
 * {@includeCode ./transfer-algo.ts#transfer}
 *
 * ## Verify Balances
 *
 * Check the account balances after the transfer:
 *
 * {@includeCode ./transfer-algo.ts#verify}
 *
 * @returns The transaction result
 */
export async function transferAlgoExample() {
  //#region setup
  // Create an AlgorandClient connected to LocalNet
  const algorand = AlgorandClient.fromEnvironment()

  // Create two test accounts - the first one will be funded from the dispenser
  const sender = await algorand.account.fromEnvironment('SENDER')
  const receiver = await algorand.account.random()

  console.log(`Sender address: ${sender.addr}`)
  console.log(`Receiver address: ${receiver.addr}`)
  //#endregion setup

  // Get initial balances
  const senderInfoBefore = await algorand.account.getInformation(sender.addr)
  const receiverInfoBefore = await algorand.account.getInformation(receiver.addr)

  console.log(`Sender balance before: ${senderInfoBefore.balance.microAlgo} microAlgo`)
  console.log(`Receiver balance before: ${receiverInfoBefore.balance.microAlgo} microAlgo`)

  //#region transfer
  // Transfer 1 Algo from sender to receiver
  const result = await algorand.send.payment({
    sender: sender.addr,
    receiver: receiver.addr,
    amount: AlgoAmount.Algo(1),
    note: 'Hello from AlgoKit Utils!',
  })

  console.log(`Transaction ID: ${result.txIds[0]}`)
  console.log(`Confirmed in round: ${result.confirmation.confirmedRound}`)
  //#endregion transfer

  //#region verify
  // Get final balances
  const senderInfoAfter = await algorand.account.getInformation(sender.addr)
  const receiverInfoAfter = await algorand.account.getInformation(receiver.addr)

  console.log(`Sender balance after: ${senderInfoAfter.balance.microAlgo} microAlgo`)
  console.log(`Receiver balance after: ${receiverInfoAfter.balance.microAlgo} microAlgo`)
  //#endregion verify

  return result
}
