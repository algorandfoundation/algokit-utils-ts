import { AsyncEventEmitter } from './async-event-emitter'
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

  events: AsyncEventEmitter
}

/** Updatable AlgoKit config */
export class UpdatableConfig implements Readonly<Config> {
  private config: Config

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

  get events() {
    return this.config.events
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
      events: new AsyncEventEmitter(),
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
