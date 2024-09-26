/**
 * An asynchronous event listener
 */

import algosdk from 'algosdk'
import { CompiledTeal } from './app'

// change event listener https://github.com/algorandfoundation/algokit-subscriber-ts/blob/main/src/subscriber.ts#L259

export const ALGOKIT_DIR = '.algokit'
export const SOURCES_DIR = 'sources'
export const TEAL_FILE_EXT = '.teal'
export const TEAL_SOURCEMAP_EXT = '.teal.tok.map'
export const DEFAULT_MAX_SEARCH_DEPTH = 10

/**
 * Class representing a debugger source maps input for persistence.
 *
 * Note: rawTeal and compiledTeal are mutually exclusive. Only one of them should be provided.
 */
export interface TealSourceDebugEventData {
  appName: string
  fileName: string
  compiledTeal?: CompiledTeal
}

/**
 * Parameters to a call that persists source maps
 * */
export interface TealSourcesDebugEventData {
  /** An array of PersistSourceMapInput objects. Each object can either contain rawTeal, in which case the function will execute a compile to obtain byte code, or it can accept an object of type CompiledTeal provided by algokit, which is used for source codes that have already been compiled and contain the traces. */
  sources: TealSourceDebugEventData[]
}

/**
 * Parameters to a call that simulates a transaction and persists the response.
 */
export interface AVMTracesEventData {
  /** algod An Algodv2 client to perform the simulation. */
  simulateResponse: algosdk.modelsv2.SimulateResponse
}
