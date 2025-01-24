import algosdk from 'algosdk'
import { AlgorandClientTransactionCreator } from './algorand-client-transaction-creator'
import { AlgorandClientTransactionSender } from './algorand-client-transaction-sender'
import { AppDeployer } from './app-deployer'
import { AppManager } from './app-manager'
import { TransactionComposer } from './composer'
import { NetworkDetails } from './network-client'
import Algodv2 = algosdk.Algodv2
import Indexer = algosdk.Indexer
import type { AlgorandClient } from './algorand-client'
import { InterfaceOf } from './interface-of'

/**
 * @deprecated Use `AlgorandClient` with `import type` instead since this
 * interface does not implement the full interface for the AlgorandClient
 * and will get removed in the next major release
 *
 * @see https://github.com/algorandfoundation/algokit-utils-ts/pull/365
 */
interface OldAlgorandClientInterface {
  app: AppManager
  appDeployer: AppDeployer
  send: AlgorandClientTransactionSender
  createTransaction: AlgorandClientTransactionCreator
  newGroup(): TransactionComposer
  client: {
    algod: Algodv2
    indexer?: Indexer
    network(): Promise<NetworkDetails>
    isLocalNet(): Promise<boolean>
    isTestNet(): Promise<boolean>
    isMainNet(): Promise<boolean>
  }
}

/**
 * @deprecated Use `AlgorandClient` with `import type` instead since this interface
 * will get removed in the next major release
 *
 * This type is a solution to the problem raised in the PR below.
 * In summary, we needed to update the interface without making a breaking
 * change so this was the best option. This interface has some optional properties,
 * such as `account`, but unless you are using a custom implementation of AlgorandClient
 * (you probably aren't) you can be sure these will always be defined.
 *
 * @example
 * ```ts
 * algorand.account!.getInformation(addr);
 * ```
 *
 * @see https://github.com/algorandfoundation/algokit-utils-ts/pull/365
 */
export type AlgorandClientInterface = OldAlgorandClientInterface & Partial<InterfaceOf<AlgorandClient>>
