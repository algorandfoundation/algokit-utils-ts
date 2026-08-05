/* eslint-disable no-console -- examples print their results to demonstrate output */
/**
 * Demonstrates creating, funding and inspecting accounts with the AccountManager.
 * This maps to the Concepts -> Accounts docs page.
 *
 * Prerequisites: a running LocalNet (`algokit localnet start`).
 * Run with: tsx --tsconfig examples/tsconfig.json examples/concepts/accounts.algo.ts
 */

import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

async function main() {
  const algorand = AlgorandClient.defaultLocalNet()
  const dispenser = await algorand.account.localNetDispenser()

  // example: CREATE_AND_FUND_ACCOUNT
  const account = algorand.account.random()
  await algorand.account.ensureFunded(account.addr, dispenser.addr, algo(1))
  const info = await algorand.account.getInformation(account.addr)
  // example: CREATE_AND_FUND_ACCOUNT

  if (info.balance.algo < 1) {
    throw new Error(`Expected account ${account.addr} to hold at least 1 ALGO, but it has ${info.balance.algo}`)
  }
  console.log(`Account ${account.addr} funded with ${info.balance.algo} ALGO`)
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
