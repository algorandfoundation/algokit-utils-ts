import { ABIContractParams } from 'algosdk'
import { getABIMethodSignature } from '../app'

/** An ARC-0032 Application Specification @see https://github.com/algorandfoundation/ARCs/pull/150 */
export interface AppSpec {
  /** Method call hints */
  hints: HintSpec
  /** The TEAL source */
  source: AppSources
  /** The ABI-0004 contract definition @see https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md */
  contract: ABIContractParams
  /** The values that make up the local and global state */
  schema: SchemaSpec
  /** The rolled-up schema allocation values for local and global state */
  state: StateSchemaSpec
  /** The config of all BARE calls (i.e. non ABI calls with no args) */
  bare_call_config: {
    /** NoOp bare call config */
    no_op?: CallConfigValue
    /** Opt-in bare call config */
    opt_in?: CallConfigValue
    /** Close out bare call config */
    close_out?: CallConfigValue
    /** Clear state bare call config */
    clear_state?: CallConfigValue
    /** Update bare call config */
    update_application?: CallConfigValue
    /** Delete bare call config */
    delete_application?: CallConfigValue
  }
}

/** A lookup of encoded method call spec to hint */
export type HintSpec = Record<string, Hint>

/** The TEAL source of a contract */
export interface AppSources {
  /** The TEAL source of the approval program */
  approval: string
  /** The TEAL source of the clear program */
  clear: string
}

/** The various call configs:
 *  * `NEVER`: Will not be called
 *  * `CALL`: Can be called during a non-create call i.e. app id != 0
 *  * `CREATE`: Can be called during a create call i.e. app id = 0
 *  * `ALL`: Can be during a create OR non-create call
 **/
export type CallConfigValue = 'NEVER' | 'CALL' | 'CREATE' | 'ALL'

/** Hint information for a given method call to allow client generation */
export interface Hint {
  /** Any user-defined struct/tuple types used in the method call, keyed by parameter name or `output` for return type */
  structs: Record<string, Struct>
  readonly: boolean
  default_arguments: Record<string, DefaultArgument>
  call_config: {
    no_op?: CallConfigValue
    opt_in?: CallConfigValue
    close_out?: CallConfigValue
    clear_state?: CallConfigValue
    update_application?: CallConfigValue
    delete_application?: CallConfigValue
  }
}

/** The name of a field */
export type FieldName = string

/** The string name of an ABI type */
export type ABIType = string

/** The elements of the struct/tuple: `FieldName`, `ABIType` */
export type StructElement = [FieldName, ABIType]

/** A user-defined struct/tuple type */
export interface Struct {
  /** The name of the type */
  name: string
  /** The elements (in order) that make up the struct/tuple */
  elements: StructElement[]
}

/** Any default argument specifications for the given parameter */
export interface DefaultArgument {
  /** The source of the default argument value:
   *  * `global-state`: Global state; `data` is the name of the global state variable
   *  * `local-state`: Local state; `data` is the name of the local state variable
   *  * `abi-method`: ABI method call; `data` is the method spec of the ABI method to call
   *  * `constant`: A constant value; `data` is the value to use
   */
  source: 'global-state' | 'local-state' | 'abi-method' | 'constant'
  /** The name or value corresponding to the source */
  data: string | bigint | number
}

/** AVM data type */
export enum AVMType {
  uint64,
  bytes,
}

/** Declared schema value specification */
export interface DeclaredSchemaValueSpec {
  /** The type of value */
  type: AVMType
  /** The name of the key */
  key: string
  /** A description of the variable */
  desc?: string
  /** Whether or not the value is set statically (at create time only) or dynamically */
  static: boolean
}

/** Reserved schema value specification */
export interface ReservedSchemaValueSpec {
  /** The type of value */
  type: AVMType
  /** The description of the reserved storage space */
  desc: string
  /** The maximum number of slots to reserve */
  max_keys: number
}

/** The schema for global and local storage */
export interface SchemaSpec {
  /** The local storage schema */
  local: Schema
  /** The global storage schema */
  global: Schema
}

/** The storage schema definition */
export interface Schema {
  /** Declared storage schema */
  declared: Record<string, DeclaredSchemaValueSpec>
  /** Reserved storage schema */
  reserved: Record<string, ReservedSchemaValueSpec>
}

/** The rolled-up schema allocation specification for local and global state */
export interface StateSchemaSpec {
  /** Global storage spec */
  global: StateSchema
  /** Local storage spec */
  local: StateSchema
}

/** Schema spec summary for global or local storage */
export type StateSchema = {
  /** Number of uint slots */
  num_uints: number
  /** Number of byte slots */
  num_byte_slices: number
}

export const getABISignature = (method: ABIMethodParams | ABIMethod) => {
  const argSignature = method.args.map((a) => a.type).join(',')
  const returnSignature = method.returns.type
  return `{${method.name}}(${argSignature})${returnSignature}`
}
