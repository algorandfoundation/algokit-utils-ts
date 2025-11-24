import {
  AlgodClient,
  ApplicationLocalReference,
  AssetHoldingReference,
  EvalDelta,
  PendingTransactionResponse,
  TealValue,
} from '@algorandfoundation/algokit-algod-client'
import { ResourceReference, BoxReference as TransactionBoxReference } from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { Address, ProgramSourceMap } from '@algorandfoundation/sdk'
import { getABIReturnValue } from '../transaction/transaction'
import { TransactionSignerAccount } from './account'
import {
  BoxName,
  DELETABLE_TEMPLATE_NAME,
  UPDATABLE_TEMPLATE_NAME,
  type ABIReturn,
  type AppState,
  type CompiledTeal,
  type TealTemplateParams,
} from './app'

/** Information about an app. */
export interface AppInformation {
  /** The ID of the app. */
  appId: bigint
  /** The escrow address that the app operates with. */
  appAddress: Address
  /**
   * Approval program.
   */
  approvalProgram: Uint8Array
  /**
   * Clear state program.
   */
  clearStateProgram: Uint8Array
  /**
   * The address that created this application. This is the address where the
   * parameters and global state for this application can be found.
   */
  creator: Address
  /**
   * Current global state values.
   */
  globalState: AppState
  /** The number of allocated ints in per-user local state. */
  localInts: number
  /** The number of allocated byte slices in per-user local state. */
  localByteSlices: number
  /** The number of allocated ints in global state. */
  globalInts: number
  /** The number of allocated byte slices in global state. */
  globalByteSlices: number
  /** Any extra pages that are needed for the smart contract. */
  extraProgramPages?: number
}

/**
 * Something that identifies an app box name - either a:
 *  * `Uint8Array` (the actual binary of the box name)
 *  * `string` (that will be encoded to a `Uint8Array`)
 *  * `TransactionSignerAccount` (that will be encoded into the
 *    public key address of the corresponding account)
 */
export type BoxIdentifier = string | Uint8Array | TransactionSignerAccount

/**
 * A grouping of the app ID and name identifier to reference an app box.
 */
export interface BoxReference {
  /**
   * A unique application id
   */
  appId: bigint
  /**
   * Identifier for a box name
   */
  name: BoxIdentifier
}

/**
 * Parameters to get and decode a box value as an ABI type.
 */
export interface BoxValueRequestParams {
  /** The ID of the app return box names for */
  appId: bigint
  /** The name of the box to return either as a string, binary array or `BoxName` */
  boxName: BoxIdentifier
  /** The ABI type to decode the value using */
  type: algosdk.ABIType
}

/**
 * Parameters to get and decode a box value as an ABI type.
 */
export interface BoxValuesRequestParams {
  /** The ID of the app return box names for */
  appId: bigint
  /** The names of the boxes to return either as a string, binary array or BoxName` */
  boxNames: BoxIdentifier[]
  /** The ABI type to decode the value using */
  type: algosdk.ABIType
}

/**
 * Names a single resource reference. Only one of the fields should be set.
 */
export interface AccessReference {
  /** Any account addresses whose balance record is accessible by the executing ApprovalProgram or ClearStateProgram. */
  address?: string | Address
  /** Application ID whose GlobalState may be read by the executing ApprovalProgram or ClearStateProgram. */
  appId?: bigint
  /** Asset ID whose AssetParams may be read by the executing ApprovalProgram or ClearStateProgram. */
  assetId?: bigint
  /** Defines a holding by referring to an Address and Asset it belongs to. */
  holding?: AssetHoldingReference
  /** Defines a local state by referring to an Address and App it belongs to. */
  locals?: ApplicationLocalReference
  /** Defines a box by its name and the application ID it belongs to. */
  box?: BoxReference
}

/** Allows management of application information. */
export class AppManager {
  private _algod: AlgodClient
  private _compilationResults: Record<string, CompiledTeal> = {}

  /**
   * Creates an `AppManager`
   * @param algod An algod instance
   */
  constructor(algod: AlgodClient) {
    this._algod = algod
  }

  /**
   * Compiles the given TEAL using algod and returns the result, including source map.
   *
   * The result of this compilation is also cached keyed by the TEAL
   *  code so it can be retrieved via `getCompilationResult`.
   *
   * This function is re-entrant; it will only compile the same code once.
   *
   * @param tealCode The TEAL code
   * @returns The information about the compiled file
   * @example
   * ```typescript
   * const compiled = await appManager.compileTeal(tealProgram)
   * ```
   */
  async compileTeal(tealCode: string): Promise<CompiledTeal> {
    if (this._compilationResults[tealCode]) {
      return this._compilationResults[tealCode]
    }

    const compiled = await this._algod.tealCompile(tealCode, { sourcemap: true })
    const result = {
      teal: tealCode,
      compiled: compiled.result,
      compiledHash: compiled.hash,
      compiledBase64ToBytes: new Uint8Array(Buffer.from(compiled.result, 'base64')),
      sourceMap: new ProgramSourceMap(compiled.sourcemap as { version: number; sources: string[]; names: string[]; mappings: string }),
    }
    this._compilationResults[tealCode] = result

    return result
  }

  /**
   * Performs template substitution of a teal template and compiles it, returning the compiled result.
   *
   * Looks for `TMPL_{parameter}` for template replacements and replaces AlgoKit deploy-time control parameters
   * if deployment metadata is specified.
   *
   * * `TMPL_UPDATABLE` for updatability / immutability control
   * * `TMPL_DELETABLE` for deletability / permanence control
   *
   * @param tealTemplateCode The TEAL logic to compile
   * @param templateParams Any parameters to replace in the .teal file before compiling
   * @param deploymentMetadata The deployment metadata the app will be deployed with
   * @returns The information about the compiled code
   * @example
   * ```typescript
   * const compiled = await appManager.compileTealTemplate(tealTemplate, { TMPL_APP_ID: 12345n }, { updatable: true, deletable: false })
   * ```
   */
  async compileTealTemplate(
    tealTemplateCode: string,
    templateParams?: TealTemplateParams,
    deploymentMetadata?: { updatable?: boolean; deletable?: boolean },
  ): Promise<CompiledTeal> {
    let tealCode = AppManager.stripTealComments(tealTemplateCode)

    tealCode = AppManager.replaceTealTemplateParams(tealCode, templateParams)

    if (deploymentMetadata) {
      tealCode = AppManager.replaceTealTemplateDeployTimeControlParams(tealCode, deploymentMetadata)
    }

    return await this.compileTeal(tealCode)
  }

  /**
   * Returns a previous compilation result.
   * @param tealCode The TEAL code
   * @returns The information about the previously compiled file
   *  or `undefined` if that TEAL code wasn't previously compiled
   * @example
   * ```typescript
   * const compiled = appManager.getCompilationResult(tealProgram)
   * ```
   */
  getCompilationResult(tealCode: string): CompiledTeal | undefined {
    return this._compilationResults[tealCode]
  }

  /**
   * Returns the current app information for the app with the given ID.
   *
   * @example
   * ```typescript
   * const appInfo = await appManager.getById(12353n);
   * ```
   *
   * @param appId The ID of the app
   * @returns The app information
   */
  public async getById(appId: bigint): Promise<AppInformation> {
    const app = await this._algod.getApplicationById(Number(appId))
    // Convert global state from new format (key: string) to old format (key: Uint8Array)
    const convertedGlobalState = (app.params.globalState ?? []).map((kv) => ({
      key: new Uint8Array(Buffer.from(kv.key, 'base64')),
      value: kv.value,
    }))

    return {
      appId: BigInt(app.id),
      appAddress: algosdk.getApplicationAddress(app.id),
      approvalProgram: app.params.approvalProgram,
      clearStateProgram: app.params.clearStateProgram,
      creator: Address.fromString(app.params.creator),
      localInts: Number(app.params.localStateSchema?.numUint ?? 0),
      localByteSlices: Number(app.params.localStateSchema?.numByteSlice ?? 0),
      globalInts: Number(app.params.globalStateSchema?.numUint ?? 0),
      globalByteSlices: Number(app.params.globalStateSchema?.numByteSlice ?? 0),
      extraProgramPages: Number(app.params.extraProgramPages ?? 0),
      globalState: AppManager.decodeAppState(convertedGlobalState),
    }
  }

  /**
   * Returns the current global state values for the given app ID and account address
   *
   * @param appId The ID of the app to return global state for
   * @returns The current global state for the given app
   * @example
   * ```typescript
   * const globalState = await appManager.getGlobalState(12353n);
   * ```
   */
  public async getGlobalState(appId: bigint) {
    return (await this.getById(appId)).globalState
  }

  /**
   * Returns the current local state values for the given app ID and account address
   *
   * @param appId The ID of the app to return local state for
   * @param address The string address of the account to get local state for the given app
   * @returns The current local state for the given (app, account) combination
   * @example
   * ```typescript
   * const localState = await appManager.getLocalState(12353n, 'ACCOUNTADDRESS');
   * ```
   */
  public async getLocalState(appId: bigint, address: Address | string) {
    const addressStr = typeof address === 'string' ? address : address.toString()
    const appInfo = await this._algod.accountApplicationInformation(addressStr, Number(appId))

    if (!appInfo.appLocalState) {
      throw new Error("Couldn't find local state")
    }

    // If keyValue is undefined or empty, return empty state
    if (!appInfo.appLocalState.keyValue || appInfo.appLocalState.keyValue.length === 0) {
      return {}
    }

    const convertedState = appInfo.appLocalState.keyValue.map((kv) => ({
      key: new Uint8Array(Buffer.from(kv.key, 'base64')),
      value: kv.value,
    }))

    return AppManager.decodeAppState(convertedState)
  }

  /**
   * Returns the names of the current boxes for the given app.
   * @param appId The ID of the app return box names for
   * @returns The current box names
   * @example
   * ```typescript
   * const boxNames = await appManager.getBoxNames(12353n);
   * ```
   */
  public async getBoxNames(appId: bigint): Promise<BoxName[]> {
    const boxResult = await this._algod.getApplicationBoxes(Number(appId))
    return boxResult.boxes.map((b: { name: Uint8Array }) => {
      return {
        nameRaw: b.name,
        nameBase64: Buffer.from(b.name).toString('base64'),
        name: Buffer.from(b.name).toString('utf-8'),
      }
    })
  }

  /**
   * Returns the value of the given box name for the given app.
   * @param appId The ID of the app return box names for
   * @param boxName The name of the box to return either as a string, binary array or `BoxName`
   * @returns The current box value as a byte array
   * @example
   * ```typescript
   * const boxValue = await appManager.getBoxValue(12353n, 'boxName');
   * ```
   */
  public async getBoxValue(appId: bigint, boxName: BoxIdentifier | BoxName): Promise<Uint8Array> {
    const boxId = typeof boxName === 'object' && 'nameRaw' in boxName ? boxName.nameRaw : boxName
    const nameBytes = AppManager.getBoxReference(boxId).name
    const nameBase64 = Buffer.from(nameBytes).toString('base64')
    const boxResult = await this._algod.getApplicationBoxByName(Number(appId), { name: `b64:${nameBase64}` })
    return boxResult.value
  }

  /**
   * Returns the value of the given box names for the given app.
   * @param appId The ID of the app return box names for
   * @param boxNames The names of the boxes to return either as a string, binary array or `BoxName`
   * @returns The current box values as a byte array in the same order as the passed in box names
   * @example
   * ```typescript
   * const boxValues = await appManager.getBoxValues(12353n, ['boxName1', 'boxName2']);
   * ```
   */
  public async getBoxValues(appId: bigint, boxNames: (BoxIdentifier | BoxName)[]): Promise<Uint8Array[]> {
    return await Promise.all(boxNames.map(async (boxName) => await this.getBoxValue(appId, boxName)))
  }

  /**
   * Returns the value of the given box name for the given app decoded based on the given ABI type.
   * @param request The parameters for the box value request
   * @returns The current box value as an ABI value
   * @example
   * ```typescript
   * const boxValue = await appManager.getBoxValueFromABIType({ appId: 12353n, boxName: 'boxName', type: new ABIUintType(32) });
   * ```
   */
  public async getBoxValueFromABIType(request: BoxValueRequestParams): Promise<algosdk.ABIValue> {
    const { appId, boxName, type } = request
    const value = await this.getBoxValue(appId, boxName)
    return type.decode(value)
  }

  /**
   * Returns the value of the given box names for the given app decoded based on the given ABI type.
   * @param request The parameters for the box value request
   * @returns The current box values as an ABI value in the same order as the passed in box names
   * @example
   * ```typescript
   * const boxValues = await appManager.getBoxValuesFromABIType({ appId: 12353n, boxNames: ['boxName1', 'boxName2'], type: new ABIUintType(32) });
   * ```
   */
  public async getBoxValuesFromABIType(request: BoxValuesRequestParams): Promise<algosdk.ABIValue[]> {
    const { appId, boxNames, type } = request
    return await Promise.all(boxNames.map(async (boxName) => await this.getBoxValueFromABIType({ appId, boxName, type })))
  }

  /**
   * Returns a `algosdk.BoxReference` given a `BoxIdentifier` or `BoxReference`.
   * @param boxId The box to return a reference for
   * @returns The box reference ready to pass into a `algosdk.Transaction`
   * @example
   * ```typescript
   * const boxRef = AppManager.getBoxReference('boxName');
   * ```
   */
  public static getBoxReference(boxId: BoxIdentifier | BoxReference): TransactionBoxReference {
    const ref = typeof boxId === 'object' && 'appId' in boxId ? boxId : { appId: 0n, name: boxId }
    return {
      appIndex: ref.appId,
      name: typeof ref.name === 'string' ? new TextEncoder().encode(ref.name) : 'length' in ref.name ? ref.name : ref.name.addr.publicKey,
    } as TransactionBoxReference
  }

  /**
   * Converts an array of global/local state values from the algod api to a more friendly
   * generic object keyed by the UTF-8 value of the key.
   * @param state A `global-state`, `local-state`, `global-state-deltas` or `local-state-deltas`
   * @returns An object keyeed by the UTF-8 representation of the key with various parsings of the values
   * @example
   * ```typescript
   * const stateValues = AppManager.decodeAppState(state);
   * ```
   */
  public static decodeAppState(state: { key: Uint8Array; value: TealValue | EvalDelta }[]): AppState {
    const stateValues = {} as AppState

    // Start with empty set
    for (const stateVal of state) {
      const keyBase64 = Buffer.from(stateVal.key).toString('base64')
      const keyRaw = stateVal.key
      const key = Buffer.from(stateVal.key).toString('utf-8')
      const tealValue = stateVal.value

      const dataTypeFlag = Number('action' in tealValue ? tealValue.action : tealValue.type)
      let valueBase64: string
      let valueRaw: Buffer
      switch (dataTypeFlag) {
        case 1:
          valueBase64 =
            typeof tealValue.bytes === 'string' ? tealValue.bytes : tealValue.bytes ? Buffer.from(tealValue.bytes).toString('base64') : ''
          valueRaw = Buffer.from(valueBase64, 'base64')
          stateValues[key] = {
            keyRaw,
            keyBase64,
            valueRaw: new Uint8Array(valueRaw),
            valueBase64: valueBase64,
            value: valueRaw.toString('utf-8'),
          }
          break
        case 2: {
          const value = tealValue.uint ?? 0
          stateValues[key] = {
            keyRaw,
            keyBase64,
            value: BigInt(value),
          }
          break
        }
        default:
          throw new Error(`Received unknown state data type of ${dataTypeFlag}`)
      }
    }

    return stateValues
  }

  /**
   * Returns any ABI return values for the given app call arguments and transaction confirmation.
   * @param confirmation The transaction confirmation from algod
   * @param method The ABI method
   * @returns The return value for the method call
   * @example
   * ```typescript
   * const returnValue = AppManager.getABIReturn(confirmation, ABIMethod.fromSignature('hello(string)void'));
   * ```
   */
  public static getABIReturn(
    confirmation: PendingTransactionResponse | undefined,
    method: algosdk.ABIMethod | undefined,
  ): ABIReturn | undefined {
    if (!method || !confirmation || method.returns.type === 'void') {
      return undefined
    }

    // The parseMethodResponse method mutates the second parameter :(
    const resultDummy: algosdk.ABIResult = {
      txID: '',
      method,
      rawReturnValue: new Uint8Array(),
    }
    return getABIReturnValue(algosdk.AtomicTransactionComposer.parseMethodResponse(method, resultDummy, confirmation), method.returns.type)
  }

  /**
   * Replaces AlgoKit deploy-time deployment control parameters within the given TEAL template code.
   *
   * * `TMPL_UPDATABLE` for updatability / immutability control
   * * `TMPL_DELETABLE` for deletability / permanence control
   *
   * Note: If these values are defined, but the corresponding `TMPL_*` value
   *  isn't in the teal code it will throw an exception.
   *
   * @param tealTemplateCode The TEAL template code to substitute
   * @param params The deploy-time deployment control parameter value to replace
   * @returns The replaced TEAL code
   * @example
   * ```typescript
   * const tealCode = AppManager.replaceTealTemplateDeployTimeControlParams(tealTemplate, { updatable: true, deletable: false });
   * ```
   */
  static replaceTealTemplateDeployTimeControlParams(tealTemplateCode: string, params: { updatable?: boolean; deletable?: boolean }) {
    if (params.updatable !== undefined) {
      if (!tealTemplateCode.includes(UPDATABLE_TEMPLATE_NAME)) {
        throw new Error(
          `Deploy-time updatability control requested for app deployment, but ${UPDATABLE_TEMPLATE_NAME} not present in TEAL code`,
        )
      }
      tealTemplateCode = replaceTemplateVariable(tealTemplateCode, UPDATABLE_TEMPLATE_NAME, (params.updatable ? 1 : 0).toString())
    }

    if (params.deletable !== undefined) {
      if (!tealTemplateCode.includes(DELETABLE_TEMPLATE_NAME)) {
        throw new Error(
          `Deploy-time deletability control requested for app deployment, but ${DELETABLE_TEMPLATE_NAME} not present in TEAL code`,
        )
      }
      tealTemplateCode = replaceTemplateVariable(tealTemplateCode, DELETABLE_TEMPLATE_NAME, (params.deletable ? 1 : 0).toString())
    }

    return tealTemplateCode
  }

  /**
   * Performs template substitution of a teal file.
   *
   * Looks for `TMPL_{parameter}` for template replacements.
   *
   * @param tealTemplateCode The TEAL template code to make parameter replacements in
   * @param templateParams Any parameters to replace in the teal code
   * @returns The TEAL code with replacements
   * @example
   * ```typescript
   * const tealCode = AppManager.replaceTealTemplateParams(tealTemplate, { TMPL_APP_ID: 12345n });
   * ```
   */
  static replaceTealTemplateParams(tealTemplateCode: string, templateParams?: TealTemplateParams) {
    if (templateParams !== undefined) {
      for (const key in templateParams) {
        const value = templateParams[key]
        const token = `TMPL_${key.replace(/^TMPL_/, '')}`

        // If this is a number, first replace any byte representations of the number
        // These may appear in the TEAL in order to circumvent int compression and preserve PC values
        if (typeof value === 'number' || typeof value === 'bigint') {
          tealTemplateCode = tealTemplateCode.replace(new RegExp(`(?<=bytes )${token}`, 'g'), `0x${value.toString(16).padStart(16, '0')}`)

          // We could probably return here since mixing pushint and pushbytes is likely not going to happen, but might as well do both
        }

        tealTemplateCode = replaceTemplateVariable(
          tealTemplateCode,
          token,
          typeof value === 'string'
            ? `0x${Buffer.from(value, 'utf-8').toString('hex')}`
            : ArrayBuffer.isView(value)
              ? `0x${Buffer.from(value).toString('hex')}`
              : value.toString(),
        )
      }
    }

    return tealTemplateCode
  }

  /**
   * Remove comments from TEAL code (useful to reduce code size before compilation).
   *
   * @param tealCode The TEAL logic to strip
   * @returns The TEAL without comments
   * @example
   * ```typescript
   * const stripped = AppManager.stripTealComments(tealProgram);
   * ```
   */
  static stripTealComments(tealCode: string) {
    const stripCommentFromLine = (line: string) => {
      const commentIndex = findUnquotedString(line, '//')
      if (commentIndex === undefined) {
        return line
      }
      return line.slice(0, commentIndex).trimEnd()
    }

    return tealCode
      .split('\n')
      .map((line) => stripCommentFromLine(line))
      .join('\n')
  }
}

/**
 * Returns an `algosdk.TransactionResourceReference` given a `AccessReference`.
 */
export function getAccessReference(accessReference: AccessReference): ResourceReference {
  const result: ResourceReference = {}

  if (accessReference.address !== undefined) {
    result.address = accessReference.address.toString()
  }
  if (accessReference.appId !== undefined) {
    result.appId = accessReference.appId
  }
  if (accessReference.assetId !== undefined) {
    result.assetId = accessReference.assetId
  }
  if (accessReference.holding !== undefined) {
    result.holding = {
      address: accessReference.holding.account,
      assetId: accessReference.holding.asset,
    }
  }
  if (accessReference.locals !== undefined) {
    result.locals = {
      address: accessReference.locals.account,
      appId: accessReference.locals.app,
    }
  }
  if (accessReference.box !== undefined) {
    result.box = AppManager.getBoxReference(accessReference.box)
  }

  return result
}

/**
 * Find the first string within a line of TEAL. Only matches outside of quotes and base64 are returned.
 * Returns undefined if not found
 */
const findUnquotedString = (line: string, token: string, startIndex: number = 0, _endIndex?: number): number | undefined => {
  const endIndex = _endIndex === undefined ? line.length : _endIndex
  let index = startIndex
  let inQuotes = false
  let inBase64 = false

  while (index < endIndex) {
    const currentChar = line[index]
    if ((currentChar === ' ' || currentChar === '(') && !inQuotes && lastTokenBase64(line, index)) {
      // enter base64
      inBase64 = true
    } else if ((currentChar === ' ' || currentChar === ')') && !inQuotes && inBase64) {
      // exit base64
      inBase64 = false
    } else if (currentChar === '\\' && inQuotes) {
      // escaped char, skip next character
      index += 1
    } else if (currentChar === '"') {
      // quote boundary
      inQuotes = !inQuotes
    } else if (!inQuotes && !inBase64 && line.startsWith(token, index)) {
      // can test for match
      return index
    }
    index += 1
  }
  return undefined
}

const lastTokenBase64 = (line: string, index: number): boolean => {
  try {
    const tokens = line.slice(0, index).split(/\s+/)
    const last = tokens[tokens.length - 1]
    return ['base64', 'b64'].includes(last)
  } catch {
    return false
  }
}

function replaceTemplateVariable(program: string, token: string, replacement: string): string {
  const result: string[] = []
  const tokenIndexOffset = replacement.length - token.length

  const programLines = program.split('\n')

  for (const line of programLines) {
    const _commentIndex = findUnquotedString(line, '//')
    const commentIndex = _commentIndex === undefined ? line.length : _commentIndex
    let code = line.substring(0, commentIndex)
    const comment = line.substring(commentIndex)
    let trailingIndex = 0

    while (true) {
      const tokenIndex = findTemplateToken(code, token, trailingIndex)
      if (tokenIndex === undefined) {
        break
      }
      trailingIndex = tokenIndex + token.length
      const prefix = code.substring(0, tokenIndex)
      const suffix = code.substring(trailingIndex)
      code = `${prefix}${replacement}${suffix}`
      trailingIndex += tokenIndexOffset
    }
    result.push(code + comment)
  }

  return result.join('\n')
}

const findTemplateToken = (line: string, token: string, startIndex: number = 0, _endIndex?: number): number | undefined => {
  const endIndex = _endIndex === undefined ? line.length : _endIndex

  let index = startIndex
  while (index < endIndex) {
    const tokenIndex = findUnquotedString(line, token, index, endIndex)
    if (tokenIndex === undefined) {
      break
    }
    const trailingIndex = tokenIndex + token.length
    if (
      (tokenIndex === 0 || !isValidTokenCharacter(line[tokenIndex - 1])) &&
      (trailingIndex >= line.length || !isValidTokenCharacter(line[trailingIndex]))
    ) {
      return tokenIndex
    }
    index = trailingIndex
  }
  return undefined
}

function isValidTokenCharacter(char: string): boolean {
  return char.length === 1 && (/\w/.test(char) || char === '_')
}
