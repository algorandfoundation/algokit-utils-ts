import algosdk from 'algosdk'
import * as crypto from 'crypto'
import { AVMDebuggerSourceMapEntry, CompiledTeal, PersistSourceMapsParams } from '../types/debugging'
import { isNode } from '../utils'

const ALGOKIT_DIR = '.algokit'
const SOURCES_DIR = 'sources'
const TEAL_FILE_EXT = '.teal'
const TEAL_SOURCEMAP_EXT = '.teal.tok.map'

// === Internal methods ===

async function compileTeal(algod: algosdk.Algodv2, tealCode: string): Promise<CompiledTeal> {
  const compiled = await algod.compile(tealCode).sourcemap(true).do()
  const result = {
    teal: tealCode,
    compiled: compiled.result,
    compiledHash: compiled.hash,
    compiledBase64ToBytes: new Uint8Array(Buffer.from(compiled.result, 'base64')),
    sourceMap: new algosdk.SourceMap(compiled['sourcemap']),
  }
  return result
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
  const result = rawTeal ? await compileTeal(client, rawTeal) : compiledTeal!
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
export async function persistSourceMaps({ sources, projectRoot, client, withSources }: PersistSourceMapsParams): Promise<void> {
  if (!isNode()) {
    throw new Error('Sourcemaps can only be persisted in Node.js environment.')
  }

  try {
    await Promise.all(
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
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    // Config.getLogger().error(`Failed to persist avm sourceMaps: ${err.stack ?? err.message ?? err}.`)
    throw err
  }
}
