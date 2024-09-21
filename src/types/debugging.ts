import { CompiledTeal } from './app'

/**
 * AVM debugger source map format.
 */
export interface AVMDebuggerSourceMapDict {
  'txn-group-sources': Array<{
    'sourcemap-location': string
    hash: string
  }>
}

/**
 * AVM debugger source map entry class.
 */
export class AVMDebuggerSourceMapEntry {
  /**
   * Create an AVM debugger source map entry.
   * @param location The location of the file the source map is for.
   * @param programHash The hash of the TEAL binary.
   */
  constructor(
    public location: string,
    public programHash: string,
  ) {}

  equals(other: AVMDebuggerSourceMapEntry): boolean {
    return this.location === other.location && this.programHash === other.programHash
  }

  toString(): string {
    return JSON.stringify({ 'sourcemap-location': this.location, hash: this.programHash })
  }
}

/**
 * AVM debugger source map class.
 */
export class AVMDebuggerSourceMap {
  txnGroupSources: AVMDebuggerSourceMapEntry[]

  /**
   *
   * @param txnGroupSources
   */
  constructor(txnGroupSources: AVMDebuggerSourceMapEntry[]) {
    this.txnGroupSources = txnGroupSources
  }

  /**
   * Creates a source map from a dictionary of source map data.
   * @param data The data
   * @returns The source map
   */
  public static fromDict(data: AVMDebuggerSourceMapDict): AVMDebuggerSourceMap {
    return new AVMDebuggerSourceMap(
      data['txn-group-sources'].map((item) => new AVMDebuggerSourceMapEntry(item['sourcemap-location'], item['hash'])),
    )
  }

  /**
   * Converts the source map to a dictionary that can be passed around and then parsed back using `AVMDebuggerSourceMap.fromDict`.
   * @returns The dictionary
   */
  public toDict(): AVMDebuggerSourceMapDict {
    return { 'txn-group-sources': this.txnGroupSources.map((item) => JSON.parse(item.toString())) }
  }
}

/**
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
