import { decodeMsgpack } from '@algorandfoundation/algokit-common'
import { LogicSignature } from './transactions/signed-transaction'
import { logicSignatureCodec } from './transactions/signed-transaction-meta'

/**
 * Decodes MsgPack bytes into a logic signature.
 *
 * @param encodedLogicSignature - The MsgPack encoded logic signature
 * @returns The decoded LogicSignature or an error if decoding fails.
 */
export function decodeLogicSignature(encodedLogicSignature: Uint8Array): LogicSignature {
  const decodedData = decodeMsgpack(encodedLogicSignature)
  return logicSignatureCodec.decode(decodedData, 'msgpack')
}
