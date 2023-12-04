import algosdk from 'algosdk'
import { CompiledTeal } from './app'

export interface AVMDebuggerSourceMapDict {
  'txn-group-sources': Array<{
    'sourcemap-location': string
    hash: string
  }>
}

export class AVMDebuggerSourceMapEntry {
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

export class AVMDebuggerSourceMap {
  txnGroupSources: AVMDebuggerSourceMapEntry[]

  constructor(txnGroupSources: AVMDebuggerSourceMapEntry[]) {
    this.txnGroupSources = txnGroupSources
  }

  static fromDict(data: AVMDebuggerSourceMapDict): AVMDebuggerSourceMap {
    return new AVMDebuggerSourceMap(
      data['txn-group-sources'].map((item) => new AVMDebuggerSourceMapEntry(item['sourcemap-location'], item['hash'])),
    )
  }

  toDict(): AVMDebuggerSourceMapDict {
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

  static fromRawTeal(rawTeal: string, appName: string, fileName: string): PersistSourceMapInput {
    return new PersistSourceMapInput(appName, fileName, rawTeal)
  }

  static fromCompiledTeal(compiledTeal: CompiledTeal, appName: string, fileName: string): PersistSourceMapInput {
    return new PersistSourceMapInput(appName, fileName, undefined, compiledTeal)
  }

  get rawTeal(): string {
    if (this._rawTeal) {
      return this._rawTeal
    } else if (this.compiledTeal) {
      return this.compiledTeal.teal
    } else {
      throw new Error('No teal content found')
    }
  }

  get fileName(): string {
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

export interface PersistSourceMapsParams {
  sources: PersistSourceMapInput[]
  projectRoot: string
  client: algosdk.Algodv2
  withSources?: boolean
}

export interface SimulateAndPersistResponseParams {
  atc: algosdk.AtomicTransactionComposer
  projectRoot: string
  algod: algosdk.Algodv2
  bufferSizeMb: number
}
