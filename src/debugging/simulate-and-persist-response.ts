import { Config } from '../config'
import { performAtomicTransactionComposerSimulate } from '../transaction/perform-atomic-transaction-composer-simulate'
import { SimulateAndPersistResponseParams } from '../types/debugging'
import { isNode } from '../util'

const TRACES_FILE_EXT = '.trace.avm.json'
const DEBUG_TRACES_DIR = 'debug_traces'

interface ErrnoException extends Error {
  errno?: number
  code?: string
  path?: string
  syscall?: string
}

/**
 * This function simulates the atomic transactions using the provided `AtomicTransactionComposer` object and `Algodv2` object,
 * and persists the simulation response to an AlgoKit AVM Debugger compliant JSON file.
 *
 * @param param0 The parameters to control the simulation and persistence.
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
  }

  const fs = await import('fs')
  const path = await import('path')

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

    try {
      await fs.promises.access(path.dirname(outputFilePath))
    } catch (error: unknown) {
      const err = error as ErrnoException

      if (err.code === 'ENOENT') {
        await fs.promises.mkdir(path.dirname(outputFilePath), { recursive: true })
      } else {
        throw err
      }
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
