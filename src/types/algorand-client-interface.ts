import { AlgorandClient } from './algorand-client'
import { InterfaceOf } from './instance-of'

/** AlgorandClient interface used to eleminate circular dependencies */
export type AlgorandClientInterface = InterfaceOf<AlgorandClient>
