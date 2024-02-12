import algosdk from 'algosdk'
import * as crypto from 'crypto'
import { compileTeal } from '../app'
import { Config } from '../config'
import { CompiledTeal } from '../types/app'
import { AVMDebuggerSourceMap, AVMDebuggerSourceMapEntry, PersistSourceMapsParams } from '../types/debugging'
import { isNode } from '../util'

const ALGOKIT_DIR = '.algokit'
const SOURCES_DIR = 'sources'
const SOURCES_FILE = 'sources.avm.json'
const TEAL_FILE_EXT = '.teal'
const TEAL_SOURCEMAP_EXT = '.teal.tok.map'

interface ErrnoException extends Error {
  errno?: number
  code?: string
  path?: string
  syscall?: string
}

// === Internal methods ===

async function loadOrCreateSources(sourcesPath: string): Promise<AVMDebuggerSourceMap> {
  try {
    const fs = await import('fs')
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
  const path = await import('path')
  const fs = await import('fs')

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
  const path = await import('path')

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
 * @param param0 The parameters to define the persistence
 *
 * @returns A promise that resolves when the source maps have been persisted.
 */
export async function persistSourceMaps({ sources, projectRoot, client, withSources }: PersistSourceMapsParams): Promise<void> {
  if (!isNode()) {
    throw new Error('Sourcemaps can only be persisted in Node.js environment.')
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
