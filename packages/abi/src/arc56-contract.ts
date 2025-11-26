/****************/
/** ARC-56 spec */
/****************/

import { ABIStructType, ABIType } from './abi-type'

/** Describes a single key in app storage with parsed ABI types */
export type ABIStorageKey = {
  /** The bytes of the key encoded as base64 */
  key: string
  /** The parsed type of the key (ABI type or AVM type) */
  keyType: ABIType | AVMType
  /** The parsed type of the value (ABI type or AVM type) */
  valueType: ABIType | AVMType
  /** Description of what this storage key holds */
  desc?: string
}

/** Describes a storage map with parsed ABI types */
export type ABIStorageMap = {
  /** The parsed type of the keys in the map (ABI type or AVM type) */
  keyType: ABIType | AVMType
  /** The parsed type of the values in the map (ABI type or AVM type) */
  valueType: ABIType | AVMType
  /** Description of what the key-value pairs in this mapping hold */
  desc?: string
  /** The base64-encoded prefix of the map keys */
  prefix?: string
}

/** Describes the entire contract. This type is an extension of the type described in ARC-4 */
export type Arc56Contract = {
  /** The ARCs used and/or supported by this contract. All contracts implicitly support ARC4 and ARC56 */
  arcs: number[]
  /** A user-friendly name for the contract */
  name: string
  /** Optional, user-friendly description for the type */
  desc?: string
  /**
   * Optional object listing the contract instances across different networks.
   * The key is the base64 genesis hash of the network, and the value contains
   * information about the deployed contract in the network indicated by the
   * key. A key containing the human-readable name of the network MAY be
   * included, but the corresponding genesis hash key MUST also be defined
   */
  networks?: {
    [network: string]: {
      /** The app ID of the deployed contract in this network */
      appID: number
    }
  }
  /** Named structs used by the application. Each struct field appears in the same order as ABI encoding. */
  structs: { [structName: StructName]: StructField[] }
  /** All of the methods that the contract implements */
  methods: Arc56Method[]
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
    approval: ProgramSourceInfo
    /** Clear program information */
    clear: ProgramSourceInfo
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
      commitHash?: string
    }
  }
  /** ARC-28 events that MAY be emitted by this contract */
  events?: Array<Event>
  /** A mapping of template variable names as they appear in the TEAL (not including TMPL_ prefix) to their respective types and values (if applicable) */
  templateVariables?: {
    [name: string]: {
      /** The type of the template variable */
      type: ABITypeName | AVMType | StructName
      /** If given, the base64 encoded value used for the given app/program */
      value?: string
    }
  }
  /** The scratch variables used during runtime */
  scratchVariables?: {
    [name: string]: {
      slot: number
      type: ABITypeName | AVMType | StructName
    }
  }
}

/** Describes a method in the contract. This type is an extension of the type described in ARC-4 */
export type Arc56Method = {
  /** The name of the method */
  name: string
  /** Optional, user-friendly description for the method */
  desc?: string
  /** The arguments of the method, in order */
  args: Array<{
    /** The type of the argument. The `struct` field should also be checked to determine if this arg is a struct. */
    type: ABITypeName
    /** If the type is a struct, the name of the struct */
    struct?: StructName
    /** Optional, user-friendly name for the argument */
    name?: string
    /** Optional, user-friendly description for the argument */
    desc?: string
    /** The default value that clients should use. */
    defaultValue?: {
      /** Base64 encoded bytes, base64 ARC4 encoded uint64, or UTF-8 method selector */
      data: string
      /** How the data is encoded. This is the encoding for the data provided here, not the arg type */
      type?: ABITypeName | AVMType
      /** Where the default value is coming from
       * - box: The data key signifies the box key to read the value from
       * - global: The data key signifies the global state key to read the value from
       * - local: The data key signifies the local state key to read the value from (for the sender)
       * - literal: the value is a literal and should be passed directly as the argument
       * - method: The utf8 signature of the method in this contract to call to get the default value. If the method has arguments, they all must have default values. The method **MUST** be readonly so simulate can be used to get the default value
       */
      source: 'box' | 'global' | 'local' | 'literal' | 'method'
    }
  }>
  /** Information about the method's return value */
  returns: {
    /** The type of the return value, or "void" to indicate no return value. The `struct` field should also be checked to determine if this return value is a struct. */
    type: ABITypeName
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
export type Event = {
  /** The name of the event */
  name: string
  /** Optional, user-friendly description for the event */
  desc?: string
  /** The arguments of the event, in order */
  args: Array<{
    /** The type of the argument. The `struct` field should also be checked to determine if this arg is a struct. */
    type: ABITypeName
    /** Optional, user-friendly name for the argument */
    name?: string
    /** Optional, user-friendly description for the argument */
    desc?: string
    /** If the type is a struct, the name of the struct */
    struct?: StructName
  }>
}

/** An ABI-encoded type */
export type ABITypeName = string

/** The name of a defined struct */
export type StructName = string

/** Raw byteslice without the length prefixed that is specified in ARC-4 */
export type AVMBytes = 'AVMBytes'

/** A utf-8 string without the length prefix that is specified in ARC-4 */
export type AVMString = 'AVMString'

/** A 64-bit unsigned integer */
export type AVMUint64 = 'AVMUint64'

/** A native AVM type */
export type AVMType = AVMBytes | AVMString | AVMUint64

/** Information about a single field in a struct */
export type StructField = {
  /** The name of the struct field */
  name: string
  /** The type of the struct field's value */
  type: ABITypeName | StructName | StructField[]
}

/** Describes a single key in app storage */
export type StorageKey = {
  /** Description of what this storage key holds */
  desc?: string
  /** The type of the key */
  keyType: ABITypeName | AVMType | StructName

  /** The type of the value */
  valueType: ABITypeName | AVMType | StructName
  /** The bytes of the key encoded as base64 */
  key: string
}

/** Describes a mapping of key-value pairs in storage */
export type StorageMap = {
  /** Description of what the key-value pairs in this mapping hold */
  desc?: string
  /** The type of the keys in the map */
  keyType: ABITypeName | AVMType | StructName
  /** The type of the values in the map */
  valueType: ABITypeName | AVMType | StructName
  /** The base64-encoded prefix of the map keys*/
  prefix?: string
}

type SourceInfo = {
  /** The program counter value(s). Could be offset if pcOffsetMethod is not "none" */
  pc: Array<number>
  /** A human-readable string that describes the error when the program fails at the given PC */
  errorMessage?: string
  /** The TEAL line number that corresponds to the given PC. RECOMMENDED to be used for development purposes, but not required for clients */
  teal?: number
  /** The original source file and line number that corresponds to the given PC. RECOMMENDED to be used for development purposes, but not required for clients */
  source?: string
}

export type ProgramSourceInfo = {
  /** The source information for the program */
  sourceInfo: SourceInfo[]
  /** How the program counter offset is calculated
   * - none: The pc values in sourceInfo are not offset
   * - cblocks: The pc values in sourceInfo are offset by the PC of the first op following the last cblock at the top of the program
   */
  pcOffsetMethod: 'none' | 'cblocks'
}

/*************************/
/** Storage Helper Functions */
/*************************/

/**
 * Resolves a storage type string (ABI type, AVM type, or struct name) into an ABIType or AVMType
 * @param typeStr The type string to resolve
 * @param structs The structs defined in the contract
 * @returns The parsed ABIType or AVMType string
 */
function resolveStorageType(typeStr: string, structs: Record<string, StructField[]>): ABIType | AVMType {
  // Check if it's an AVM type
  if (typeStr === 'AVMBytes' || typeStr === 'AVMString' || typeStr === 'AVMUint64') {
    return typeStr as AVMType
  }

  // Check if it's a struct type
  if (structs[typeStr]) {
    return ABIStructType.fromStruct(typeStr, structs)
  }

  // Otherwise parse as ABI type
  try {
    return ABIType.from(typeStr)
  } catch (error) {
    throw new Error(`Failed to parse storage type '${typeStr}': ${error}`)
  }
}

/**
 * Converts a StorageKey to an ABIStorageKey with parsed types
 * @param storageKey The storage key to convert
 * @param structs The structs defined in the contract
 * @returns The converted ABIStorageKey
 */
function convertStorageKey(storageKey: StorageKey, structs: Record<string, StructField[]>): ABIStorageKey {
  const keyType = resolveStorageType(storageKey.keyType, structs)
  const valueType = resolveStorageType(storageKey.valueType, structs)

  return {
    key: storageKey.key,
    keyType,
    valueType,
    desc: storageKey.desc,
  }
}

/**
 * Converts a StorageMap to an ABIStorageMap with parsed types
 * @param storageMap The storage map to convert
 * @param structs The structs defined in the contract
 * @returns The converted ABIStorageMap
 */
function convertStorageMap(storageMap: StorageMap, structs: Record<string, StructField[]>): ABIStorageMap {
  const keyType = resolveStorageType(storageMap.keyType, structs)
  const valueType = resolveStorageType(storageMap.valueType, structs)

  return {
    keyType,
    valueType,
    desc: storageMap.desc,
    prefix: storageMap.prefix,
  }
}

/**
 * Get a specific global storage key with parsed ABI types
 * @param contract The ARC-56 contract
 * @param keyName The name of the storage key
 * @returns The ABIStorageKey with parsed types
 * @throws Error if the key is not found
 */
export function getGlobalABIStorageKey(contract: Arc56Contract, keyName: string): ABIStorageKey {
  const storageKey = contract.state.keys.global[keyName]
  if (!storageKey) {
    throw new Error(`Global storage key '${keyName}' not found in contract '${contract.name}'`)
  }
  return convertStorageKey(storageKey, contract.structs)
}

/**
 * Get a specific local storage key with parsed ABI types
 * @param contract The ARC-56 contract
 * @param keyName The name of the storage key
 * @returns The ABIStorageKey with parsed types
 * @throws Error if the key is not found
 */
export function getLocalABIStorageKey(contract: Arc56Contract, keyName: string): ABIStorageKey {
  const storageKey = contract.state.keys.local[keyName]
  if (!storageKey) {
    throw new Error(`Local storage key '${keyName}' not found in contract '${contract.name}'`)
  }
  return convertStorageKey(storageKey, contract.structs)
}

/**
 * Get a specific box storage key with parsed ABI types
 * @param contract The ARC-56 contract
 * @param keyName The name of the storage key
 * @returns The ABIStorageKey with parsed types
 * @throws Error if the key is not found
 */
export function getBoxABIStorageKey(contract: Arc56Contract, keyName: string): ABIStorageKey {
  const storageKey = contract.state.keys.box[keyName]
  if (!storageKey) {
    throw new Error(`Box storage key '${keyName}' not found in contract '${contract.name}'`)
  }
  return convertStorageKey(storageKey, contract.structs)
}

/**
 * Get all global storage keys with parsed ABI types
 * @param contract The ARC-56 contract
 * @returns A record of storage key names to ABIStorageKey objects
 */
export function getGlobalABIStorageKeys(contract: Arc56Contract): Record<string, ABIStorageKey> {
  const result: Record<string, ABIStorageKey> = {}
  for (const [name, storageKey] of Object.entries(contract.state.keys.global)) {
    result[name] = convertStorageKey(storageKey, contract.structs)
  }
  return result
}

/**
 * Get all local storage keys with parsed ABI types
 * @param contract The ARC-56 contract
 * @returns A record of storage key names to ABIStorageKey objects
 */
export function getLocalABIStorageKeys(contract: Arc56Contract): Record<string, ABIStorageKey> {
  const result: Record<string, ABIStorageKey> = {}
  for (const [name, storageKey] of Object.entries(contract.state.keys.local)) {
    result[name] = convertStorageKey(storageKey, contract.structs)
  }
  return result
}

/**
 * Get all box storage keys with parsed ABI types
 * @param contract The ARC-56 contract
 * @returns A record of storage key names to ABIStorageKey objects
 */
export function getBoxABIStorageKeys(contract: Arc56Contract): Record<string, ABIStorageKey> {
  const result: Record<string, ABIStorageKey> = {}
  for (const [name, storageKey] of Object.entries(contract.state.keys.box)) {
    result[name] = convertStorageKey(storageKey, contract.structs)
  }
  return result
}

/**
 * Get a specific global storage map with parsed ABI types
 * @param contract The ARC-56 contract
 * @param mapName The name of the storage map
 * @returns The ABIStorageMap with parsed types
 * @throws Error if the map is not found
 */
export function getGlobalABIStorageMap(contract: Arc56Contract, mapName: string): ABIStorageMap {
  const storageMap = contract.state.maps.global[mapName]
  if (!storageMap) {
    throw new Error(`Global storage map '${mapName}' not found in contract '${contract.name}'`)
  }
  return convertStorageMap(storageMap, contract.structs)
}

/**
 * Get a specific local storage map with parsed ABI types
 * @param contract The ARC-56 contract
 * @param mapName The name of the storage map
 * @returns The ABIStorageMap with parsed types
 * @throws Error if the map is not found
 */
export function getLocalABIStorageMap(contract: Arc56Contract, mapName: string): ABIStorageMap {
  const storageMap = contract.state.maps.local[mapName]
  if (!storageMap) {
    throw new Error(`Local storage map '${mapName}' not found in contract '${contract.name}'`)
  }
  return convertStorageMap(storageMap, contract.structs)
}

/**
 * Get a specific box storage map with parsed ABI types
 * @param contract The ARC-56 contract
 * @param mapName The name of the storage map
 * @returns The ABIStorageMap with parsed types
 * @throws Error if the map is not found
 */
export function getBoxABIStorageMap(contract: Arc56Contract, mapName: string): ABIStorageMap {
  const storageMap = contract.state.maps.box[mapName]
  if (!storageMap) {
    throw new Error(`Box storage map '${mapName}' not found in contract '${contract.name}'`)
  }
  return convertStorageMap(storageMap, contract.structs)
}

/**
 * Get all global storage maps with parsed ABI types
 * @param contract The ARC-56 contract
 * @returns A record of storage map names to ABIStorageMap objects
 */
export function getGlobalABIStorageMaps(contract: Arc56Contract): Record<string, ABIStorageMap> {
  const result: Record<string, ABIStorageMap> = {}
  for (const [name, storageMap] of Object.entries(contract.state.maps.global)) {
    result[name] = convertStorageMap(storageMap, contract.structs)
  }
  return result
}

/**
 * Get all local storage maps with parsed ABI types
 * @param contract The ARC-56 contract
 * @returns A record of storage map names to ABIStorageMap objects
 */
export function getLocalABIStorageMaps(contract: Arc56Contract): Record<string, ABIStorageMap> {
  const result: Record<string, ABIStorageMap> = {}
  for (const [name, storageMap] of Object.entries(contract.state.maps.local)) {
    result[name] = convertStorageMap(storageMap, contract.structs)
  }
  return result
}

/**
 * Get all box storage maps with parsed ABI types
 * @param contract The ARC-56 contract
 * @returns A record of storage map names to ABIStorageMap objects
 */
export function getBoxABIStorageMaps(contract: Arc56Contract): Record<string, ABIStorageMap> {
  const result: Record<string, ABIStorageMap> = {}
  for (const [name, storageMap] of Object.entries(contract.state.maps.box)) {
    result[name] = convertStorageMap(storageMap, contract.structs)
  }
  return result
}
