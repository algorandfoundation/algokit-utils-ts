import algosdk from 'algosdk'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

export const ALGOKIT_DIR = '.algokit'
export const SOURCES_DIR = 'sources'
export const SOURCES_FILE = 'sources.avm.json'
export const TRACES_FILE_EXT = '.trace.avm.json'
export const DEBUG_TRACES_DIR = 'debug_traces'
export const TEAL_FILE_EXT = '.teal'
export const TEAL_SOURCEMAP_EXT = '.teal.tok.map'

export interface ErrnoException extends Error {
  errno?: number
  code?: string
  path?: string
  syscall?: string
}

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

export async function loadOrCreateSources(sourcesPath: string): Promise<AVMDebuggerSourceMap> {
  try {
    const data = JSON.parse(await fs.promises.readFile(sourcesPath, 'utf8'))
    return AVMDebuggerSourceMap.fromDict(data)
  } catch (error: unknown) {
    const err = error as ErrnoException

    if (err.code === 'ENOENT') {
      return new AVMDebuggerSourceMap([])
    } else {
      throw error
    }
  }
}

export async function upsertDebugSourcemaps(sourceMaps: AVMDebuggerSourceMapEntry[], projectRoot: string): Promise<void> {
  const sourcesPath = path.join(projectRoot, ALGOKIT_DIR, SOURCES_DIR, SOURCES_FILE)
  const sources = await loadOrCreateSources(sourcesPath)

  for (const sourcemap of sourceMaps) {
    const sourceFilePath = path.resolve(sourcemap.location)
    try {
      await fs.promises.access(sourceFilePath)
      const index = sources.txnGroupSources.findIndex((item) => item.equals(sourcemap))
      if (index === -1) {
        sources.txnGroupSources.push(sourcemap)
      } else {
        sources.txnGroupSources[index] = sourcemap
      }
    } catch (error: unknown) {
      const err = error as ErrnoException

      if (err.code === 'ENOENT') {
        const index = sources.txnGroupSources.findIndex((item) => item.equals(sourcemap))
        if (index !== -1) {
          sources.txnGroupSources.splice(index, 1)
        }
      } else {
        throw error
      }
    }
  }

  await fs.promises.writeFile(sourcesPath, JSON.stringify(sources.toDict()), 'utf8')
}

export async function writeToFile(filePath: string, content: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  await fs.promises.writeFile(filePath, content, 'utf8')
}

export async function buildAVMSourcemap({
  tealContent,
  appName,
  fileName,
  outputPath,
  client,
  withSources = true,
}: {
  tealContent: string
  appName: string
  fileName: string
  outputPath: string
  client: algosdk.Algodv2
  withSources?: boolean
}): Promise<AVMDebuggerSourceMapEntry> {
  const result = await client.compile(tealContent).sourcemap(true).do()
  const programHash = crypto.createHash('SHA-512/256').update(Buffer.from(result.result, 'base64')).digest('base64')
  const sourceMap = result.sourcemap
  sourceMap.sources = withSources ? [`${fileName}${TEAL_FILE_EXT}`] : []

  const outputDirPath = path.join(outputPath, ALGOKIT_DIR, SOURCES_DIR, appName)
  const sourceMapOutputPath = path.join(outputDirPath, `${fileName}${TEAL_SOURCEMAP_EXT}`)
  const tealOutputPath = path.join(outputDirPath, `${fileName}${TEAL_FILE_EXT}`)
  await writeToFile(sourceMapOutputPath, JSON.stringify(sourceMap))

  if (withSources) {
    await writeToFile(tealOutputPath, tealContent)
  }

  return new AVMDebuggerSourceMapEntry(sourceMapOutputPath, programHash)
}

// simple function checking whether this is running in node or browser environment
export function isNode(): boolean {
  return typeof window === 'undefined'
}
