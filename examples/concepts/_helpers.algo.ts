// Shared setup for the runnable examples.

import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import type { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import type { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'

export interface LocalNetEnvironment {
  algorand: AlgorandClient
  accountA: TransactionSignerAccount
  accountB: TransactionSignerAccount
}

export async function setupLocalNetEnvironment(initialFunds?: AlgoAmount): Promise<LocalNetEnvironment> {
  const algorand = AlgorandClient.defaultLocalNet()

  // Set the suggested params cache timeout to 0 to avoid 'transaction already in
  // ledger' errors when an example sends otherwise-identical transactions.
  algorand.setSuggestedParamsCacheTimeout(0)

  const dispenser = await algorand.account.localNetDispenser()
  const accountA = algorand.account.random()
  const accountB = algorand.account.random()

  for (const account of [accountA, accountB]) {
    await algorand.account.ensureFunded(account.addr, dispenser.addr, initialFunds ?? algo(10))
  }

  algorand.setDefaultSigner(accountA.signer)

  return { algorand, accountA, accountB }
}
