import { Address, encodeMsgpack } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import { LogicSigAccount } from './logicsig'
import { LogicSignature } from './transactions/signed-transaction'
import { logicSignatureCodec } from './transactions/signed-transaction-meta'

describe('logicsig', () => {
  describe('LogicSigAccount.fromBytes', () => {
    test('should decode logic signature with signature', () => {
      const signature = new Uint8Array(64).fill(42)
      const logicSignature = {
        logic: new Uint8Array([1, 32, 1, 1, 34]),
        args: [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])],
        sig: signature,
      } satisfies LogicSignature
      const encoded = encodeMsgpack(logicSignatureCodec.encode(logicSignature, 'msgpack'))

      const decoded = LogicSigAccount.fromBytes(encoded, Address.zeroAddress())

      expect(decoded.logic).toEqual(logicSignature.logic)
      expect(decoded.sig).toEqual(signature)
      expect(decoded.args).toEqual(logicSignature.args)
      expect(decoded.msig).toBeUndefined()
    })
  })
})
