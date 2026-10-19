/* eslint-disable no-console -- examples print their results to demonstrate output */
/**
 * Demonstrates the failure path — logic errors with TEAL source context,
 * source-map reuse, error transformers, and the debug configuration that
 * emits traces for the AlgoKit AVM Debugger.
 *
 * This maps to the Concepts -> Errors & Debugging docs page. The failing
 * calls use the `State` test contract (examples/artifacts/State.arc56.json),
 * whose `error` method always asserts.
 *
 * Prerequisites: a running LocalNet (`algokit localnet start`).
 * Run with: tsx --tsconfig examples/tsconfig.json examples/concepts/errors_and_debugging.algo.ts
 */

import { AlgorandClient, algo, Config, EventType, microAlgo } from '@algorandfoundation/algokit-utils'
import { AppClient } from '@algorandfoundation/algokit-utils/types/app-client'
import { LogicError } from '@algorandfoundation/algokit-utils/types/logic-error'
import type { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { mkdtempSync, readFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { setupLocalNetEnvironment } from './_helpers.algo'

function asLogicError(error: unknown): LogicError | undefined {
  if (error instanceof LogicError) return error
  if (error instanceof Error && error.cause instanceof LogicError) return error.cause
  return undefined
}

async function inspectLogicError(algorand: AlgorandClient, deployer: TransactionSignerAccount): Promise<AppClient> {
  // example: INSPECT_LOGIC_ERROR
  // Clients created through a factory hold the TEAL source map from compilation
  const appSpec = readFileSync('examples/artifacts/State.arc56.json', 'utf-8')
  const factory = algorand.client.getAppFactory({ appSpec, defaultSender: deployer.addr })
  const { appClient } = await factory.deploy({
    deployTimeParams: { VALUE: 1 },
    updatable: true,
    deletable: true,
  })

  try {
    await appClient.send.call({ method: 'error' })
  } catch (e) {
    const logicError = e instanceof LogicError ? e : (e as Error).cause
    if (logicError instanceof LogicError) {
      // The fields locate the failure in the decoded TEAL program
      console.log(`Transaction ${logicError.led.txId} failed at PC ${logicError.led.pc}, TEAL line ${logicError.teal_line}`)
      // logicError.stack renders the failing line in context with a <--- Error marker
      console.log(logicError.stack)
    }
  }
  // example: INSPECT_LOGIC_ERROR
  return appClient
}

async function reuseSourceMaps(algorand: AlgorandClient, deployer: TransactionSignerAccount, appClient: AppClient) {
  // example: EXPORT_IMPORT_SOURCE_MAPS
  // A client constructed by app ID holds no source maps of its own
  const freshClient = algorand.client.getAppClientById({
    appSpec: readFileSync('examples/artifacts/State.arc56.json', 'utf-8'),
    appId: appClient.appId,
    defaultSender: deployer.addr,
  })

  // Export from the client that compiled the app, import onto the fresh one
  const sourceMaps = appClient.exportSourceMaps()
  freshClient.importSourceMaps(sourceMaps)
  // example: EXPORT_IMPORT_SOURCE_MAPS

  try {
    await freshClient.send.call({ method: 'error' })
    throw new Error('expected the call to fail')
  } catch (e) {
    const logicError = asLogicError(e)
    if (!logicError || logicError.teal_line === 0) {
      throw new Error('imported source maps should re-enable TEAL line resolution')
    }
  }
}

async function transformErrors(algorand: AlgorandClient, funder: TransactionSignerAccount) {
  // An account funded below the payment amount makes algod report an overspend
  const poorAccount = algorand.account.random()
  await algorand.send.payment({
    sender: funder.addr,
    receiver: poorAccount.addr,
    amount: microAlgo(200_000),
  })

  // example: REGISTER_ERROR_TRANSFORMER
  class InsufficientFundsError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'InsufficientFundsError'
    }
  }

  const toDomainError = async (error: Error): Promise<Error> => {
    // Return a new error to replace it, or the original to leave it unchanged
    if (error.message.toLowerCase().includes('overspend')) {
      return new InsufficientFundsError('the sender cannot cover the payment amount')
    }
    return error
  }

  algorand.registerErrorTransformer(toDomainError)

  try {
    await algorand.send.payment({
      sender: poorAccount.addr,
      receiver: funder.addr,
      amount: algo(1),
      suppressLog: true,
    })
  } catch (e) {
    if (e instanceof InsufficientFundsError) {
      console.log(`Transformed: ${e.message}`)
    } else {
      throw e
    }
  }
  // example: REGISTER_ERROR_TRANSFORMER
  algorand.unregisterErrorTransformer(toDomainError)
}

async function captureTraces(algorand: AlgorandClient, sender: TransactionSignerAccount, receiver: TransactionSignerAccount) {
  const debugRoot = mkdtempSync(join(tmpdir(), 'algokit-debug-'))
  const original = {
    debug: Config.debug,
    projectRoot: Config.projectRoot,
    traceAll: Config.traceAll,
  }
  let simulated = false
  const onSimulated = () => {
    simulated = true
  }

  try {
    Config.events.on(EventType.TxnGroupSimulated, onSimulated)

    // example: CONFIGURE_DEBUG
    // debug switches on simulation-trace emission;
    // projectRoot is where the Node debug addon writes artifacts, auto-detected in AlgoKit projects;
    // traceAll extends tracing from failed sends to every send
    Config.configure({ debug: true, projectRoot: debugRoot, traceAll: true })
    // example: CONFIGURE_DEBUG

    await algorand.send.payment({
      sender: sender.addr,
      receiver: receiver.addr,
      amount: algo(1),
      note: 'traced',
    })
    if (!simulated) {
      throw new Error('expected debug + traceAll to emit a TxnGroupSimulated event')
    }
  } finally {
    Config.events.off(EventType.TxnGroupSimulated, onSimulated)
    Config.configure({ debug: original.debug, projectRoot: original.projectRoot, traceAll: original.traceAll })
    rmSync(debugRoot, { recursive: true, ignoreErrors: true })
  }
}

async function main() {
  const { algorand, accountA, accountB } = await setupLocalNetEnvironment()

  const appClient = await inspectLogicError(algorand, accountA)
  await reuseSourceMaps(algorand, accountA, appClient)
  await transformErrors(algorand, accountA)
  await captureTraces(algorand, accountA, accountB)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
