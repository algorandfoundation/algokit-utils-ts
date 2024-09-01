import algosdk from 'algosdk'
import { TransactionSignerAccount } from './account'
import type { ABIReturn, AppState, BoxName, CompiledTeal } from './app'
import modelsv2 = algosdk.modelsv2

export type { ABIReturn, AppState, BoxName, CompiledTeal } from './app'

/** Information about an app. */
export interface AppInformation {
  /** The ID of the app. */
  appId: bigint
  /** The escrow address that the app operates with. */
  appAddress: string
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
  creator: string
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

/** Allows management of application information. */
export class AppManager {
  private _algod: algosdk.Algodv2

  constructor(algod: algosdk.Algodv2) {
    this._algod = algod
  }

  private _compilationResults: Record<string, CompiledTeal> = {}

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
   */
  async compileTeal(tealCode: string): Promise<CompiledTeal> {
    if (this._compilationResults[tealCode]) {
      return this._compilationResults[tealCode]
    }

    const compiled = await this._algod.compile(tealCode).sourcemap(true).do()
    const result = {
      teal: tealCode,
      compiled: compiled.result,
      compiledHash: compiled.hash,
      compiledBase64ToBytes: new Uint8Array(Buffer.from(compiled.result, 'base64')),
      sourceMap: new algosdk.SourceMap(compiled['sourcemap']),
    }
    this._compilationResults[tealCode] = result
    return result
  }

  /**
   * Returns a previous compilation result.
   * @param tealCode The TEAL code
   * @returns The information about the previously compiled file
   *  or `undefined` if that TEAL code wasn't previously compiled
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
    const app = modelsv2.Application.from_obj_for_encoding(await this._algod.getApplicationByID(Number(appId)).do())
    return {
      appId: BigInt(app.id),
      appAddress: algosdk.getApplicationAddress(app.id),
      approvalProgram: app.params.approvalProgram,
      clearStateProgram: app.params.clearStateProgram,
      creator: app.params.creator,
      localInts: Number(app.params.localStateSchema?.numUint ?? 0),
      localByteSlices: Number(app.params.localStateSchema?.numByteSlice ?? 0),
      globalInts: Number(app.params.globalStateSchema?.numUint ?? 0),
      globalByteSlices: Number(app.params.globalStateSchema?.numByteSlice ?? 0),
      extraProgramPages: Number(app.params.extraProgramPages ?? 0),
      globalState: AppManager.decodeAppState(app.params.globalState ?? []),
    }
  }

  /**
   * Returns the current local state values for the given app ID and account address
   *
   * @param appId The ID of the app to return local state for
   * @param address The string address of the account to get local state for the given app
   * @returns The current local state for the given (app, account) combination
   */
  public async getLocalState(appId: bigint, address: string) {
    const appInfo = modelsv2.AccountApplicationResponse.from_obj_for_encoding(
      await this._algod.accountApplicationInformation(address, Number(appId)).do(),
    )

    if (!appInfo.appLocalState?.keyValue) {
      throw new Error("Couldn't find local state")
    }

    return AppManager.decodeAppState(appInfo.appLocalState.keyValue)
  }

  /**
   * Returns the names of the current boxes for the given app.
   * @param appId The ID of the app return box names for
   * @returns The current box names
   */
  public async getBoxNames(appId: bigint): Promise<BoxName[]> {
    const boxResult = await this._algod.getApplicationBoxes(Number(appId)).do()
    return boxResult.boxes.map((b) => {
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
   */
  public async getBoxValue(appId: bigint, boxName: BoxIdentifier): Promise<Uint8Array> {
    const name = AppManager.getBoxReference(boxName).name
    const boxResult = await this._algod.getApplicationBoxByName(Number(appId), name).do()
    return boxResult.value
  }

  /**
   * Returns the value of the given box names for the given app.
   * @param appId The ID of the app return box names for
   * @param boxNames The names of the boxes to return either as a string, binary array or `BoxName`
   * @returns The current box values as a byte array in the same order as the passed in box names
   */
  public async getBoxValues(appId: bigint, boxNames: BoxIdentifier[]): Promise<Uint8Array[]> {
    return await Promise.all(boxNames.map(async (boxName) => await this.getBoxValue(appId, boxName)))
  }

  /**
   * Returns the value of the given box name for the given app decoded based on the given ABI type.
   * @param request The parameters for the box value request
   * @returns The current box value as an ABI value
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
   */
  public async getBoxValuesFromABIType(request: BoxValuesRequestParams): Promise<algosdk.ABIValue[]> {
    const { appId, boxNames, type } = request
    return await Promise.all(boxNames.map(async (boxName) => await this.getBoxValueFromABIType({ appId, boxName, type })))
  }

  /**
   * Returns a `algosdk.BoxReference` given a `BoxIdentifier` or `BoxReference`.
   * @param boxId The box to return a reference for
   * @returns The box reference ready to pass into a `algosdk.Transaction`
   */
  public static getBoxReference(boxId: BoxIdentifier | BoxReference): algosdk.BoxReference {
    const ref = typeof boxId === 'object' && 'appId' in boxId ? boxId : { appId: 0n, name: boxId }
    return {
      appIndex: Number(ref.appId),
      name:
        typeof ref.name === 'string'
          ? new TextEncoder().encode(ref.name)
          : 'length' in ref.name
            ? ref.name
            : algosdk.decodeAddress(ref.name.addr).publicKey,
    } as algosdk.BoxReference
  }

  /**
   * Converts an array of global/local state values from the algod api to a more friendly
   * generic object keyed by the UTF-8 value of the key.
   * @param state A `global-state`, `local-state`, `global-state-deltas` or `local-state-deltas`
   * @returns An object keyeed by the UTF-8 representation of the key with various parsings of the values
   */
  public static decodeAppState(state: { key: string; value: modelsv2.TealValue | modelsv2.EvalDelta }[]): AppState {
    const stateValues = {} as AppState

    // Start with empty set
    for (const stateVal of state) {
      const keyBase64 = stateVal.key
      const keyRaw = Buffer.from(keyBase64, 'base64')
      const key = keyRaw.toString('utf-8')
      const tealValue = stateVal.value

      const dataTypeFlag = 'action' in tealValue ? tealValue.action : tealValue.type
      let valueBase64: string
      let valueRaw: Buffer
      switch (dataTypeFlag) {
        case 1:
          valueBase64 = tealValue.bytes ?? ''
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
            value,
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
   */
  public static getABIReturn(
    confirmation: modelsv2.PendingTransactionResponse | undefined,
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
    const response = algosdk.AtomicTransactionComposer.parseMethodResponse(method, resultDummy, confirmation)
    return !response.decodeError
      ? {
          rawReturnValue: response.rawReturnValue,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          returnValue: response.returnValue!,
          decodeError: undefined,
        }
      : {
          rawReturnValue: undefined,
          returnValue: undefined,
          decodeError: response.decodeError,
        }
  }
}
