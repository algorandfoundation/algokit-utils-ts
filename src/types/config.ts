import { isNode } from '../util'
import { DebugHandler, DebugParams } from './debugging'
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
  /**
   * **WARNING**: This is not production-ready due incompatability with rekeyed
   * accounts and simulate. This will eventually be enabled by default once
   * [this issue](https://github.com/algorand/go-algorand/issues/5914) is closed.
   *
   * Whether to enable populateAppCallResources in sendParams by default.
   * Default value is false.
   */
  populateAppCallResources: boolean
}

/** Updatable AlgoKit config */
export class UpdatableConfig implements Readonly<Config> {
  private config: Config
  private debugHandlers: DebugHandler[] = []

  get populateAppCallResources() {
    return this.config.populateAppCallResources
  }

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
   * Register a debug handler function.
   * @param handler A function that handles debug events.
   */
  registerDebugHandler(handler: DebugHandler): void {
    this.debugHandlers.push(handler)
  }

  /**
   * Invoke all registered debug handlers with the given parameters.
   * @param params Debug parameters containing a message and optional data.
   */
  async invokeDebugHandlers(params: DebugParams): Promise<void> {
    for (const handler of this.debugHandlers) {
      try {
        await handler(params)
      } catch (error) {
        this.config.logger.error('Debug handler error:', error)
      }
    }
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
      populateAppCallResources: false,
    }

    if (isNode()) {
      this.configureProjectRoot()
    }
  }

  /**
   * Configures the project root by searching for a specific file within a depth limit.
   * This is only supported in a Node environment.
   */
  private async configureProjectRoot() {
    if (!isNode()) {
      throw new Error('`configureProjectRoot` can only be called in Node.js environment.')
    }

    const fs = await import('fs')
    const path = await import('path')
    const _dirname = __dirname

    if (!_dirname) {
      return
    }

    let currentPath = path.resolve(_dirname)
    for (let i = 0; i < this.config.maxSearchDepth; i++) {
      if (fs.existsSync(`${currentPath}/.algokit.toml`)) {
        this.config.projectRoot = currentPath
        break
      }
      currentPath = path.dirname(currentPath)
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
