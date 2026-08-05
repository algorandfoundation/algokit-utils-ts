/* eslint-disable no-console -- examples print their results to demonstrate output */
/**
 * Demonstrates the `AlgorandClient` facade — the central entry point of algokit-utils.
 *
 * This maps to the Concepts -> Algorand Client docs page and shows how to
 * instantiate a client, send a transaction, configure signers, reach the
 * underlying SDK clients, and tune the suggested-params cache.
 *
 * Prerequisites: a running LocalNet (`algokit localnet start`).
 * Run with: tsx --tsconfig examples/tsconfig.json examples/concepts/algorand_client.algo.ts
 */

import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { setupLocalNetEnvironment } from './_helpers.algo'

async function main() {
  const { algorand, accountA, accountB } = await setupLocalNetEnvironment()

  // example: INSTANTIATE_ALGORAND_CLIENT
  // `defaultLocalNet` wires up algod, indexer and kmd for a local network
  const algorandClient = AlgorandClient.defaultLocalNet()
  // example: INSTANTIATE_ALGORAND_CLIENT
  void algorandClient // illustrative only; the funded `algorand` client is used below

  const balanceBefore = (await algorand.account.getInformation(accountB.addr)).balance

  // example: SEND_PAYMENT
  // `send` builds, signs, submits, and waits for confirmation
  const result = await algorand.send.payment({
    sender: accountA.addr,
    receiver: accountB.addr,
    amount: algo(1),
    signer: accountA.signer, // explicit, no signer is registered yet
  })
  console.log(`Sent payment: ${result.txIds[0]}`)
  // example: SEND_PAYMENT

  // example: SIGNER_CONFIG
  // Register signers once; transactions look them up by sender address
  algorand.setSigner(accountA.addr, accountA.signer)
  // Fallback for senders with no registered signer
  algorand.setDefaultSigner(accountB.signer)

  await algorand.send.payment({
    sender: accountA.addr,
    receiver: accountB.addr,
    amount: algo(1),
    note: 'signed by the registered signer',
  })
  // example: SIGNER_CONFIG

  // example: SDK_CLIENTS
  const algod = algorand.client.algod
  const indexer = algorand.client.indexer
  const kmd = algorand.client.kmd
  // example: SDK_CLIENTS
  void algod
  void indexer
  void kmd

  // example: SUGGESTED_PARAMS_CONFIG
  algorand.setDefaultValidityWindow(1000)
  const suggestedParams = await algorand.getSuggestedParams()
  algorand.setSuggestedParamsCache(suggestedParams)
  algorand.setSuggestedParamsCacheTimeout(0)
  // example: SUGGESTED_PARAMS_CONFIG

  const balanceAfter = (await algorand.account.getInformation(accountB.addr)).balance
  if (balanceAfter.microAlgo !== balanceBefore.microAlgo + algo(2).microAlgo) {
    throw new Error(
      `Expected balance to increase by 2 ALGO, but went from ${balanceBefore.microAlgo} to ${balanceAfter.microAlgo} microAlgo`,
    )
  }
  console.log(`Balance of ${accountB.addr} went from ${balanceBefore.algo} to ${balanceAfter.algo} ALGO`)
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
