import algosdk from 'algosdk'
import * as crypto from 'crypto'
import { Config, compileTeal } from '.'
import { performAtomicTransactionComposerSimulate } from './transaction'
import { CompiledTeal } from './types/app'
import {
  AVMDebuggerSourceMap,
  AVMDebuggerSourceMapEntry,
  PersistSourceMapsParams,
  SimulateAndPersistResponseParams,
} from './types/debugging'
import { isNode } from './util'

const ALGOKIT_DIR = '.algokit'
const SOURCES_DIR = 'sources'
const SOURCES_FILE = 'sources.avm.json'
const TRACES_FILE_EXT = '.trace.avm.json'
const DEBUG_TRACES_DIR = 'debug_traces'
const TEAL_FILE_EXT = '.teal'
const TEAL_SOURCEMAP_EXT = '.teal.tok.map'

interface ErrnoException extends Error {
  errno?: number
  code?: string
  path?: string
  syscall?: string
}

let fs: typeof import('fs')
let path: typeof import('path')

async function loadNodeModules() {
  if (typeof window !== 'undefined') {
    throw new Error('This module can only be used in Node.js environment.')
  }
  fs = await import('fs')
  path = await import('path')
}

// === Internal methods ===

async function loadOrCreateSources(sourcesPath: string): Promise<AVMDebuggerSourceMap> {
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

async function upsertDebugSourcemaps(sourceMaps: AVMDebuggerSourceMapEntry[], projectRoot: string): Promise<void> {
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

async function writeToFile(filePath: string, content: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  await fs.promises.writeFile(filePath, content, 'utf8')
}

async function buildAVMSourcemap({
  rawTeal,
  compiledTeal,
  appName,
  fileName,
  outputPath,
  client,
  withSources = true,
}: {
  rawTeal?: string
  compiledTeal?: CompiledTeal
  appName: string
  fileName: string
  outputPath: string
  client: algosdk.Algodv2
  withSources?: boolean
}): Promise<AVMDebuggerSourceMapEntry> {
  if (!rawTeal && !compiledTeal) {
    throw new Error('Either rawTeal or compiledTeal must be provided.')
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = rawTeal ? await compileTeal(rawTeal, client) : compiledTeal!
  const programHash = crypto.createHash('SHA-512/256').update(Buffer.from(result.compiled, 'base64')).digest('base64')
  const sourceMap = result.sourceMap
  sourceMap.sources = withSources ? [`${fileName}${TEAL_FILE_EXT}`] : []

  const outputDirPath = path.join(outputPath, ALGOKIT_DIR, SOURCES_DIR, appName)
  const sourceMapOutputPath = path.join(outputDirPath, `${fileName}${TEAL_SOURCEMAP_EXT}`)
  const tealOutputPath = path.join(outputDirPath, `${fileName}${TEAL_FILE_EXT}`)
  await writeToFile(sourceMapOutputPath, JSON.stringify(sourceMap))

  if (withSources && result) {
    await writeToFile(tealOutputPath, result.teal)
  }

  return new AVMDebuggerSourceMapEntry(sourceMapOutputPath, programHash)
}

// === Public facing methods ===

/**
 * This function persists the source maps for the given sources.
 *
 * @param sources An array of PersistSourceMapInput objects. Each object can either contain rawTeal, in which case the function will execute a compile to obtain byte code, or it can accept an object of type CompiledTeal provided by algokit, which is used for source codes that have already been compiled and contain the traces.
 * @param projectRoot The root directory of the project.
 * @param client An Algodv2 client to perform the compilation.
 * @param withSources A boolean indicating whether to include the source files in the output.
 *
 * @returns A promise that resolves when the source maps have been persisted.
 */
export async function persistSourceMaps({ sources, projectRoot, client, withSources }: PersistSourceMapsParams): Promise<void> {
  if (!isNode()) {
    throw new Error('Sourcemaps can only be persisted in Node.js environment.')
  } else {
    await loadNodeModules()
  }

  try {
    const sourceMaps = await Promise.all(
      sources.map((source) =>
        buildAVMSourcemap({
          rawTeal: source.rawTeal,
          compiledTeal: source.compiledTeal,
          appName: source.appName,
          fileName: source.fileName,
          outputPath: projectRoot,
          client: client,
          withSources: withSources,
        }),
      ),
    )

    await upsertDebugSourcemaps(sourceMaps, projectRoot)
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    Config.getLogger().error(`Failed to persist avm sourceMaps: ${err.stack ?? err.message ?? err}.`)
    throw err
  }
}

/**
 * This function simulates the atomic transactions using the provided `AtomicTransactionComposer` object and `Algodv2` object,
 * and persists the simulation response to an AlgoKit AVM Debugger compliant JSON file.
 *
 * @param atc The AtomicTransactionComposer with transaction(s) loaded.
 * @param algod An Algod client to perform the simulation.
 * @param projectRoot The root directory of the project.
 * @param bufferSizeMb The buffer size in megabytes.
 *
 * @returns The simulation result, which includes various details about how the transactions would be processed.
 *
 * @example
 * const atc = new AtomicTransactionComposer();
 * const algod = new algosdk.Algodv2(token, server, port);
 * const projectRoot = '/path/to/project';
 * const bufferSizeMb = 10;
 *
 * const result = await simulateAndPersistResponse({ atc, projectRoot, algod, bufferSizeMb });
 * console.log(result);
 */
export async function simulateAndPersistResponse({ atc, projectRoot, algod, bufferSizeMb }: SimulateAndPersistResponseParams) {
  if (!isNode()) {
    throw new Error('Sourcemaps can only be persisted in Node.js environment.')
  } else {
    await loadNodeModules()
  }

  try {
    const atcToSimulate = atc.clone()
    const simulateResult = await performAtomicTransactionComposerSimulate(atcToSimulate, algod)
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
    const outputRootDir = path.join(projectRoot, DEBUG_TRACES_DIR)
    const outputFileName = `${timestamp}_lr${simulateResult.lastRound}_${txnTypesStr}${TRACES_FILE_EXT}`
    const outputFilePath = path.join(outputRootDir, outputFileName)

    if (!fs.existsSync(path.dirname(outputFilePath))) {
      await fs.promises.mkdir(path.dirname(outputFilePath), { recursive: true })
    }

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

    await fs.promises.writeFile(outputFilePath, JSON.stringify(simulateResult.get_obj_for_encoding(), null, 2))

    return simulateResult
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    Config.getLogger().error(`Failed to simulate and persist avm traces: ${err.stack ?? err.message ?? err}.`)
    throw err
  }
}
