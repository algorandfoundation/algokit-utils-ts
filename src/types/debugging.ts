/**
 * An asynchronous event listener
 */

import algosdk from 'algosdk'
import { CompiledTeal } from './app'

/** The directory name for AlgoKit project related files */
export const ALGOKIT_DIR = '.algokit'

/** The directory name for debug source files */
export const SOURCES_DIR = 'sources'

/** The file extension for TEAL files */
export const TEAL_FILE_EXT = '.teal'

/** The file extension for TEAL source map files */
export const TEAL_SOURCEMAP_EXT = '.teal.map'

/** The default maximum search depth for file operations */
export const DEFAULT_MAX_SEARCH_DEPTH = 10

/**
 * Represents the data for a single TEAL source
 */
export interface TealSourceDebugEventData {
  /** The name of the application */
  appName: string
  /** The name of the file */
  fileName: string
  /** The compiled TEAL code */
  compiledTeal: CompiledTeal
}

/**
 * Represents the data for multiple TEAL sources debug events emitted whenever an app is compiled as part of a deploy in debug mode
 */
export interface TealSourcesDebugEventData {
  /** An array of TEAL source debug event data */
  sources: TealSourceDebugEventData[]
}

/**
 * Represents the data for AVM traces debug events emitted whenever a transaction is simulated in debug mode
 */
export interface AVMTracesEventData {
  /** The simulation response from Algod */
  simulateResponse: algosdk.modelsv2.SimulateResponse
}
