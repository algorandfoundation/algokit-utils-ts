/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-console */

import type { Logger } from '@algorandfoundation/algokit-common'
export type { Logger } from '@algorandfoundation/algokit-common'

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
