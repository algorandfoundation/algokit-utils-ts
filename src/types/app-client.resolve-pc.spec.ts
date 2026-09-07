import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { Arc56Contract } from './app-arc56'
import { AppClient } from './app-client'

const deployErrorSpec = JSON.parse(
  readFileSync(new URL('../../tests/example-contracts/deploy_error/artifacts/DeployError.arc56.json', import.meta.url), 'utf-8'),
) as Arc56Contract

describe('AppClient.resolvePc', () => {
  test('maps a pc to ARC-56 error message and TEAL line without a source map', () => {
    // pc 46 has errorMessage 'custom error message' and teal 37 (1-based)
    const info = AppClient.resolvePc(46, deployErrorSpec)

    expect(info.pc).toBe(46)
    expect(info.arc56Pc).toBe(46)
    expect(info.errorMessage).toBe('custom error message')
    expect(info.tealLine).toBe(36) // 0-based
    expect(info.source).toBe('deploy_error.algo.ts:5')
    expect(info.teal).toBeDefined()
    expect(typeof info.teal).toBe('string')
  })

  test('returns undefined error fields for unknown pc', () => {
    const info = AppClient.resolvePc(999_999, deployErrorSpec)

    expect(info.pc).toBe(999_999)
    expect(info.arc56Pc).toBe(999_999)
    expect(info.errorMessage).toBeUndefined()
    expect(info.tealLine).toBeUndefined()
    expect(info.teal).toBeUndefined()
  })

  test('throws when cblocks offset is required but program bytes are missing', () => {
    const cblocksSpec = {
      ...deployErrorSpec,
      sourceInfo: {
        approval: {
          pcOffsetMethod: 'cblocks',
          sourceInfo: deployErrorSpec.sourceInfo?.approval.sourceInfo ?? [],
        },
        clear: deployErrorSpec.sourceInfo?.clear ?? { pcOffsetMethod: 'none', sourceInfo: [] },
      },
    } as Arc56Contract

    expect(() => AppClient.resolvePc(10, cblocksSpec)).toThrow(/Program bytes are required/)
  })
})
