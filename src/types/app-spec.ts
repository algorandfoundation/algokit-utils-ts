import algosdk from 'algosdk'
import { Arc56Contract, Method as Arc56Method, StorageKey, StructFields, getABIEncodedValue } from './app-arc56'
import ABIContractParams = algosdk.ABIContractParams
import ABIMethodParams = algosdk.ABIMethodParams
import ABIMethod = algosdk.ABIMethod

export function arc32ToArc56(appSpec: AppSpec): Arc56Contract {
  const arc32Structs = Object.values(appSpec.hints).flatMap((hint) => Object.entries(hint.structs ?? {}))
  const structs = Object.fromEntries(
    arc32Structs.map(([_, struct]) => {
      const fields = Object.fromEntries(struct.elements.map((e) => [e[0], e[1]]))
      return [struct.name, fields satisfies StructFields]
    }),
  ) satisfies { [structName: string]: StructFields }
  const hint = (m: ABIMethodParams) => appSpec.hints[new ABIMethod(m).getSignature()] as Hint | undefined
  const actions = (m: ABIMethodParams, type: 'CREATE' | 'CALL') => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    return hint(m)?.call_config !== undefined ? callConfigToActions(hint(m)?.call_config!, type) : []
  }
  const bareActions = (type: 'CREATE' | 'CALL') => {
    return callConfigToActions(appSpec.bare_call_config, type)
  }
  const callConfigToActions = (c: CallConfig, type: 'CREATE' | 'CALL') => {
    const actions: ('NoOp' | 'OptIn' | 'CloseOut' | 'ClearState' | 'UpdateApplication' | 'DeleteApplication')[] = []
    if (c.close_out && ['ALL', type].includes(c.close_out)) actions.push('CloseOut')
    if (c.delete_application && ['ALL', type].includes(c.delete_application)) actions.push('DeleteApplication')
    if (c.no_op && ['ALL', type].includes(c.no_op)) actions.push('NoOp')
    if (c.opt_in && ['ALL', type].includes(c.opt_in)) actions.push('OptIn')
    if (c.update_application && ['ALL', type].includes(c.update_application)) actions.push('UpdateApplication')
    return actions
  }

  return {
    arcs: [],
    name: appSpec.contract.name,
    desc: appSpec.contract.desc,
    structs: structs,
    methods: appSpec.contract.methods.map(
      (m) =>
        ({
          name: m.name,
          desc: m.desc,
          args: m.args.map((a) => ({
            name: a.name,
            type: a.type,
            desc: a.desc,
            struct: a.name ? hint(m)?.structs?.[a.name]?.name : undefined,
            defaultValue:
              a.name && hint(m)?.default_arguments?.[a.name].source === 'constant'
                ? Buffer.from(getABIEncodedValue(hint(m)!.default_arguments![a.name].data as string | number, a.type, structs)).toString(
                    'base64',
                  )
                : undefined,
          })),
          returns: {
            type: m.returns.type,
            desc: m.returns.desc,
            struct: hint(m)?.structs?.output?.name,
          },
          events: [],
          readonly: hint(m)?.read_only,
          actions: {
            create: actions(m, 'CREATE') as Arc56Method['actions']['create'],
            call: actions(m, 'CALL'),
          },
        }) satisfies Arc56Method,
    ),
    state: {
      schema: {
        global: {
          ints: appSpec.state.global.num_uints,
          bytes: appSpec.state.global.num_byte_slices,
        },
        local: {
          ints: appSpec.state.local.num_uints,
          bytes: appSpec.state.local.num_byte_slices,
        },
      },
      keys: {
        global: Object.fromEntries(
          Object.entries(appSpec.schema.global.declared).map((s) => [
            s[0],
            {
              key: Buffer.from(s[1].key, 'utf-8').toString('base64'),
              keyType: 'bytes',
              valueType: s[1].type,
              desc: s[1].descr,
            } satisfies StorageKey,
          ]),
        ),
        local: Object.fromEntries(
          Object.entries(appSpec.schema.local.declared).map((s) => [
            s[0],
            {
              key: Buffer.from(s[1].key, 'utf-8').toString('base64'),
              keyType: 'bytes',
              valueType: s[1].type,
              desc: s[1].descr,
            } satisfies StorageKey,
          ]),
        ),
        box: {},
      },
      maps: {
        global: {},
        local: {},
        box: {},
      },
    },
    source: appSpec.source,
    bareActions: {
      create: bareActions('CREATE') as unknown as Arc56Contract['bareActions']['create'],
      call: bareActions('CALL'),
    },
    byteCode: undefined,
    compilerInfo: undefined,
    events: undefined,
    networks: undefined,
    scratchVariables: undefined,
    sourceInfo: undefined,
    templateVariables: undefined,
  } satisfies Arc56Contract
}

/** An ARC-0032 Application Specification see https://github.com/algorandfoundation/ARCs/pull/150 */
export interface AppSpec {
  /** Method call hints */
  hints: HintSpec
  /** The TEAL source */
  source: AppSources
  /** The ABI-0004 contract definition see https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md */
  contract: ABIContractParams
  /** The values that make up the local and global state */
  schema: SchemaSpec
  /** The rolled-up schema allocation values for local and global state */
  state: StateSchemaSpec
  /** The config of all BARE calls (i.e. non ABI calls with no args) */
  bare_call_config: CallConfig
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

/** Call configuration for a method */
export interface CallConfig {
  /** NoOp call config */
  no_op?: CallConfigValue
  /** Opt-in call config */
  opt_in?: CallConfigValue
  /** Close out call config */
  close_out?: CallConfigValue
  /** Update call config */
  update_application?: CallConfigValue
  /** Delete call config */
  delete_application?: CallConfigValue
}

/** Hint information for a given method call to allow client generation */
export interface Hint {
  /** Any user-defined struct/tuple types used in the method call, keyed by parameter name or `output` for return type */
  structs?: Record<string, Struct>
  read_only?: boolean
  default_arguments?: Record<string, DefaultArgument>
  call_config: CallConfig
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

/**
 * Defines a strategy for obtaining a default value for a given ABI arg.
 */
export type DefaultArgument =
  | {
      /**
       * The default value should be fetched by invoking an ABI method
       */
      source: 'abi-method'
      data: ABIMethodParams
    }
  | {
      /**
       * The default value should be fetched from global state
       */
      source: 'global-state'
      /**
       * The key of the state variable
       */
      data: string
    }
  | {
      /**
       * The default value should be fetched from the local state of the sender user
       */
      source: 'local-state'
      /**
       * The key of the state variable
       */
      data: string
    }
  | {
      /**
       * The default value is a constant.
       */
      source: 'constant'
      /**
       * The static default value to use.
       */
      data: string | number
    }

/** AVM data type */
export type AVMType = 'uint64' | 'bytes'

/** Declared schema value specification */
export interface DeclaredSchemaValueSpec {
  /** The type of value */
  type: AVMType
  /** The name of the key */
  key: string
  /** A description of the variable */
  descr?: string
  /** Whether or not the value is set statically (at create time only) or dynamically */
  static?: boolean
}

/** Reserved schema value specification */
export interface ReservedSchemaValueSpec {
  /** The type of value */
  type: AVMType
  /** The description of the reserved storage space */
  descr: string
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
