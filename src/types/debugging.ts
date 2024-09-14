import algosdk from 'algosdk'
import { CompiledTeal } from './app'

/**
 * @deprecated Use latest version of `AlgoKit AVM Debugger` VSCode extension instead. It will automatically manage your sourcemaps.
 *
 * Class representing a debugger source maps input for persistence.
 *
 * Note: rawTeal and compiledTeal are mutually exclusive. Only one of them should be provided.
 */
export class PersistSourceMapInput {
  appName: string
  compiledTeal?: CompiledTeal
  private _fileName: string
  private _rawTeal?: string

  private constructor(appName: string, fileName: string, rawTeal?: string, compiledTeal?: CompiledTeal) {
    this.compiledTeal = compiledTeal
    this.appName = appName
    this._rawTeal = rawTeal
    this._fileName = this.stripTealExtension(fileName)
  }

  /**
   * Returns debugger source maps input from raw TEAL code.
   * @param rawTeal The raw TEAL code
   * @param appName The name of the app
   * @param fileName The name of the file to persist to
   * @returns The persist source map input
   */
  public static fromRawTeal(rawTeal: string, appName: string, fileName: string): PersistSourceMapInput {
    return new PersistSourceMapInput(appName, fileName, rawTeal)
  }

  /**
   * Returns debugger source maps input from compiled TEAL code.
   * @param compiledTeal The compiled TEAL code
   * @param appName The name of the app
   * @param fileName The name of the file to persist to
   * @returns The persist source map input
   */
  public static fromCompiledTeal(compiledTeal: CompiledTeal, appName: string, fileName: string): PersistSourceMapInput {
    return new PersistSourceMapInput(appName, fileName, undefined, compiledTeal)
  }

  /** Get the underlying raw teal */
  public get rawTeal(): string {
    if (this._rawTeal) {
      return this._rawTeal
    } else if (this.compiledTeal) {
      return this.compiledTeal.teal
    } else {
      throw new Error('No teal content found')
    }
  }

  /** Get the file name */
  public get fileName(): string {
    return this._fileName
  }

  /**
   * Strips the '.teal' extension from a filename, if present.
   *
   * @param fileName - The filename to strip the extension from.
   * @returns The filename without the '.teal' extension.
   */
  private stripTealExtension(fileName: string): string {
    if (fileName.endsWith('.teal')) {
      return fileName.slice(0, -5)
    }
    return fileName
  }
}

/**
 * @deprecated Use latest version of `AlgoKit AVM Debugger` VSCode extension instead. It will automatically manage your sourcemaps.
 *
 * Parameters to a call that persists source maps
 */
export interface PersistSourceMapsParams {
  /** An array of PersistSourceMapInput objects. Each object can either contain rawTeal, in which case the function will execute a compile to obtain byte code, or it can accept an object of type CompiledTeal provided by algokit, which is used for source codes that have already been compiled and contain the traces. */
  sources: PersistSourceMapInput[]
  /** The root directory of the project. */
  projectRoot: string
  /** An Algodv2 client to perform the compilation. */
  client: algosdk.Algodv2
  /** A boolean indicating whether to include the source files in the output. */
  withSources?: boolean
}

export type DebugHandler = (params: DebugParams) => Promise<void> | void

export interface DebugParams {
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}
