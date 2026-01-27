import { Buffer } from 'buffer'
import { describe, expect, test } from 'vitest'
import { ABIMethod } from './abi-method'
import { parseTupleContent } from './abi-type'

describe('ABIMethod.fromSignature', () => {
  test.each([
    ['add(uint64,uint64)uint64', 'add', 'uint64', 2],
    ['getName()string', 'getName', 'string', 0],
    ['doSomething(uint64)void', 'doSomething', 'void', 1],
    ['transfer(address,uint64,pay)bool', 'transfer', 'bool', 3],
  ])(
    'should parse method signature %s correctly',
    (signature: string, expectedName: string, expectedReturn: string, expectedArgCount: number) => {
      const method = ABIMethod.fromSignature(signature)

      expect(method.name).toBe(expectedName)
      expect(method.args).toHaveLength(expectedArgCount)

      if (expectedReturn === 'void') {
        expect(method.returns.type).toBe('void')
      } else {
        expect(method.returns.type).not.toBe('void')
        expect(method.returns.type).toEqual(expect.any(Object))
      }
    },
  )
})

describe('ABIMethod.getSelector', () => {
  test.each([
    ['add(uint64,uint64)uint64', 'fe6bdf69'],
    ['optIn()void', '29314d95'],
    ['deposit(pay,uint64)void', 'f2355b55'],
    ['bootstrap(pay,pay,application)void', '895c2a3b'],
  ])('should generate correct selector for %s', (signature: string, expectedHex: string) => {
    const method = ABIMethod.fromSignature(signature)
    const selector = method.getSelector()

    expect(selector).toHaveLength(4)
    expect(Buffer.from(selector).toString('hex')).toBe(expectedHex)
  })
})

describe('parseTupleContent', () => {
  test.each([
    ['uint64,string,bool', ['uint64', 'string', 'bool']],
    ['(uint64,string),bool', ['(uint64,string)', 'bool']],
    ['', []],
  ])('should parse tuple content "%s" correctly', (input: string, expected: string[]) => {
    const result = parseTupleContent(input)
    expect(result).toEqual(expected)
  })
})

describe('ABIMethod.getSignature round trip', () => {
  test.each([['add(uint64,uint64)uint64'], ['optIn()void']])('should round trip signature %s correctly', (signature: string) => {
    const method = ABIMethod.fromSignature(signature)
    const regeneratedSignature = method.getSignature()
    expect(regeneratedSignature).toBe(signature)
  })
})

describe('ABIMethod examples', () => {
  test('ABIMethod.fromSignature parses method signatures', () => {
    // #region example-ABIMethod-fromSignature
    // Parse a method signature string into an ABIMethod object
    const method = ABIMethod.fromSignature('add(uint64,uint64)uint64')

    // Access method properties
    const name = method.name // 'add'
    const argCount = method.args.length // 2
    // #endregion example-ABIMethod-fromSignature

    expect(name).toBe('add')
    expect(argCount).toBe(2)
  })

  test('ABIMethod.getSelector returns 4-byte selector', () => {
    // #region example-ABIMethod-getSelector
    // Get the 4-byte method selector for ABI method calls
    const method = ABIMethod.fromSignature('add(uint64,uint64)uint64')
    const selector = method.getSelector()

    // Selector is the first 4 bytes of SHA-512/256 hash of the signature
    // #endregion example-ABIMethod-getSelector

    expect(selector).toHaveLength(4)
    expect(Buffer.from(selector).toString('hex')).toBe('fe6bdf69')
  })

  test('ABIMethod.getSignature returns the signature', () => {
    // #region example-ABIMethod-getSignature
    // Get the full method signature string
    const method = ABIMethod.fromSignature('transfer(address,uint64)bool')
    const signature = method.getSignature()
    // #endregion example-ABIMethod-getSignature

    expect(signature).toBe('transfer(address,uint64)bool')
  })
})
