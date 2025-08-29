import { describe, expect, test } from 'vitest'
import { getABIDecodedValue, getABIMethod, getABIMethodSelector, getABIMethodSignature } from './abi-method'
import { encodeABIValue, parseTupleContent } from './abi-type'

describe('getABIMethod', () => {
  test.each([
    ['add(uint64,uint64)uint64', 'add', 'uint64', 2],
    ['getName()string', 'getName', 'string', 0],
    ['doSomething(uint64)void', 'doSomething', 'void', 1],
    ['transfer(address,uint64,pay)bool', 'transfer', 'bool', 3],
  ])(
    'should parse method signature %s correctly',
    (signature: string, expectedName: string, expectedReturn: string, expectedArgCount: number) => {
      const method = getABIMethod(signature)

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

describe('getABIMethodSelector', () => {
  test.each([
    ['add(uint64,uint64)uint64', 'fe6bdf69'],
    ['optIn()void', '29314d95'],
    ['deposit(pay,uint64)void', 'f2355b55'],
    ['bootstrap(pay,pay,application)void', '895c2a3b'],
  ])('should generate correct selector for %s', (signature: string, expectedHex: string) => {
    const method = getABIMethod(signature)
    const selector = getABIMethodSelector(method)

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

describe('getABIMethodSignature round trip', () => {
  test.each([['add(uint64,uint64)uint64'], ['optIn()void']])('should round trip signature %s correctly', (signature: string) => {
    const method = getABIMethod(signature)
    const regeneratedSignature = getABIMethodSignature(method)
    expect(regeneratedSignature).toBe(signature)
  })
})

describe('getABIDecodedValue', () => {
  test('correctly decodes a struct containing a uint16', () => {
    const decoded = getABIDecodedValue(new Uint8Array([0, 1, 0, 4, 0, 5, 119, 111, 114, 108, 100]), 'User', {
      User: [
        { name: 'userId', type: 'uint16' },
        { name: 'name', type: 'string' },
      ],
    }) as { userId: number; name: string }

    expect(typeof decoded.userId).toBe('number')
    expect(decoded.userId).toBe(1)
    expect(typeof decoded.name).toBe('string')
    expect(decoded.name).toBe('world')
  })

  test.each(
    // Generate all valid ABI uint bit lengths
    Array.from({ length: 64 }, (_, i) => (i + 1) * 8),
  )('correctly decodes a uint%i', (bitLength) => {
    const encoded = encodeABIValue({ name: 'Uint', bitSize: bitLength }, 1)
    const decoded = getABIDecodedValue(encoded, `uint${bitLength}`, {})

    if (bitLength < 53) {
      expect(typeof decoded).toBe('number')
      expect(decoded).toBe(1)
    } else {
      expect(typeof decoded).toBe('bigint')
      expect(decoded).toBe(1n)
    }
  })
})
