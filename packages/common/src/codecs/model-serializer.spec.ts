import { Buffer } from 'buffer'
import { describe, expect, test } from 'vitest'
import { ArrayCodec, MapCodec } from './composite'
import { ArrayModelCodec, ModelCodec } from './model'
import { ModelSerializer } from './model-serializer'
import { bigIntCodec } from './primitives/bigint'
import { bytesCodec } from './primitives/bytes'
import { numberCodec } from './primitives/number'
import { stringCodec } from './primitives/string'
import type { ArrayModelMetadata, ObjectModelMetadata } from './types'

describe('ModelSerializer', () => {
  const addressMetadata: ObjectModelMetadata = {
    name: 'Address',
    kind: 'object',
    fields: [
      { name: 'number', wireKey: 'n', codec: bigIntCodec, optional: false, nullable: false },
      { name: 'street', wireKey: 's', codec: stringCodec, optional: false, nullable: false },
      { name: 'city', wireKey: 'c', codec: stringCodec, optional: false, nullable: false },
      { name: 'postcode', wireKey: 'p', codec: numberCodec, optional: false, nullable: false },
    ],
  }

  const favouriteNumbersMetadata: ArrayModelMetadata = {
    name: 'FavouriteNumbers',
    kind: 'array',
    codec: new ArrayCodec(bigIntCodec),
  }

  const userMetadata: ObjectModelMetadata = {
    name: 'UserModel',
    kind: 'object',
    fields: [
      { name: 'name', wireKey: 'n', codec: stringCodec, optional: false, nullable: false },
      { name: 'age', wireKey: 'a', codec: numberCodec, optional: true, nullable: false },
      { name: 'address', wireKey: 'ad', codec: new ModelCodec(addressMetadata), optional: false, nullable: false },
      { name: 'data', wireKey: 'd', codec: new MapCodec(bytesCodec, bytesCodec), optional: true, nullable: false },
      {
        name: 'favouriteNumbers',
        wireKey: 'fn',
        codec: new ArrayModelCodec(favouriteNumbersMetadata),
        optional: true,
        nullable: false,
      },
    ],
  }
  type UserModel = {
    name: string
    age?: number
    address: {
      number: bigint
      street: string
      city: string
      postcode: number
    }
    data?: Map<Uint8Array, Uint8Array>
    favouriteNumbers?: bigint[]
  }

  describe('encode', () => {
    // TODO: NC - Need to fix to align to these rules
    // Rules for encoding:
    // In a map, if the object is empty, the item should be omitted (it's object like)
    // In a map, the key should never be omitted as a value
    // In an array, the item should never be omitted as a value. Also bigints should remain bigints

    const alice = {
      name: 'Alice',
      age: 30,
      address: { number: 10n, street: '', city: 'New York', postcode: 10001, random: 'test' },
      favouriteNumbers: [0n, 100n, 2147483648n],
      data: new Map<Uint8Array, Uint8Array>([
        [Uint8Array.from(Buffer.from('somekey', 'utf-8')), Uint8Array.from(Buffer.from('somevalue', 'utf-8'))],
      ]),
      random: 1,
    }

    // TODO: NC - Do these
    // Change array handling to use consistent values for numbers etc

    test('should encode the example model to a json ready model', () => {
      const encoded = ModelSerializer.encode<UserModel>(alice, userMetadata, 'json')
      expect(encoded).toMatchInlineSnapshot(`
        {
          "a": 30,
          "ad": {
            "c": "New York",
            "n": 10,
            "p": 10001,
          },
          "d": {
            "c29tZWtleQ==": "c29tZXZhbHVl"
          },
          "fn": [
            0n,
            100n,
            2147483648n,
          ],
          "n": "Alice",
        }
      `)
    })

    test('should encode the example model to a msgpack ready model', () => {
      const encoded = ModelSerializer.encode<UserModel>(alice, userMetadata, 'msgpack')
      expect(encoded).toMatchInlineSnapshot(`
        {
          "a": 30,
          "ad": {
            "c": "New York",
            "n": 10,
            "p": 10001,
          },
          "d": Map {
            Uint8Array [
              115,
              111,
              109,
              101,
              107,
              101,
              121,
            ] => Uint8Array [
              115,
              111,
              109,
              101,
              118,
              97,
              108,
              117,
              101,
            ],
          },
          "fn": [
            0n,
            100,
            2147483648n,
          ],
          "n": "Alice",
        }
      `)
    })
  })

  describe('decode', () => {
    test('should decode the msgpack example model', () => {
      const alice = new Map<Uint8Array, unknown>([
        [Buffer.from('n', 'utf-8'), Buffer.from('Alice', 'utf-8')],
        [Buffer.from('a', 'utf-8'), 30],
        [
          Buffer.from('ad', 'utf-8'),
          new Map<Uint8Array, unknown>([
            [Buffer.from('n', 'utf-8'), 10],
            [Buffer.from('s', 'utf-8'), Buffer.from('', 'utf-8')],
            [Buffer.from('c', 'utf-8'), Buffer.from('New York', 'utf-8')],
            [Buffer.from('p', 'utf-8'), 10001],
            [Buffer.from('r', 'utf-8'), Buffer.from('test', 'utf-8')],
          ]),
        ],
        [Buffer.from('fn', 'utf-8'), [0n, 100n, 2147483648n]],
        [
          Buffer.from('d', 'utf-8'),
          new Map<Uint8Array, Uint8Array>([[Uint8Array.from(Buffer.from('somekey')), Uint8Array.from(Buffer.from('somevalue'))]]),
        ],
        [Buffer.from('r', 'utf-8'), 1],
      ])

      const decoded = ModelSerializer.decode<UserModel>(alice, userMetadata, 'msgpack')

      expect(decoded).toMatchInlineSnapshot(`
        {
          "address": {
            "city": "New York",
            "number": 10n,
            "postcode": 10001,
            "street": "",
          },
          "age": 30,
          "data": Map {
            Uint8Array [
              115,
              111,
              109,
              101,
              107,
              101,
              121,
            ] => Uint8Array [
              115,
              111,
              109,
              101,
              118,
              97,
              108,
              117,
              101,
            ],
          },
          "favouriteNumbers": [
            0n,
            100n,
            2147483648n,
          ],
          "name": "Alice",
        }
      `)
    })
  })
})
