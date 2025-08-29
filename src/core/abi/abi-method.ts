import { Expand } from '../expand'
import { ABIType, decodeABIValue, encodeABIValue, getABIType } from './abi-type'
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
      // TODO: confirm if we need this logic
      // let abiType: ABIType

      // if (typeof type === 'string') {
      //   if (type in structs) {
      //     abiType = getABITupleTypeFromABIStructDefinition(structs[type], structs)
      //   } else {
      //     abiType = stringToABIType(type)
      //   }
      // } else {
      //   abiType = getABITupleTypeFromABIStructDefinition(type, structs)
      // }

      // const abiValue = convertAbiByteArrays(decodedABITuple[i], abiType)
      // const convertedValue = convertABIDecodedBigIntToNumber(abiValue, abiType)
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

  // TODO: do we need this logic?
  // const abiType = stringToABIType(type)
  // const decodedValue = convertAbiByteArrays(abiType.decode(value), abiType)
  // return convertABIDecodedBigIntToNumber(decodedValue, abiType)

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

function getABIMethodSignature(abiMethod: ABIMethod): string {
  const args = abiMethod.args.map((arg) => arg.type.toString()).join(',')
  const returns = abiMethod.returns.type.toString()
  return `${abiMethod.name}(${args})${returns}`
}

function arc56MethodToABIMethod(method: Arc56Method): ABIMethod {
  if (typeof method.name !== 'string' || typeof method.returns !== 'object' || !Array.isArray(method.args)) {
    throw new Error('Invalid ABIMethod parameters')
  }

  const args = method.args.map(({ type, name, desc }) => {
    if (abiTypeIsTransaction(type) || abiTypeIsReference(type)) {
      return {
        type,
        name,
        desc,
      }
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

export function abiTypeIsTransaction(type: string): type is ABITransactionType {
  return type === 'any' || type === 'pay' || type === 'keyreg' || type === 'acfg' || type === 'axfer' || type === 'afrz' || type === 'appl'
}

export function abiTypeIsReference(type: string): type is ABIReferenceType {
  return type === 'account' || type === 'application' || type === 'asset'
}

// TODO: I think we still need some form of this
/**
 * Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type
 *
 * @param returnValue The smart contract response
 * @param method The method that was called
 * @param structs The struct fields from the app spec
 * @returns The smart contract response with an updated return value
 */
// export function getArc56ReturnValue<TReturn extends Uint8Array | ABIValue | Arc56ABIStruct | undefined>(
//   returnValue: ABIReturn | undefined,
//   method: Arc56Method | Arc56Method,
//   structs: Record<string, StructField[]>,
// ): TReturn {
//   const m = 'method' in method ? method.method : method
//   const type = m.returns.struct ?? m.returns.type
//   if (returnValue?.decodeError) {
//     throw returnValue.decodeError
//   }
//   if (type === undefined || type === 'void' || returnValue?.returnValue === undefined) return undefined as TReturn

//   if (type === 'AVMBytes') return returnValue.rawReturnValue as TReturn
//   if (type === 'AVMString') return Buffer.from(returnValue.rawReturnValue).toString('utf-8') as TReturn
//   if (type === 'AVMUint64') return ABIType.from('uint64').decode(returnValue.rawReturnValue) as TReturn

//   if (structs[type]) {
//     return getABIStructFromABITuple(returnValue.returnValue as ABIValue[], structs[type], structs) as TReturn
//   }

//   return convertAbiByteArrays(returnValue.returnValue, ABIType.from(type)) as TReturn
// }
