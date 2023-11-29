import algosdk from 'algosdk'
import * as fs from 'fs'
import * as path from 'path'
import { Config } from '.'
import { performAtomicTransactionComposerSimulate } from './transaction'
import {
  AVMDebuggerSourceMap,
  DEBUG_TRACES_DIR,
  PersistSourceMapInput,
  TRACES_FILE_EXT,
  buildAVMSourcemap,
  isNode,
  upsertDebugSourcemaps,
} from './types/debug-utils'

/**
 * This function persists the source maps for the given sources.
 *
 * @param sources An array of objects, each containing the teal content, app name, and file name.
 * @param projectRoot The root directory of the project.
 * @param client An Algod client to perform the compilation.
 * @param withSources A boolean indicating whether to include the source files in the output.
 *
 * @returns A promise that resolves when the source maps have been persisted.
 */
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
  if (!isNode()) {
    throw new Error('Sourcemaps can only be persisted in Node.js environment.')
  }

  try {
    const sourceMaps = await Promise.all(
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

    await upsertDebugSourcemaps(sourceMaps, projectRoot)
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    Config.getLogger().error(`Failed to persist avm sourceMaps: ${err.stack ?? err.message ?? err}.`)
  }
}

/**
 * This function simulates the atomic transactions using the provided `AtomicTransactionComposer` object and `Algodv2` object,
 * and persists the simulation response to an AVM Debugger compliant JSON file.
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
  if (!isNode()) {
    throw new Error('Sourcemaps can only be persisted in Node.js environment.')
  }

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

    await fs.promises.writeFile(outputFilePath, JSON.stringify(simulateResult, null, 2))
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    Config.getLogger().error(`Failed to simulate and persist avm traces: ${err.stack ?? err.message ?? err}.`)
  }
}

export { AVMDebuggerSourceMap, PersistSourceMapInput, persistSourcemaps, simulateAndPersistResponse }
