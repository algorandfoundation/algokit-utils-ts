import { decode as msgpackDecode, encode as msgpackEncode } from 'algorand-msgpack'

export function encodeMsgPack(value: unknown): Uint8Array {
  return msgpackEncode(value, {
    sortKeys: true,
    ignoreUndefined: true,
  })
}

export function decodeMsgPack<T = unknown>(buffer: Uint8Array): T {
  return msgpackDecode(buffer, { useBigInt64: true }) as T
}
