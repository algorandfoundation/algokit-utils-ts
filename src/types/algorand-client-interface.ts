import { AlgorandClient } from './algorand-client'
import { InterfaceOf } from './instance_of'


/** Interface for the bulk of the `AlgorandClient` functionality.
 *
 * Used to take a dependency on AlgorandClient without generating a circular dependency.
 */
export type AlgorandClientInterface = InterfaceOf<AlgorandClient>
