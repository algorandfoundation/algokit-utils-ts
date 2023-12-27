import { existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { Logger, consoleLogger, nullLogger } from './logging'

/** The AlgoKit configuration type */
export interface Config {
  /** Logger */
  logger: Logger
  /** Whether or not debug mode is enabled */
  debug: boolean
  /** The path to the project root directory */
  projectRoot: string | null
  /** Indicates whether to trace all operations */
  traceAll: boolean
  /** The size of the trace buffer in megabytes */
  traceBufferSizeMb: number
  /** The maximum depth to search for a specific file */
  maxSearchDepth: number
}

/** Updatable AlgoKit config */
export class UpdatableConfig implements Readonly<Config> {
  private config: Config

  get logger() {
    return this.config.logger
  }

  get debug() {
    return this.config.debug
  }

  get projectRoot() {
    return this.config.projectRoot
  }

  get traceAll() {
    return this.config.traceAll
  }

  get traceBufferSizeMb() {
    return this.config.traceBufferSizeMb
  }

  get maxSearchDepth() {
    return this.config.maxSearchDepth
  }

  /**
   * Returns the current logger, or the null logger if true is passed in to `returnNullLogger`
   * @param returnNullLogger Whether or not to return the null logger
   * @returns The requested logger
   */
  getLogger(returnNullLogger?: boolean) {
    if (returnNullLogger) {
      return nullLogger
    }

    return this.logger
  }

  /**
   * Temporarily run with debug set to true.
   * @param lambda A lambda expression with code to run with debug config set to true
   */
  withDebug(lambda: () => unknown) {
    const original = this.config.debug
    try {
      this.config.debug = true
      lambda()
    } finally {
      this.config.debug = original
    }
  }

  constructor() {
    this.config = {
      logger: consoleLogger,
      debug: false,
      projectRoot: null,
      traceAll: false,
      traceBufferSizeMb: 256,
      maxSearchDepth: 10,
    }
    this.configureProjectRoot()
  }

  /**
   * Configures the project root by searching for a specific file within a depth limit.
   * This is only supported in a Node environment.
   */
  private configureProjectRoot() {
    // fileURLToPath and dirname is only available in Node, hence the check
    const _dirname =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Unreachable code error
      // eslint-disable-next-line no-restricted-syntax
      typeof __dirname !== 'undefined' ? __dirname : fileURLToPath && dirname ? dirname(fileURLToPath(import.meta.url)) : undefined
    if (!_dirname) {
      return
    }

    let currentPath = resolve(_dirname)
    for (let i = 0; i < this.config.maxSearchDepth; i++) {
      if (existsSync(`${currentPath}/.algokit.toml`)) {
        this.config.projectRoot = currentPath
        break
      }
      currentPath = dirname(currentPath)
    }
  }

  /**
   * Update the AlgoKit configuration with your own configuration settings
   * @param newConfig Partial or complete config to replace
   */
  configure(newConfig: Partial<Config>) {
    this.config = { ...this.config, ...newConfig }
  }
}
