import algosdk from 'algosdk'

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

export class PersistSourceMapInput {
  teal: string
  appName: string
  private _fileName: string

  constructor(teal: string, appName: string, fileName: string) {
    this.teal = teal
    this.appName = appName
    this._fileName = this.stripTealExtension(fileName)
  }

  get fileName(): string {
    return this._fileName
  }

  set fileName(value: string) {
    this._fileName = this.stripTealExtension(value)
  }

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
