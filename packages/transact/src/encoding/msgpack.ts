import { decode as msgpackDecode, encode as msgpackEncode } from 'algorand-msgpack'

export function encodeMsgpack(data: Record<string, unknown>): Uint8Array {
  return new Uint8Array(msgpackEncode(data, { sortKeys: true, ignoreUndefined: true }))
}

export function decodeMsgpack(encoded: Uint8Array): Map<Uint8Array, unknown> {
  return msgpackDecode(encoded, { useMap: true, rawBinaryStringKeys: true, rawBinaryStringValues: true }) as Map<Uint8Array, unknown>
}
