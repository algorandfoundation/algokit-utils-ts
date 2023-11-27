import algosdk from 'algosdk'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import { performAtomicTransactionComposerSimulate } from './transaction'

const algokitDir = '.algokit'
const sourcesDir = 'sources'
const sourcesFile = 'sources.avm.json'
const tracesFileExt = '.trace.avm.json'
const debugTracesDir = 'debug_traces'
const tealFileExt = '.teal'
const tealSourcemapExt = '.teal.tok.map'

interface AVMDebuggerSourceMapDict {
  'txn-group-sources': {
    'sourcemap-location': string
    hash: string
  }[]
}

class AVMDebuggerSourceMapEntry {
  location: string
  programHash: string

  constructor(location: string, programHash: string) {
    this.location = location
    this.programHash = programHash
  }

  equals(other: AVMDebuggerSourceMapEntry): boolean {
    return this.location === other.location && this.programHash === other.programHash
  }

  toString(): string {
    return JSON.stringify({ 'sourcemap-location': this.location, hash: this.programHash })
  }
}

class AVMDebuggerSourceMap {
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

class PersistSourceMapInput {
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
    return fileName.endsWith('.teal') ? fileName.replace('.teal', '') : fileName
  }
}

async function loadOrCreateSources(projectRoot: string): Promise<AVMDebuggerSourceMap> {
  const sourcesPath = path.join(projectRoot, algokitDir, sourcesDir, sourcesFile)
  try {
    const data = JSON.parse(await fs.promises.readFile(sourcesPath, 'utf8'))
    return AVMDebuggerSourceMap.fromDict(data)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return new AVMDebuggerSourceMap([])
    } else {
      throw error
    }
  }
}

async function upsertDebugSourcemaps(sourcemaps: AVMDebuggerSourceMapEntry[], projectRoot: string): Promise<void> {
  const sourcesPath = path.join(projectRoot, algokitDir, sourcesDir, sourcesFile)
  const sources = await loadOrCreateSources(sourcesPath)

  for (const sourcemap of sourcemaps) {
    const sourceFilePath = path.resolve(sourcemap.location)
    try {
      await fs.promises.access(sourceFilePath)
      const index = sources.txnGroupSources.findIndex((item) => item.equals(sourcemap))
      if (index === -1) {
        sources.txnGroupSources.push(sourcemap)
      } else {
        sources.txnGroupSources[index] = sourcemap
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
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

async function writeToFile(filePath: string, content: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  await fs.promises.writeFile(filePath, content, 'utf8')
}

async function buildAVMSourcemap({
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
  sourceMap.sources = withSources ? [`${fileName}${tealFileExt}`] : []

  const outputDirPath = path.join(outputPath, algokitDir, sourcesDir, appName)
  const sourceMapOutputPath = path.join(outputDirPath, `${fileName}${tealSourcemapExt}`)
  const tealOutputPath = path.join(outputDirPath, `${fileName}${tealFileExt}`)
  await writeToFile(sourceMapOutputPath, JSON.stringify(sourceMap))

  if (withSources) {
    await writeToFile(tealOutputPath, tealContent)
  }

  return new AVMDebuggerSourceMapEntry(sourceMapOutputPath, programHash)
}

async function persistSourcemaps({
  sources,
  projectRoot,
  client,
  withSources,
}: {
  sources: PersistSourceMapInput[]
  projectRoot: string
  client: algosdk.Algodv2
  withSources?: boolean
}): Promise<void> {
  const sourcemaps = await Promise.all(
    sources.map((source) =>
      buildAVMSourcemap({
        tealContent: source.teal,
        appName: source.appName,
        fileName: source.fileName,
        outputPath: projectRoot,
        client: client,
        withSources: withSources,
      }),
    ),
  )

  await upsertDebugSourcemaps(sourcemaps, projectRoot)
}

/**
 * Simulates the atomic transactions using the provided `AtomicTransactionComposer` object and `Algodv2` object,
 * and persists the simulation response to an AVM Debugger compliant JSON file.
 *
 * @param atc The AtomicTransactionComposer with transaction(s) loaded.
 * @param algod An Algod client to perform the simulation.
 * @returns The simulation result, which includes various details about how the transactions would be processed.
 */
async function simulateAndPersistResponse({
  atc,
  projectRoot,
  algod,
  bufferSizeMb,
}: {
  atc: algosdk.AtomicTransactionComposer
  projectRoot: string
  algod: algosdk.Algodv2
  bufferSizeMb: number
}) {
  try {
    const simulateResult = await performAtomicTransactionComposerSimulate(atc, algod)
    const txnGroups = simulateResult.txnGroups

    const txnTypesCount = txnGroups.reduce((acc: Record<string, number>, txnGroup) => {
      const txnType = txnGroup.txnResults[0].txnResult.txn.txn.type
      acc[txnType] = (acc[txnType] || 0) + 1
      return acc
    }, {})

    const txnTypesStr = Object.entries(txnTypesCount)
      .map(([type, count]) => `${count}#${type}`)
      .join('_')

    const timestamp = new Date().toISOString().replace(/[:.]/g, '')
    const outputRootDir = path.join(projectRoot, debugTracesDir)
    const outputFileName = `${timestamp}_lr${simulateResult.lastRound}_${txnTypesStr}${tracesFileExt}`
    const outputFilePath = path.join(outputRootDir, outputFileName)

    await fs.promises.writeFile(outputFilePath, JSON.stringify(simulateResult, null, 2))

    // cleanup old files if buffer size is exceeded
    let totalSize = (
      await Promise.all(
        (await fs.promises.readdir(outputRootDir)).map(async (file) => (await fs.promises.stat(path.join(outputRootDir, file))).size),
      )
    ).reduce((a, b) => a + b, 0)

    if (totalSize > bufferSizeMb * 1024 * 1024) {
      const sortedFiles = (await fs.promises.readdir(outputRootDir)).map(async (file) => {
        const stats = await fs.promises.stat(path.join(outputRootDir, file))
        return { file, mtime: stats.mtime }
      })

      // Since map returns an array of promises, we need to await all of them
      const resolvedFiles = await Promise.all(sortedFiles)

      resolvedFiles.sort((a, b) => a.mtime.getTime() - b.mtime.getTime())

      while (totalSize > bufferSizeMb * 1024 * 1024) {
        const oldestFilePromise = sortedFiles.shift()
        if (oldestFilePromise) {
          const oldestFile = await oldestFilePromise
          const stats = await fs.promises.stat(path.join(outputRootDir, oldestFile.file))
          totalSize -= stats.size
          await fs.promises.unlink(path.join(outputRootDir, oldestFile.file))
        }
      }
    }

    await fs.promises.writeFile(outputFilePath, JSON.stringify(simulateResult, null, 2))
  } catch (error) {
    console.error('Error in simulateAndPersistResponse:', error)
    // Handle error appropriately
  }
}

export { AVMDebuggerSourceMap, PersistSourceMapInput, persistSourcemaps, simulateAndPersistResponse }
