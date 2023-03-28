import { consoleLogger, Logger, nullLogger } from './logging'

/** The AlgoKit configuration type */
export interface Config {
  logger: Logger
}

/** Updatable AlgoKit config */
export class UpdatableConfig implements Readonly<Config> {
  private config: Config

  get logger() {
    return this.config.logger
  }

  getLogger(returnNullLogger?: boolean) {
    if (returnNullLogger) {
      return nullLogger
    }

    return this.logger
  }

  constructor() {
    this.config = {
      logger: consoleLogger,
    }
  }

  /** Update the AlgoKit configuration with your own configuration settings */
  configure(newConfig: Config) {
    this.config = newConfig
  }
}
