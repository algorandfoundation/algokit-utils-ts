import algosdk from 'algosdk'
import { AlgorandClientTransactionCreator } from './algorand-client-transaction-creator'
import { AlgorandClientTransactionSender } from './algorand-client-transaction-sender'
import { AppDeployer } from './app-deployer'
import { AppManager } from './app-manager'
import { AlgoKitComposer } from './composer'
import { NetworkDetails } from './network-client'
import Algodv2 = algosdk.Algodv2
import Indexer = algosdk.Indexer

/** Interface for the bulk of the `AlgorandClient` functionality.
 *
 * Used to take a dependency on AlgorandClient without generating a circular dependency.
 */
export interface AlgorandClientInterface {
  app: AppManager
  appDeployer: AppDeployer
  send: AlgorandClientTransactionSender
  createTransaction: AlgorandClientTransactionCreator
  newGroup(): AlgoKitComposer
  client: {
    algod: Algodv2
    indexer?: Indexer
    network(): Promise<NetworkDetails>
    isLocalNet(): Promise<boolean>
    isTestNet(): Promise<boolean>
    isMainNet(): Promise<boolean>
  }
}
