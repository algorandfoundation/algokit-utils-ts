import { decode as msgpackDecode, encode as msgpackEncode } from 'algorand-msgpack'

export function encodeMsgpack<T>(data: T): Uint8Array {
  return new Uint8Array(msgpackEncode(data, { sortKeys: true, ignoreUndefined: true }))
}

export function decodeMsgpack<T>(encoded: Uint8Array): T {
  return msgpackDecode(encoded) as T
}
