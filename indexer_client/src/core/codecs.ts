import { encode as msgpackEncode, decode as msgpackDecode } from '@msgpack/msgpack'

export function encodeMsgPack(value: unknown): Uint8Array {
  return msgpackEncode(value, {
    sortKeys: true,
    ignoreUndefined: true,
    useBigInt64: true,
  })
}

export function decodeMsgPack<T = unknown>(buffer: Uint8Array): T {
  return msgpackDecode(buffer, { useBigInt64: true }) as T
}
