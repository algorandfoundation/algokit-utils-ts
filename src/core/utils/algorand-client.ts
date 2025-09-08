import { AlgoConfig } from './clients/network-client'
import { TransactionComposerConfig } from './transactions/composer'

export type AlgorandClientParams = {
  clientConfig: AlgoConfig
  composerConfig?: TransactionComposerConfig
}

/**
 * A client that brokers easy access to Algorand functionality.
 */
export class AlgorandClient {
  constructor(_params: AlgorandClientParams) {
    // TODO: When the integrations are added which use the newGroup function, they should account for passing the default TransactionComposerConfig, like the rust code does.
  }
}
