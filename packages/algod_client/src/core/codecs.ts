import { decode as msgpackDecode, encode as msgpackEncode } from 'algorand-msgpack'

export function encodeMsgPack(data: Record<string, unknown>): Uint8Array {
  return new Uint8Array(msgpackEncode(data, { sortKeys: true, ignoreUndefined: true }))
}

type MsgPackDecodeOptions = {
  useMap: boolean
  rawBinaryStringKeys: boolean
  rawBinaryStringValues: boolean
}

export function decodeMsgPack(
  buffer: Uint8Array,
  options: MsgPackDecodeOptions = { useMap: true, rawBinaryStringKeys: true, rawBinaryStringValues: true },
): Map<number | bigint | Uint8Array, unknown> {
  // TODO: NC - Need to account for int mode here.
  return msgpackDecode(buffer, options) as Map<number | bigint | Uint8Array, unknown>
}
