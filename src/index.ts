// TODO review exports
export * from './app'
export * from './app-client'
export * from './app-deploy'
export * from './asset'
export * from './debugging'
export * from './indexer-lookup'
export * from './transaction'
export * from './transfer'

// Legacy exports - remove after 2 x major version bumps
export * from './account'
export * from './dispenser-client'
export * from './localnet'
export * from './network-client'

// Up to date exports
export * from './amount'
export * from './config'
export * from './types/algorand-client'

// Default export with intellisense of the most pertinent parts of AlgoKit Utils
import * as amount from './amount'
import * as config from './config'
import * as algorand from './types/algorand-client'

export default {
  ...amount,
  ...config,
  AlgorandClient: algorand.AlgorandClient,
}
