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
  verbose: () => {},
  debug: console.debug,
}

export const infoConsoleLogger: Logger = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  verbose: () => {},
  debug: () => {},
}

export const verboseConsoleLogger: Logger = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  verbose: console.trace,
  debug: console.debug,
}

export const warningConsoleLogger: Logger = {
  error: console.error,
  warn: console.warn,
  info: () => {},
  verbose: () => {},
  debug: () => {},
}

/** A logger implementation that does nothing */
export const nullLogger: Logger = {
  error: function (message: string, ...optionalParams: unknown[]): void {},
  warn: function (message: string, ...optionalParams: unknown[]): void {},
  info: function (message: string, ...optionalParams: unknown[]): void {},
  verbose: function (message: string, ...optionalParams: unknown[]): void {},
  debug: function (message: string, ...optionalParams: unknown[]): void {},
}
