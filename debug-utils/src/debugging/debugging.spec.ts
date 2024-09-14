import { Config } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { describe, test } from '@jest/globals'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import '../index'

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
      const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'cwd'))

      const approval = `
#pragma version 9
int 1
`
      const clear = `
#pragma version 9
int 1
`
      const compiledApproval = await localnet.algorand.app.compileTeal(approval)
      const compiledClear = await localnet.algorand.app.compileTeal(clear)

      await Config.invokeDebugHandlers({
        message: 'persistSourceMaps',
        data: {
          sources: [
            {
              compiledTeal: compiledApproval,
              appName: 'cool_app',
              fileName: 'approval',
            },
            {
              compiledTeal: compiledClear,
              appName: 'cool_app',
              fileName: 'clear',
            },
          ],
          projectRoot: cwd,
          appManager: localnet.algorand.app,
        },
      })

      const rootPath = path.join(cwd, '.algokit', 'sources')
      const sourcemapFilePath = path.join(rootPath, 'sources.avm.json')
      const appOutputPath = path.join(rootPath, 'cool_app')

      expect(await fileExists(sourcemapFilePath)).toBeFalsy()
      expect(await fileExists(path.join(appOutputPath, 'approval.teal'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'approval.teal.tok.map'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'clear.teal'))).toBeTruthy()
      expect(await fileExists(path.join(appOutputPath, 'clear.teal.tok.map'))).toBeTruthy()
    },
    timeout,
  )

  // ... (other tests updated similarly)
})
