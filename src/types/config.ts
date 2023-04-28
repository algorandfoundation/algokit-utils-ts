import { consoleLogger, Logger, nullLogger } from './logging'

/** The AlgoKit configuration type */
export interface Config {
  /** Logger */
  logger: Logger
  /** Whether or not debug mode is enabled */
  debug: boolean
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
