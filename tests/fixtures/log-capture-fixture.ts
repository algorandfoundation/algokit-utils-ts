import { beforeEach } from '@jest/globals'
import { Transaction } from 'algosdk'
import { AlgoKitConfig, getSenderAddress, SendTransactionFrom } from '../../src'
import { Logger } from '../../src/config'

export const logCaptureFixture = () => {
  const originalLogger = AlgoKitConfig.logger

  let hybridLogger: TestLogger

  beforeEach(() => {
    hybridLogger = new TestLogger(originalLogger)
    AlgoKitConfig.configure({
      logger: hybridLogger,
    })
  })

  afterEach(() => {
    AlgoKitConfig.configure({
      logger: originalLogger,
    })
  })

  return {
    get testLogger() {
      return hybridLogger
    },
  }
}

export class TestLogger implements Logger {
  private originalLogger: Logger
  private logs: string[]

  get capturedLogs(): string[] {
    return this.logs
  }

  snapshot(config?: {
    name?: string
    transactions?: (string | Transaction)[]
    accounts?: SendTransactionFrom[]
    apps?: (string | number)[]
  }) {
    const { name, transactions: transactionIds, accounts, apps } = config ?? {}
    let snapshot = this.capturedLogs.join('\n')
    transactionIds?.forEach(
      (txn, index) => (snapshot = snapshot.replace(new RegExp(typeof txn === 'string' ? txn : txn.txID(), 'g'), `TXID_${index + 1}`)),
    )
    accounts?.forEach((sender, index) => (snapshot = snapshot.replace(new RegExp(getSenderAddress(sender), 'g'), `ACCOUNT_${index + 1}`)))
    apps?.forEach((app, index) => (snapshot = snapshot.replace(new RegExp(app.toString(), 'g'), `APP_${index + 1}`)))
    if (name) {
      expect(snapshot).toMatchSnapshot(name)
    } else {
      expect(snapshot).toMatchSnapshot()
    }
  }

  constructor(originalLogger: Logger) {
    this.originalLogger = originalLogger
    this.logs = []
  }
  error(message: string, ...optionalParams: unknown[]): void {
    this.originalLogger.error(message, ...optionalParams)
    this.logs.push(`ERROR: ${message} | ${JSON.stringify(optionalParams)}`)
  }
  warn(message: string, ...optionalParams: unknown[]): void {
    this.originalLogger.warn(message, ...optionalParams)
    this.logs.push(`WARN: ${message} | ${JSON.stringify(optionalParams)}`)
  }
  info(message: string, ...optionalParams: unknown[]): void {
    this.originalLogger.info(message, ...optionalParams)
    this.logs.push(`INFO: ${message} | ${JSON.stringify(optionalParams)}`)
  }
  verbose(message: string, ...optionalParams: unknown[]): void {
    this.originalLogger.verbose(message, ...optionalParams)
    this.logs.push(`VERBOSE: ${message} | ${JSON.stringify(optionalParams)}`)
  }
  debug(message: string, ...optionalParams: unknown[]): void {
    this.originalLogger.debug(message, ...optionalParams)
    this.logs.push(`DEBUG: ${message} | ${JSON.stringify(optionalParams)}`)
  }
}
