import { describe, test } from '@jest/globals'
import algosdk, { AtomicTransactionComposer } from 'algosdk'
import * as fsSync from 'fs'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { AVMDebuggerSourceMap, PersistSourceMapInput, persistSourceMaps, simulateAndPersistResponse } from './debug-utils'
import { algorandFixture } from './testing'

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

describe('debug utils tests', () => {
  const localnet = algorandFixture()
  const timeout = 10e6

  beforeAll(localnet.beforeEach)

  test(
    'build teal sourceMaps',
    async () => {
      const { algod } = localnet.context
      const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'cwd'))

      const approval = `
#pragma version 9
int 1
`
      const clear = `
#pragma version 9
int 1
`
      const sources = [
        new PersistSourceMapInput(approval, 'cool_app', 'approval.teal'),
        new PersistSourceMapInput(clear, 'cool_app', 'clear'),
      ]

      await persistSourceMaps({ sources: sources, projectRoot: cwd, client: algod })

      const rootPath = path.join(cwd, '.algokit', 'sources')
      const sourcemapFilePath = path.join(rootPath, 'sources.avm.json')
      const appOutputPath = path.join(rootPath, 'cool_app')

      expect(await fileExists(sourcemapFilePath)).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'approval.teal'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'approval.teal.tok.map'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'clear.teal'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'clear.teal.tok.map'))).toBeTruthy()

      // Remove location from sourcemap to make snapshot deterministic
      const result = AVMDebuggerSourceMap.fromDict(JSON.parse(await fs.readFile(sourcemapFilePath, 'utf8')))
      for (const item of result.txnGroupSources) {
        item.location = 'dummy'
      }

      expect(result).toMatchSnapshot()

      // check for updates in case of multiple runs
      await persistSourceMaps({ sources: sources, projectRoot: cwd, client: algod })
      const resultAfterUpdate = AVMDebuggerSourceMap.fromDict(JSON.parse(await fs.readFile(sourcemapFilePath, 'utf8')))
      for (const item of resultAfterUpdate.txnGroupSources) {
        expect(item.location).not.toBe('dummy')
      }
    },
    timeout,
  )

  test(
    'build teal sourceMaps without sources',
    async () => {
      const { algod } = localnet.context
      const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'cwd'))

      const approval = `
#pragma version 9
int 1
`
      const clear = `
#pragma version 9
int 1
`
      const sources = [
        new PersistSourceMapInput(approval, 'cool_app', 'approval.teal'),
        new PersistSourceMapInput(clear, 'cool_app', 'clear'),
      ]

      await persistSourceMaps({ sources: sources, projectRoot: cwd, client: algod, withSources: false })

      const rootPath = path.join(cwd, '.algokit', 'sources')
      const sourcemapFilePath = path.join(rootPath, 'sources.avm.json')
      const appOutputPath = path.join(rootPath, 'cool_app')

      expect(await fileExists(sourcemapFilePath)).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'approval.teal'))).toBeFalsy()
      expect(await fileExists(path.join(appOutputPath, 'approval.teal.tok.map'))).toBeTruthy()
      expect(JSON.parse(await fs.readFile(path.join(appOutputPath, 'approval.teal.tok.map'), 'utf8')).sources).toEqual([])
      expect(await fileExists(path.join(appOutputPath, 'clear.teal'))).toBeFalsy()
      expect(await fileExists(path.join(appOutputPath, 'clear.teal.tok.map'))).toBeTruthy()
      expect(JSON.parse(await fs.readFile(path.join(appOutputPath, 'clear.teal.tok.map'), 'utf8')).sources).toEqual([])

      const result = AVMDebuggerSourceMap.fromDict(JSON.parse(await fs.readFile(sourcemapFilePath, 'utf8')))
      for (const item of result.txnGroupSources) {
        item.location = 'dummy'
      }

      expect(result).toMatchSnapshot()
    },
    timeout,
  )

  test(
    'simulate and persist response',
    async () => {
      const { algod, testAccount } = localnet.context
      const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'cwd'))

      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: testAccount.addr,
        to: testAccount.addr,
        rekeyTo: undefined,
        amount: 0,
        suggestedParams: await localnet.context.algod.getTransactionParams().do(),
        closeRemainderTo: undefined,
      })
      const atc = new AtomicTransactionComposer()
      atc.addTransaction({ txn: transaction, signer: algosdk.makeBasicAccountTransactionSigner(testAccount) })
      const bufferSizeMb = 256

      await simulateAndPersistResponse({ atc: atc, projectRoot: cwd, algod: algod, bufferSizeMb: bufferSizeMb })

      const debugTracesPath = path.join(cwd, 'debug_traces')
      const files = await fs.readdir(debugTracesPath)

      const filePath = path.join(debugTracesPath, files[0])
      const content = JSON.parse(await fs.readFile(filePath, 'utf8'))
      expect(content.txnGroups[0].txnResults[0].txnResult.txn.txn.type).toBe('pay')
      expect(content).toHaveProperty('lastRound')

      while (fsSync.existsSync(filePath)) {
        const tmpAtc = atc.clone()
        await simulateAndPersistResponse({ atc: tmpAtc, projectRoot: cwd, algod: algod, bufferSizeMb: 0.01 })
      }
    },
    timeout,
  )
})
