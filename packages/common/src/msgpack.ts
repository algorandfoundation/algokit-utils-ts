import { IntMode, decode as msgpackDecode, encode as msgpackEncode } from 'algorand-msgpack'

type MsgPackDecodeOptions = {
  useMap: boolean
  rawBinaryStringKeys: boolean
  rawBinaryStringValues: boolean
}

export function decodeMsgpack(
  buffer: Uint8Array,
  // These default options ensure that we can correctly decode all Algorand specific msgpack data structures.
  // Some of these structures have bytes or bigint keys and bytes values that can be incorrectly decoded as utf8 strings by the msgpack library.
  options: MsgPackDecodeOptions = { useMap: true, rawBinaryStringKeys: true, rawBinaryStringValues: true },
): Map<number | bigint | Uint8Array, unknown> {
  return msgpackDecode(buffer, { intMode: IntMode.AS_ENCODED, ...options }) as Map<number | bigint | Uint8Array, unknown>
}

export function encodeMsgpack(data: unknown): Uint8Array {
  return new Uint8Array(msgpackEncode(data, { sortKeys: true, ignoreUndefined: true }))
}
