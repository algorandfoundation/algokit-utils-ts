import algosdk from 'algosdk'
import { ABIReturn } from './app'
import { Expand } from './expand'

/**
 * Wrapper around `algosdk.ABIMethod` that represents an ARC-56 ABI method.
 */
export class Arc56Method extends algosdk.ABIMethod {
  override readonly args: Array<
    Expand<
      Omit<Method['args'][number], 'type'> & {
        type: algosdk.ABIArgumentType
      }
    >
  >
  override readonly returns: Expand<
    Omit<Method['returns'], 'type'> & {
      type: algosdk.ABIReturnType
    }
  >

  constructor(public method: Method) {
    super(method)
    this.args = method.args.map((arg) => ({
      ...arg,
      type: algosdk.abiTypeIsTransaction(arg.type) || algosdk.abiTypeIsReference(arg.type) ? arg.type : algosdk.ABIType.from(arg.type),
    }))
    this.returns = {
      ...this.method.returns,
      type: this.method.returns.type === 'void' ? 'void' : algosdk.ABIType.from(this.method.returns.type),
    }
  }

  override toJSON(): Method {
    return this.method
  }
}

/**
 * Returns the `ABITupleType` for the given ARC-56 struct definition
 * @param struct The ARC-56 struct definition
 * @returns The `ABITupleType`
 */
export function getABITupleTypeFromABIStructDefinition(struct: StructFields): algosdk.ABITupleType {
  return new algosdk.ABITupleType(
    Object.values(struct).map((v) => (typeof v === 'string' ? algosdk.ABIType.from(v) : getABITupleTypeFromABIStructDefinition(v))),
  )
}

/**
 * Converts a decoded ABI tuple as a struct.
 * @param decodedABITuple The decoded ABI tuple value
 * @param structFields The struct fields from an ARC-56 app spec
 * @returns The struct as a Record<string, any>
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getABIStructFromABITuple<TReturn extends ABIStruct = Record<string, any>>(
  decodedABITuple: algosdk.ABIValue[],
  structFields: StructFields,
): TReturn {
  return Object.fromEntries(
    Object.entries(structFields).map(([key, type], i) => {
      const abiValue = decodedABITuple[i]
      return [key, typeof type === 'string' || !Array.isArray(abiValue) ? decodedABITuple[i] : getABIStructFromABITuple(abiValue, type)]
    }),
  ) as TReturn
}

/**
 * Converts an ARC-56 struct as an ABI tuple.
 * @param struct The struct to convert
 * @param structFields The struct fields from an ARC-56 app spec
 * @returns The struct as a decoded ABI tuple
 */
export function getABITupleFromABIStruct(struct: ABIStruct, structFields: StructFields): algosdk.ABIValue[] {
  return Object.entries(structFields).map(([key, type]) => {
    const value = struct[key]
    return typeof type === 'string' ? (value as algosdk.ABIValue) : getABITupleFromABIStruct(value as ABIStruct, type)
  })
}

/** Decoded ARC-56 struct as a struct rather than a tuple. */
export type ABIStruct = {
  [key: string]: ABIStruct | algosdk.ABIValue
}

/**
 * Returns the decoded ABI value (or struct for a struct type)
 * for the given raw Algorand value given an ARC-56 type and defined ARC-56 structs.
 * @param value The raw Algorand value (bytes or uint64)
 * @param type The ARC-56 type - either an ABI Type string or a struct name
 * @param structs The defined ARC-56 structs
 * @returns The decoded ABI value or struct
 */
export function getABIDecodedValue(
  value: Uint8Array | number | bigint,
  type: string,
  structs: Record<string, StructFields>,
): algosdk.ABIValue | ABIStruct {
  if (type === 'bytes' || typeof value !== 'object') return value
  if (structs[type]) {
    const tupleValue = getABITupleTypeFromABIStructDefinition(structs[type]).decode(value)
    return getABIStructFromABITuple(tupleValue, structs[type])
  }
  return algosdk.ABIType.from(type).decode(value)
}

/**
 * Returns the ABI-encoded value for the given value.
 * @param value The value to encode either already in encoded binary form (`Uint8Array`), a decoded ABI value or an ARC-56 struct
 * @param type The ARC-56 type - either an ABI Type string or a struct name
 * @param structs The defined ARC-56 structs
 * @returns The binary ABI-encoded value
 */
export function getABIEncodedValue(
  value: Uint8Array | algosdk.ABIValue | ABIStruct,
  type: string,
  structs: Record<string, StructFields>,
): Uint8Array {
  if (typeof value === 'object' && value instanceof Uint8Array) return value
  if (type === 'bytes') {
    if (typeof value === 'string') return Buffer.from(value, 'utf-8')
    if (typeof value !== 'object' || !(value instanceof Uint8Array)) throw new Error(`Expected bytes value for ${type}, but got ${value}`)
    return value
  }
  if (structs[type]) {
    const tupleType = getABITupleTypeFromABIStructDefinition(structs[type])
    if (Array.isArray(value)) {
      tupleType.encode(value as algosdk.ABIValue[])
    } else {
      return tupleType.encode(getABITupleFromABIStruct(value as ABIStruct, structs[type]))
    }
  }
  return algosdk.ABIType.from(type).encode(value as algosdk.ABIValue)
}

/**
 * Returns the ARC-56 ABI method object for a given method name or signature and ARC-56 app spec.
 * @param methodNameOrSignature The method name or method signature to call if an ABI call is being emitted.
 * e.g. `my_method` or `my_method(unit64,string)bytes`
 * @param appSpec The app spec for the app
 * @returns The `Arc56Method`
 */
export function getArc56Method(methodNameOrSignature: string, appSpec: Arc56Contract): Arc56Method {
  let method: Method
  if (!methodNameOrSignature.includes('(')) {
    const methods = appSpec.methods.filter((m) => m.name === methodNameOrSignature)
    if (methods.length === 0) throw new Error(`Unable to find method ${methodNameOrSignature} in ${appSpec.name} app.`)
    if (methods.length > 1) {
      throw new Error(
        `Received a call to method ${methodNameOrSignature} in contract ${
          appSpec.name
        }, but this resolved to multiple methods; please pass in an ABI signature instead: ${appSpec.methods
          .map((m) => new algosdk.ABIMethod(m).getSignature())
          .join(', ')}`,
      )
    }
    method = methods[0]
  } else {
    const m = appSpec.methods.find((m) => new algosdk.ABIMethod(m).getSignature() === methodNameOrSignature)
    if (!m) throw new Error(`Unable to find method ${methodNameOrSignature} in ${appSpec.name} app.`)
    method = m
  }
  return new Arc56Method(method)
}

/**
 * Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type
 *
 * @param returnValue The smart contract response
 * @param method The method that was called
 * @param structs The struct fields from the app spec
 * @returns The smart contract response with an updated return value
 */
export function getArc56ReturnValue<TReturn extends Uint8Array | algosdk.ABIValue | ABIStruct | undefined>(
  returnValue: ABIReturn | undefined,
  method: Method | Arc56Method,
  structs: StructFields,
): TReturn {
  const m = 'method' in method ? method.method : method
  const type = m.returns.struct ?? m.returns.type
  if (returnValue?.decodeError) {
    throw returnValue.decodeError
  }
  if (type === undefined || type === 'void' || returnValue?.returnValue === undefined) return undefined as TReturn

  if (type === 'bytes') return returnValue.rawReturnValue as TReturn

  if (structs[type]) {
    return getABIStructFromABITuple(returnValue.returnValue as algosdk.ABIValue[], structs[type] as StructFields) as TReturn
  }

  return returnValue.returnValue as TReturn
}

/****************/
/** ARC-56 spec */
/****************/

/** Describes the entire contract. This interface is an extension of the interface described in ARC-4 */
export interface Arc56Contract {
  /** The ARCs used and/or supported by this contract. All contracts implicity support ARC4 and ARC56 */
  arcs: number[]
  /** A user-friendly name for the contract */
  name: string
  /** Optional, user-friendly description for the interface */
  desc?: string
  /**
   * Optional object listing the contract instances across different networks
   */
  networks?: {
    /**
     * The key is the base64 genesis hash of the network, and the value contains
     * information about the deployed contract in the network indicated by the
     * key. A key containing the human-readable name of the network MAY be
     * included, but the corresponding genesis hash key MUST also be defined
     */
    [network: string]: {
      /** The app ID of the deployed contract in this network */
      appID: number
    }
  }
  /** Named structs use by the application */
  structs: { [structName: StructName]: StructFields }
  /** All of the methods that the contract implements */
  methods: Method[]
  state: {
    /** Defines the values that should be used for GlobalNumUint, GlobalNumByteSlice, LocalNumUint, and LocalNumByteSlice when creating the application  */
    schema: {
      global: {
        ints: number
        bytes: number
      }
      local: {
        ints: number
        bytes: number
      }
    }
    /** Mapping of human-readable names to StorageKey objects */
    keys: {
      global: { [name: string]: StorageKey }
      local: { [name: string]: StorageKey }
      box: { [name: string]: StorageKey }
    }
    /** Mapping of human-readable names to StorageMap objects */
    maps: {
      global: { [name: string]: StorageMap }
      local: { [name: string]: StorageMap }
      box: { [name: string]: StorageMap }
    }
  }
  /** Supported bare actions for the contract. An action is a combination of call/create and an OnComplete */
  bareActions: {
    /** OnCompletes this method allows when appID === 0 */
    create: ('NoOp' | 'OptIn' | 'DeleteApplication')[]
    /** OnCompletes this method allows when appID !== 0 */
    call: ('NoOp' | 'OptIn' | 'CloseOut' | 'ClearState' | 'UpdateApplication' | 'DeleteApplication')[]
  }
  /** Information about the TEAL programs */
  sourceInfo?: {
    /** Approval program information */
    approval: SourceInfo[]
    /** Clear program information */
    clear: SourceInfo[]
  }
  /** The pre-compiled TEAL that may contain template variables. MUST be omitted if included as part of ARC23 */
  source?: {
    /** The approval program */
    approval: string
    /** The clear program */
    clear: string
  }
  /** The compiled bytecode for the application. MUST be omitted if included as part of ARC23 */
  byteCode?: {
    /** The approval program */
    approval: string
    /** The clear program */
    clear: string
  }
  /** Information used to get the given byteCode and/or PC values in sourceInfo. MUST be given if byteCode or PC values are present */
  compilerInfo?: {
    /** The name of the compiler */
    compiler: 'algod' | 'puya'
    /** Compiler version information */
    compilerVersion: {
      major: number
      minor: number
      patch: number
      commit?: string
    }
  }
  /** ARC-28 events that MAY be emitted by this contract */
  events?: Array<Event>
  /** A mapping of template variable names as they appear in the teal (not including TMPL_ prefix) to their respecive types and values (if applicable) */
  templateVariables?: {
    [name: string]: {
      /** The type of the template variable */
      type: ABIType | AVMBytes | StructName
      /** If given, the the base64 encoded value used for the given app/program */
      value?: string
    }
  }
  /** The scratch variables used during runtime */
  scratchVariables?: {
    [name: string]: {
      slot: number
      type: ABIType | AVMBytes | StructName
    }
  }
}

/** Describes a method in the contract. This interface is an extension of the interface described in ARC-4 */
export interface Method {
  /** The name of the method */
  name: string
  /** Optional, user-friendly description for the method */
  desc?: string
  /** The arguments of the method, in order */
  args: Array<{
    /** The type of the argument */
    type: ABIType
    /** If the type is a struct, the name of the struct */
    struct?: StructName
    /** Optional, user-friendly name for the argument */
    name?: string
    /** Optional, user-friendly description for the argument */
    desc?: string
    /** The default value that clients should use. MUST be base64 encoded bytes */
    defaultValue?: string
  }>
  /** Information about the method's return value */
  returns: {
    /** The type of the return value, or "void" to indicate no return value. */
    type: ABIType
    /** If the type is a struct, the name of the struct */
    struct?: StructName
    /** Optional, user-friendly description for the return value */
    desc?: string
  }
  /** an action is a combination of call/create and an OnComplete */
  actions: {
    /** OnCompletes this method allows when appID === 0 */
    create: ('NoOp' | 'OptIn' | 'DeleteApplication')[]
    /** OnCompletes this method allows when appID !== 0 */
    call: ('NoOp' | 'OptIn' | 'CloseOut' | 'ClearState' | 'UpdateApplication' | 'DeleteApplication')[]
  }
  /** If this method does not write anything to the ledger (ARC-22) */
  readonly?: boolean
  /** ARC-28 events that MAY be emitted by this method */
  events?: Array<Event>
  /** Information that clients can use when calling the method */
  recommendations?: {
    /** The number of inner transactions the caller should cover the fees for */
    innerTransactionCount?: number
    /** Recommended box references to include */
    boxes?: {
      /** The app ID for the box */
      app?: number
      /** The base64 encoded box key */
      key: string
      /** The number of bytes being read from the box */
      readBytes: number
      /** The number of bytes being written to the box */
      writeBytes: number
    }
    /** Recommended foreign accounts */
    accounts?: string[]
    /** Recommended foreign apps */
    apps?: number[]
    /** Recommended foreign assets */
    assets?: number[]
  }
}

/** ARC-28 event */
export interface Event {
  /** The name of the event */
  name: string
  /** Optional, user-friendly description for the event */
  desc?: string
  /** The arguments of the event, in order */
  args: Array<{
    /** The type of the argument */
    type: ABIType
    /** Optional, user-friendly name for the argument */
    name?: string
    /** Optional, user-friendly description for the argument */
    desc?: string
    /** If the type is a struct, the name of the struct */
    struct?: StructName
  }>
}

/** An ABI-encoded type */
export type ABIType = string

/** The name of a defined struct */
export type StructName = string

/** Raw byteslice without the length prefixed that is specified in ARC-4 */
export type AVMBytes = 'bytes'

/** Mapping of named structs to the ABI type of their fields */
export interface StructFields {
  [fieldName: string]: ABIType | StructFields
}

/** Describes a single key in app storage */
export interface StorageKey {
  /** Description of what this storage key holds */
  desc?: string
  /** The type of the key */
  keyType: ABIType | AVMBytes | StructName

  /** The type of the value */
  valueType: ABIType | AVMBytes | StructName
  /** The bytes of the key encoded as base64 */
  key: string
}

/** Describes a mapping of key-value pairs in storage */
export interface StorageMap {
  /** Description of what the key-value pairs in this mapping hold */
  desc?: string
  /** The type of the keys in the map */
  keyType: ABIType | AVMBytes | StructName
  /** The type of the values in the map */
  valueType: ABIType | AVMBytes | StructName
  /** The base64-encoded prefix of the map keys*/
  prefix?: string
}

export interface SourceInfo {
  /** The line of pre-compiled TEAL */
  teal?: number
  /** The program counter offset(s) that correspond to this line of TEAL */
  pc?: Array<number>
  /** A human-readable string that describes the error when the program fails at this given line of TEAL */
  errorMessage?: string
  /** The line of the dissasembled TEAL this line of pre-compiled TEAL corresponds to */
  disassembledTeal?: number
}
