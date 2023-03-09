/* eslint-disable no-console */
/** General purpose logger type, compatible with Winston and others. */
export type Logger = {
  error(message: string, ...optionalParams: unknown[]): void
  warn(message: string, ...optionalParams: unknown[]): void
  info(message: string, ...optionalParams: unknown[]): void
  verbose(message: string, ...optionalParams: unknown[]): void
  debug(message: string, ...optionalParams: unknown[]): void
}

/** A logger implementation that writes to console */
export const consoleLogger: Logger = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  verbose: console.trace,
  debug: console.debug,
}

/** The AlgoKit configuration type */
export interface Config {
  logger: Logger
}

class UpdatableConfig implements Readonly<Config> {
  private config: Config

  get logger() {
    return this.config.logger
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

/** The AlgoKit config. To update it use the configure method. */
export const AlgoKitConfig = new UpdatableConfig()
