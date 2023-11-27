import { describe, test } from '@jest/globals'
import algosdk, { AtomicTransactionComposer } from 'algosdk'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { AVMDebuggerSourceMap, PersistSourceMapInput, persistSourcemaps, simulateAndPersistResponse } from './debug-utils'
import { algorandFixture } from './testing'

describe('debug utils tests', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  test('build teal sourcemaps', async () => {
    const { algod } = localnet.context
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'cwd'))

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

    await persistSourcemaps({ sources: sources, projectRoot: cwd, client: algod })

    const rootPath = path.join(cwd, '.algokit', 'sources')
    const sourcemapFilePath = path.join(rootPath, 'sources.avm.json')
    const appOutputPath = path.join(rootPath, 'cool_app')

    expect(fs.existsSync(sourcemapFilePath)).toBe(true)
    expect(fs.existsSync(path.join(appOutputPath, 'approval.teal'))).toBe(true)
    expect(fs.existsSync(path.join(appOutputPath, 'approval.teal.tok.map'))).toBe(true)
    expect(fs.existsSync(path.join(appOutputPath, 'clear.teal'))).toBe(true)
    expect(fs.existsSync(path.join(appOutputPath, 'clear.teal.tok.map'))).toBe(true)

    const result = AVMDebuggerSourceMap.fromDict(JSON.parse(fs.readFileSync(sourcemapFilePath, 'utf8')))
    for (const item of result.txnGroupSources) {
      item.location = 'dummy'
    }

    expect(result).toMatchSnapshot()

    // check for updates in case of multiple runs
    await persistSourcemaps({ sources: sources, projectRoot: cwd, client: algod })
    const resultAfterUpdate = AVMDebuggerSourceMap.fromDict(JSON.parse(fs.readFileSync(sourcemapFilePath, 'utf8')))
    for (const item of resultAfterUpdate.txnGroupSources) {
      expect(item.location).not.toBe('dummy')
    }
  })

  test('build teal sourcemaps without sources', async () => {
    const { algod } = localnet.context
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'cwd'))

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

    await persistSourcemaps({ sources: sources, projectRoot: cwd, client: algod, withSources: false })

    const rootPath = path.join(cwd, '.algokit', 'sources')
    const sourcemapFilePath = path.join(rootPath, 'sources.avm.json')
    const appOutputPath = path.join(rootPath, 'cool_app')

    expect(fs.existsSync(sourcemapFilePath)).toBe(true)
    expect(fs.existsSync(path.join(appOutputPath, 'approval.teal'))).toBe(false)
    expect(fs.existsSync(path.join(appOutputPath, 'approval.teal.tok.map'))).toBe(true)
    expect(JSON.parse(fs.readFileSync(path.join(appOutputPath, 'approval.teal.tok.map'), 'utf8')).sources).toEqual([])
    expect(fs.existsSync(path.join(appOutputPath, 'clear.teal'))).toBe(false)
    expect(fs.existsSync(path.join(appOutputPath, 'clear.teal.tok.map'))).toBe(true)
    expect(JSON.parse(fs.readFileSync(path.join(appOutputPath, 'clear.teal.tok.map'), 'utf8')).sources).toEqual([])

    const result = AVMDebuggerSourceMap.fromDict(JSON.parse(fs.readFileSync(sourcemapFilePath, 'utf8')))
    for (const item of result.txnGroupSources) {
      item.location = 'dummy'
    }

    expect(result).toMatchSnapshot()
  })

  test('simulate and persist response', async () => {
    const { algod, testAccount } = localnet.context
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'cwd'))

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

    const debugTracesPath = path.join(cwd, '.algokit', 'debug_traces')
    const files = fs.readdirSync(debugTracesPath)

    expect(files.length).toBeGreaterThan(0)
    for (const file of files) {
      const filePath = path.join(debugTracesPath, file)
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      expect(content).toHaveProperty('txn-groups')
      expect(content).toHaveProperty('last-round')
    }
  })
})
