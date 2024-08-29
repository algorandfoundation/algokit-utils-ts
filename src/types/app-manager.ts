import algosdk from 'algosdk'
import { TransactionSignerAccount } from './account'
import { CompiledTeal } from './app'

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
}
