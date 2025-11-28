import sha512 from 'js-sha512'
import { ABIAddressType, ABIStructType, ABIType, ABIUintType, parseTupleContent } from './abi-type'
import { ABIValue } from './abi-value'
import { ARC28Event } from './arc28-event'
import { AVMType, Arc56Contract, Arc56Method } from './arc56-contract'

export enum ABITransactionType {
  Txn = 'txn',
  Payment = 'pay',
  KeyRegistration = 'keyreg',
  AssetConfig = 'acfg',
  AssetTransfer = 'axfer',
  AssetFreeze = 'afrz',
  AppCall = 'appl',
}
export enum ABIReferenceType {
  Account = 'account',
  Application = 'application',
  Asset = 'asset',
}
export type ABIMethodArgType = ABIType | ABITransactionType | ABIReferenceType
export type ABIMethodReturnType = ABIType | 'void'

export type ABIMethodArg = {
  type: ABIMethodArgType
  name?: string
  desciption?: string
  defaultValue?: ABIDefaultValue
}

export type ABIMethodReturn = {
  type: ABIType | 'void'
  description?: string
}

export type ABIDefaultValue = {
  /** Base64 encoded bytes, base64 ARC4 encoded uint64, or UTF-8 method selector */
  data: string
  /** Where the default value is coming from */
  source: DefaultValueSource
  /** How the data is encoded. This is the encoding for the data provided here, not the arg type */
  type?: ABIType | AVMType
}

export enum DefaultValueSource {
  Box = 'box',
  Global = 'global',
  Local = 'local',
  Literal = 'literal',
  Method = 'method',
}

/** Represents an ABI method return value with parsed data. */
export type ABIReturn =
  | {
      /** The method that was called. */
      method: ABIMethod
      /** The raw return value as bytes.
       *
       * This value will be empty if the method does not return a value (return type "void")
       */
      rawReturnValue: Uint8Array
      /** The parsed ABI return value.
       *
       * This value will be undefined if decoding failed or the method does not return a value (return type "void")
       */
      returnValue: ABIValue
      /** Any error that occurred during decoding, or undefined if decoding was successful */
      decodeError: undefined
    }
  | { rawReturnValue?: undefined; returnValue?: undefined; method: ABIMethod; decodeError: Error }

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
 * Returns the ABI method object for a given method name or signature and ARC-56 app spec.
 * @param methodNameOrSignature The method name or method signature to call if an ABI call is being emitted.
 * e.g. `my_method` or `my_method(unit64,string)bytes`
 * @param appSpec The app spec for the app
 * @returns The `ABIMethod`
 */
export function findABIMethod(methodNameOrSignature: string, appSpec: Arc56Contract): ABIMethod {
  if (!methodNameOrSignature.includes('(')) {
    const methods = appSpec.methods.filter((m) => m.name === methodNameOrSignature)
    if (methods.length === 0) throw new Error(`Unable to find method ${methodNameOrSignature} in ${appSpec.name} app.`)
    if (methods.length > 1) {
      throw new Error(
        `Received a call to method ${methodNameOrSignature} in contract ${
          appSpec.name
        }, but this resolved to multiple methods; please pass in an ABI signature instead: ${appSpec.methods
          .map((m) => getArc56MethodSignature(m))
          .join(', ')}`,
      )
    }
    return arc56MethodToABIMethod(methods[0], appSpec)
  } else {
    const method = appSpec.methods.find((m) => getArc56MethodSignature(m) === methodNameOrSignature)
    if (!method) throw new Error(`Unable to find method ${methodNameOrSignature} in ${appSpec.name} app.`)
    return arc56MethodToABIMethod(method, appSpec)
  }
}

/**
 * Returns the ABI method object for a given method signature.
 * @param signature The method signature
 * e.g. `my_method(unit64,string)bytes`
 * @returns The `ABIMethod`
 */
export function getABIMethod(signature: string): ABIMethod {
  const argsStart = signature.indexOf('(')
  if (argsStart === -1) {
    throw new Error(`Invalid method signature: ${signature}`)
  }

  let argsEnd = -1
  let depth = 0
  for (let i = argsStart; i < signature.length; i++) {
    const char = signature[i]

    if (char === '(') {
      depth += 1
    } else if (char === ')') {
      if (depth === 0) {
        // unpaired parenthesis
        break
      }

      depth -= 1
      if (depth === 0) {
        argsEnd = i
        break
      }
    }
  }

  if (argsEnd === -1) {
    throw new Error(`Invalid method signature: ${signature}`)
  }

  const name = signature.slice(0, argsStart)
  const args = parseTupleContent(signature.slice(argsStart + 1, argsEnd)) // hmmm the error is bad
    .map((n: string) => {
      if (argTypeIsTransaction(n as ABIMethodArgType) || argTypeIsReference(n as ABIMethodArgType)) {
        return { type: n as ABIMethodArgType } satisfies ABIMethodArg
      }
      return { type: ABIType.from(n) } satisfies ABIMethodArg
    })
  const returnType = signature.slice(argsEnd + 1)
  const returns = { type: returnType === 'void' ? ('void' as const) : ABIType.from(returnType) } satisfies ABIMethodReturn

  return {
    name,
    args,
    returns,
  } satisfies ABIMethod
}

/**
 * Returns the signature of a given ABI method.
 * @param signature The ABI method
 * @returns The signature, e.g. `my_method(unit64,string)bytes`
 */
export function getABIMethodSignature(abiMethod: ABIMethod): string {
  const args = abiMethod.args
    .map((arg) => {
      if (argTypeIsTransaction(arg.type) || argTypeIsReference(arg.type)) return arg.type
      return arg.type.toString()
    })
    .join(',')
  const returns = abiMethod.returns.type === 'void' ? 'void' : abiMethod.returns.type.toString()
  return `${abiMethod.name}(${args})${returns}`
}

/**
 * Returns the method selector of a given ABI method.
 * @param abiMethod The ABI method
 * @returns The 4-byte method selector
 */
export function getABIMethodSelector(abiMethod: ABIMethod): Uint8Array {
  const hash = sha512.sha512_256.array(getABIMethodSignature(abiMethod))
  return new Uint8Array(hash.slice(0, 4))
}

function arc56MethodToABIMethod(method: Arc56Method, appSpec: Arc56Contract): ABIMethod {
  if (typeof method.name !== 'string' || typeof method.returns !== 'object' || !Array.isArray(method.args)) {
    throw new Error('Invalid ABIMethod parameters')
  }

  const args = method.args.map(({ type, name, desc, struct, defaultValue }) => {
    const convertedDefaultValue: ABIDefaultValue | undefined = defaultValue
      ? {
          data: defaultValue.data,
          source: defaultValue.source as DefaultValueSource,
          type: defaultValue.type ? (isAVMType(defaultValue.type) ? defaultValue.type : ABIType.from(defaultValue.type)) : undefined,
        }
      : undefined

    if (argTypeIsTransaction(type as ABIMethodArgType) || argTypeIsReference(type as ABIMethodArgType)) {
      return {
        type: type as ABIMethodArgType,
        name,
        desciption: desc,
        defaultValue: convertedDefaultValue,
      } satisfies ABIMethodArg
    }

    if (struct) {
      return {
        type: ABIStructType.fromStruct(struct, appSpec.structs),
        name,
        desciption: desc,
        defaultValue: convertedDefaultValue,
      } satisfies ABIMethodArg
    }

    return {
      type: ABIType.from(type),
      name,
      desciption: desc,
      defaultValue: convertedDefaultValue,
    } satisfies ABIMethodArg
  })

  const returns = {
    type:
      method.returns.type === ('void' as const)
        ? ('void' as const)
        : method.returns.struct
          ? ABIStructType.fromStruct(method.returns.struct, appSpec.structs)
          : ABIType.from(method.returns.type),
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

export function argTypeIsTransaction(type: ABIMethodArgType): type is ABITransactionType {
  return (
    typeof type === 'string' &&
    (type === ABITransactionType.Txn ||
      type === ABITransactionType.Payment ||
      type === ABITransactionType.KeyRegistration ||
      type === ABITransactionType.AssetConfig ||
      type === ABITransactionType.AssetTransfer ||
      type === ABITransactionType.AssetFreeze ||
      type === ABITransactionType.AppCall)
  )
}

export function argTypeIsReference(type: ABIMethodArgType): type is ABIReferenceType {
  return (
    typeof type === 'string' &&
    (type === ABIReferenceType.Account || type === ABIReferenceType.Application || type === ABIReferenceType.Asset)
  )
}

export function argTypeIsAbiType(type: ABIMethodArgType): type is ABIType {
  return !argTypeIsTransaction(type) && !argTypeIsReference(type)
}

function getArc56MethodSignature(method: Arc56Method): string {
  const args = method.args.map((arg) => arg.type).join(',')
  const returns = method.returns.type
  return `${method.name}(${args})${returns}`
}

export function decodeAVMValue(avmType: AVMType, bytes: Uint8Array): ABIValue {
  switch (avmType) {
    case 'AVMString':
      return Buffer.from(bytes).toString('utf-8')
    case 'AVMBytes':
      return bytes
    case 'AVMUint64':
      return ABIType.from('uint64').decode(bytes)
  }
}

export function encodeAVMValue(avmType: AVMType, value: ABIValue): Uint8Array {
  switch (avmType) {
    case 'AVMString':
      return ABIType.from('string').encode(value)
    case 'AVMBytes':
      if (typeof value === 'string') return Buffer.from(value, 'utf-8')
      if (typeof value !== 'object' || !(value instanceof Uint8Array))
        throw new Error(`Expected bytes value for AVMBytes, but got ${value}`)
      return value
    case 'AVMUint64':
      return ABIType.from('uint64').encode(value)
  }
}

export function isAVMType(type: unknown): type is AVMType {
  return typeof type === 'string' && (type === 'AVMString' || type === 'AVMBytes' || type === 'AVMUint64')
}

export function getABIDecodedValue(type: AVMType | ABIType | ABIReferenceType, bytes: Uint8Array): ABIValue {
  if (type === ABIReferenceType.Asset || type === ABIReferenceType.Application) {
    return new ABIUintType(64).decode(bytes)
  } else if (type === ABIReferenceType.Account) {
    return new ABIAddressType().decode(bytes)
  } else if (isAVMType(type)) {
    return decodeAVMValue(type, bytes)
  }
  return type.decode(bytes)
}

export function getABIEncodedValue(type: AVMType | ABIType, value: ABIValue): Uint8Array {
  return isAVMType(type) ? encodeAVMValue(type, value) : type.encode(value)
}
