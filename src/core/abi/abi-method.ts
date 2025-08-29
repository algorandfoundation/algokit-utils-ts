import sha512 from 'js-sha512'
import { Expand } from '../expand'
import { ABIType, decodeABIValue, encodeABIValue, getABIType, getABITypeName } from './abi-type'
import { ABIValue } from './abi-value'
import { Arc56Contract, Arc56Method, StructField } from './arc56-contract'
import { ARC28Event } from './event'
import { ABITupleType, decodeTuple, encodeTuple } from './types'

export type ABITransactionType = 'txn' | 'pay' | 'keyreg' | 'acfg' | 'axfer' | 'afrz' | 'appl'
export type ABIReferenceType = 'account' | 'application' | 'asset'
export type ABIArgumentType = ABIType | ABITransactionType | ABIReferenceType
export type ABIReturnType = ABIType | 'void'

export type ABIMethodArg = Expand<
  Omit<Arc56Method['args'][number], 'type'> & {
    type: ABIArgumentType
  }
>

export type ABIMethodReturn = Expand<
  Omit<Arc56Method['returns'], 'type'> & {
    type: ABIReturnType
  }
>

/** Decoded ARC-56 struct as a struct rather than a tuple. */
export type ABIStruct = {
  [key: string]: ABIStruct | ABIValue
}

export type ABIMethod = {
  name: string
  description?: string
  args: ABIMethodArg[]
  returns: ABIMethodReturn
  events?: ARC28Event[]
  readonly?: boolean
}

/**
 * Returns the `ABITupleType` for the given ARC-56 struct definition
 * @param struct The ARC-56 struct definition
 * @returns The `ABITupleType`
 */
export function getABITupleTypeFromABIStructDefinition(struct: StructField[], structs: Record<string, StructField[]>): ABITupleType {
  const childTypes = struct.map((v) =>
    typeof v.type === 'string'
      ? structs[v.type]
        ? getABITupleTypeFromABIStructDefinition(structs[v.type], structs)
        : getABIType(v.type)
      : getABITupleTypeFromABIStructDefinition(v.type, structs),
  )
  return {
    name: 'Tuple',
    childTypes: childTypes,
  } satisfies ABITupleType
}

/**
 * Converts a decoded ABI tuple as a struct.
 * @param decodedABITuple The decoded ABI tuple value
 * @param structFields The struct fields from an ARC-56 app spec
 * @returns The struct as a Record<string, any>
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getABIStructFromABITuple<TReturn extends ABIStruct = Record<string, any>>(
  decodedABITuple: ABIValue[],
  structFields: StructField[],
  structs: Record<string, StructField[]>,
): TReturn {
  return Object.fromEntries(
    structFields.map(({ name: key, type }, i) => {
      return [
        key,
        (typeof type === 'string' && !structs[type]) || !Array.isArray(decodedABITuple[i])
          ? decodedABITuple[i]
          : getABIStructFromABITuple(decodedABITuple[i], typeof type === 'string' ? structs[type] : type, structs),
      ]
    }),
  ) as TReturn
}

/**
 * Converts an ARC-56 struct as an ABI tuple.
 * @param struct The struct to convert
 * @param structFields The struct fields from an ARC-56 app spec
 * @returns The struct as a decoded ABI tuple
 */
export function getABITupleFromABIStruct(
  struct: ABIStruct,
  structFields: StructField[],
  structs: Record<string, StructField[]>,
): ABIValue[] {
  return structFields.map(({ name: key, type }) => {
    const value = struct[key]
    return typeof type === 'string' && !structs[type]
      ? (value as ABIValue)
      : getABITupleFromABIStruct(value as ABIStruct, typeof type === 'string' ? structs[type] : type, structs)
  })
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
  structs: Record<string, StructField[]>,
): ABIValue | ABIStruct {
  if (type === 'AVMBytes' || typeof value !== 'object') return value
  if (type === 'AVMString') return Buffer.from(value).toString('utf-8')
  if (type === 'AVMUint64') return decodeABIValue(getABIType('uint64'), value)
  if (structs[type]) {
    const tupleValue = decodeTuple(getABITupleTypeFromABIStructDefinition(structs[type], structs), value)
    return getABIStructFromABITuple(tupleValue, structs[type], structs)
  }

  const abiType = getABIType(type)
  return decodeABIValue(abiType, value)
}

/**
 * Returns the ABI-encoded value for the given value.
 * @param value The value to encode either already in encoded binary form (`Uint8Array`), a decoded ABI value or an ARC-56 struct
 * @param type The ARC-56 type - either an ABI Type string or a struct name
 * @param structs The defined ARC-56 structs
 * @returns The binary ABI-encoded value
 */
export function getABIEncodedValue(
  value: Uint8Array | ABIValue | ABIStruct,
  type: string,
  structs: Record<string, StructField[]>,
): Uint8Array {
  if (typeof value === 'object' && value instanceof Uint8Array) return value
  if (type === 'AVMUint64') return encodeABIValue(getABIType('uint64'), value as bigint | number)
  if (type === 'AVMBytes' || type === 'AVMString') {
    if (typeof value === 'string') return Buffer.from(value, 'utf-8')
    if (typeof value !== 'object' || !(value instanceof Uint8Array)) throw new Error(`Expected bytes value for ${type}, but got ${value}`)
    return value
  }
  if (structs[type]) {
    const tupleType = getABITupleTypeFromABIStructDefinition(structs[type], structs)
    if (Array.isArray(value)) {
      encodeTuple(tupleType, value)
    } else {
      const values = getABITupleFromABIStruct(value as ABIStruct, structs[type], structs)
      return encodeTuple(tupleType, values)
    }
  }

  const abiType = getABIType(type)
  return encodeABIValue(abiType, value as ABIValue)
}

/**
 * Returns the ABI method object for a given method name or signature and ARC-56 app spec.
 * @param methodNameOrSignature The method name or method signature to call if an ABI call is being emitted.
 * e.g. `my_method` or `my_method(unit64,string)bytes`
 * @param appSpec The app spec for the app
 * @returns The `ABIMethod`
 */
export function getABIMethod(methodNameOrSignature: string, appSpec: Arc56Contract): ABIMethod {
  let method: Arc56Method
  if (!methodNameOrSignature.includes('(')) {
    const methods = appSpec.methods.filter((m) => m.name === methodNameOrSignature)
    if (methods.length === 0) throw new Error(`Unable to find method ${methodNameOrSignature} in ${appSpec.name} app.`)
    if (methods.length > 1) {
      throw new Error(
        `Received a call to method ${methodNameOrSignature} in contract ${
          appSpec.name
        }, but this resolved to multiple methods; please pass in an ABI signature instead: ${appSpec.methods
          .map((m) => getABIMethodSignature(arc56MethodToABIMethod(m)))
          .join(', ')}`,
      )
    }
    method = methods[0]
  } else {
    const m = appSpec.methods.find((m) => getABIMethodSignature(arc56MethodToABIMethod(m)) === methodNameOrSignature)
    if (!m) throw new Error(`Unable to find method ${methodNameOrSignature} in ${appSpec.name} app.`)
    method = m
  }
  return arc56MethodToABIMethod(method)
}

export function getABIMethodSignature(abiMethod: ABIMethod): string {
  const args = abiMethod.args
    .map((arg) => {
      if (abiTypeIsTransaction(arg.type) || abiTypeIsReference(arg.type)) return arg.type
      return getABITypeName(arg.type)
    })
    .join(',')
  const returns = abiMethod.returns.type === 'void' ? 'void' : getABITypeName(abiMethod.returns.type)
  return `${abiMethod.name}(${args})${returns}`
}

export function getABIMethodSelector(abiMethod: ABIMethod): Uint8Array {
  const hash = sha512.sha512_256.array(getABIMethodSignature(abiMethod))
  return new Uint8Array(hash.slice(0, 4))
}

function arc56MethodToABIMethod(method: Arc56Method): ABIMethod {
  if (typeof method.name !== 'string' || typeof method.returns !== 'object' || !Array.isArray(method.args)) {
    throw new Error('Invalid ABIMethod parameters')
  }

  const args = method.args.map(({ type, name, desc, defaultValue, struct }) => {
    if (abiTypeIsTransaction(type) || abiTypeIsReference(type)) {
      return {
        type,
        name,
        desc,
        defaultValue,
        struct,
      } satisfies ABIMethodArg
    }

    return {
      type: getABIType(type),
      name,
      desc,
    }
  })
  const returns = {
    type: method.returns.type === ('void' as const) ? method.returns.type : getABIType(method.returns.type),
    desc: method.returns.desc,
  }

  return {
    name: method.name,
    description: method.desc,
    args,
    returns,
    events: method.events,
    readonly: method.readonly,
  } satisfies ABIMethod
}

export function abiTypeIsTransaction(type: ABIArgumentType | string): type is ABITransactionType {
  return (
    typeof type === 'string' &&
    (type === 'txn' || type === 'pay' || type === 'keyreg' || type === 'acfg' || type === 'axfer' || type === 'afrz' || type === 'appl')
  )
}

export function abiTypeIsReference(type: ABIArgumentType | string): type is ABIReferenceType {
  return typeof type === 'string' && (type === 'account' || type === 'application' || type === 'asset')
}
