import { IntMode, decode as msgpackDecode, encode as msgpackEncode } from 'algorand-msgpack'

type MsgPackDecodeOptions = {
  useMap: boolean
  rawBinaryStringKeys: boolean
  rawBinaryStringValues: boolean
}

export function decodeMsgpack(
  buffer: Uint8Array,
  options: MsgPackDecodeOptions = { useMap: true, rawBinaryStringKeys: true, rawBinaryStringValues: true },
): Map<number | bigint | Uint8Array, unknown> {
  return msgpackDecode(buffer, { intMode: IntMode.AS_ENCODED, ...options }) as Map<number | bigint | Uint8Array, unknown>
}

export function encodeMsgpack(data: Record<string, unknown>): Uint8Array {
  return new Uint8Array(msgpackEncode(data, { sortKeys: true, ignoreUndefined: true }))
}
