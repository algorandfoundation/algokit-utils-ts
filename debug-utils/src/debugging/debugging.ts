import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { ClientManager } from '@algorandfoundation/algokit-utils/types/client-manager'
import * as crypto from 'crypto'
import { AVMDebuggerSourceMapEntry, CompiledTeal, PersistSourceMapsParams } from '../types/debugging'
import { isNode } from '../utils'

const ALGOKIT_DIR = '.algokit'
const SOURCES_DIR = 'sources'
const TEAL_FILE_EXT = '.teal'
const TEAL_SOURCEMAP_EXT = '.teal.tok.map'

// === Internal methods ===

async function writeToFile(filePath: string, content: string): Promise<void> {
  const path = await import('path')
  const fs = await import('fs')

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  await fs.promises.writeFile(filePath, content, 'utf8')
}

async function buildAVMSourcemap({
  rawTeal,
  compiledTeal,
  appName,
  fileName,
  outputPath,
  algorandClient,
  withSources = true,
}: {
  rawTeal?: string
  compiledTeal?: CompiledTeal
  appName: string
  fileName: string
  outputPath: string
  algorandClient: AlgorandClient
  withSources?: boolean
}): Promise<AVMDebuggerSourceMapEntry> {
  if (!rawTeal && !compiledTeal) {
    throw new Error('Either rawTeal or compiledTeal must be provided.')
  }
  const path = await import('path')

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = rawTeal ? await algorandClient.app.compileTeal(rawTeal) : compiledTeal!
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
 *
 * This function persists the source maps for the given sources.
 *
 * @param param0 The parameters to define the persistence
 *
 * @returns A promise that resolves when the source maps have been persisted.
 */
export async function persistSourceMaps(params: PersistSourceMapsParams): Promise<void> {
  if (!isNode()) {
    throw new Error('Sourcemaps can only be persisted in a Node.js environment.')
  }

  const algorandClient = AlgorandClient.fromConfig({
    algodConfig: ClientManager.getDefaultLocalNetConfig('algod'),
  })

  try {
    const { sources, projectRoot, withSources } = params
    await Promise.all(
      sources.map((source) =>
        buildAVMSourcemap({
          // Update property access to match new format
          rawTeal: source.compiledTeal.teal,
          compiledTeal: source.compiledTeal,
          appName: source.appName,
          fileName: source.fileName,
          outputPath: projectRoot,
          algorandClient,
          withSources,
        }),
      ),
    )
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    throw err
  }
}
