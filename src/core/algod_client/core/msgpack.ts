import { encode as msgpackEncode, decode as msgpackDecode } from "@msgpack/msgpack";
// TODO(utils-ts): Remove temporary type import when utils-ts is integrated
import type { AlgokitSignedTransaction } from "../models";
import type { IntDecoding } from "./json";

/**
 * Prepare value for Algorand-compliant msgpack encoding.
 * Implements strict Algorand msgpack rules (matching go-algorand behavior):
 * 1. Omit zero values, empty strings, and empty arrays (RecursiveEmptyCheck)
 * 2. Convert bigints to smallest safe integer type (PositiveIntUnsigned)
 * 3. Sorted keys and canonical encoding are handled by msgpackEncode options
 *
 * These rules apply universally for both API communication and transaction encoding,
 * as go-algorand uses the same codec settings for all msgpack operations.
 */
function prepareForEncoding(value: any): any {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (value === null || value === undefined) {
    return undefined;
  }

  // Handle numbers - omit zeros
  if (typeof value === "number") {
    if (value === 0) return undefined;
    return value;
  }

  // Handle bigints - omit zeros and convert to number when safe (for smaller encoding)
  if (typeof value === "bigint") {
    if (value === 0n) return undefined;
    // Convert to number if it fits safely (implements PositiveIntUnsigned behavior)
    if (value <= BigInt(Number.MAX_SAFE_INTEGER) && value >= BigInt(Number.MIN_SAFE_INTEGER)) {
      return Number(value);
    }
    return value;
  }

  // Handle strings - omit empty strings
  if (typeof value === "string") {
    if (value === "") return undefined;
    return value;
  }

  // Handle Uint8Array - omit empty arrays
  if (value instanceof Uint8Array) {
    if (value.length === 0) return undefined;
    return value;
  }

  // Handle arrays - omit empty arrays and filter undefined values
  if (Array.isArray(value)) {
    if (value.length === 0) return undefined;
    const processed = value.map(prepareForEncoding).filter((v) => v !== undefined);
    return processed.length > 0 ? processed : undefined;
  }

  // Handle objects - omit empty objects and filter undefined values (RecursiveEmptyCheck)
  if (value && typeof value === "object") {
    const result: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    for (const [k, v] of Object.entries(value)) {
      const prepared = prepareForEncoding(v);
      if (prepared !== undefined) {
        result[k] = prepared;
      }
    }
    // Return undefined if object is empty after filtering
    return Object.keys(result).length > 0 ? result : undefined;
  }

  return value;
}

function convertIntegersToBigInt(value: any): any {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === "number" && Number.isInteger(value)) {
    return BigInt(value);
  }
  if (typeof value === "bigint") {
    return value;
  }
  if (value instanceof Uint8Array) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(convertIntegersToBigInt);
  }
  if (value && typeof value === "object") {
    const result: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    for (const [k, v] of Object.entries(value)) {
      result[k] = convertIntegersToBigInt(v);
    }
    return result;
  }
  return value;
}

/**
 * Encode a value as msgpack using Algorand's strict encoding rules.
 * This matches go-algorand's protocol.CodecHandle settings:
 * - Canonical = true (sorted keys, deterministic encoding)
 * - RecursiveEmptyCheck = true (omit empty/zero values recursively)
 * - PositiveIntUnsigned = true (use smallest unsigned integer types)
 *
 * @param value - The value to encode
 * @returns Encoded msgpack bytes
 */
export function encodeMsgPack(value: any): Uint8Array {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  const prepared = prepareForEncoding(value);

  // Ensure we return valid msgpack even if everything was omitted
  const toEncode = prepared === undefined ? {} : prepared;

  return msgpackEncode(toEncode, {
    sortKeys: true, // Canonical = true in go-algorand
    forceIntegerToFloat: false,
    ignoreUndefined: true, // Handle undefined values from prepareForEncoding
    initialBufferSize: 2048,
    useBigInt64: true, // Support for large integers
  });
}

export function decodeMsgPack(buffer: Uint8Array): any {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  const decoded = msgpackDecode(buffer, {
    useBigInt64: true,
  });
  return convertIntegersToBigInt(decoded);
}

export function normalizeMsgPackIntegers(value: any, intDecoding: IntDecoding): any {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  switch (intDecoding) {
    case "bigint":
      return value;
    case "unsafe":
      return mapBigInts(value, (bi) => Number(bi));
    case "safe":
      // Throw if any bigint is not safely representable
      traverse(value, (v) => {
        if (typeof v === "bigint" && !Number.isSafeInteger(Number(v))) {
          throw new Error('Integer exceeds safe range while INT_DECODING is "safe"');
        }
      });
      return mapBigInts(value, (bi) => Number(bi));
    case "mixed":
    default:
      return mapBigInts(value, (bi) => {
        const asNum = Number(bi);
        return Number.isSafeInteger(asNum) ? asNum : bi;
      });
  }
}

// Helpers to map SignedTransactionDto <-> AlgokitSignedTransaction if present in responses
// No DTO helpers needed: once utils-ts is integrated, this file remains unchanged.

function traverse(obj: any, fn: (v: any) => void): void {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (obj == null) return;
  fn(obj);
  if (Array.isArray(obj)) {
    for (const v of obj) traverse(v, fn);
  } else if (typeof obj === "object") {
    for (const v of Object.values(obj)) traverse(v, fn);
  }
}

function mapBigInts(obj: any, mapFn: (bi: bigint) => any): any {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (obj == null) return obj;
  if (typeof obj === "bigint") return mapFn(obj);
  if (Array.isArray(obj)) return obj.map((v) => mapBigInts(v, mapFn));
  if (typeof obj === "object") {
    const out: any = Array.isArray(obj) ? [] : { ...obj }; // eslint-disable-line @typescript-eslint/no-explicit-any
    for (const [k, v] of Object.entries(obj)) {
      out[k] = mapBigInts(v, mapFn);
    }
    return out;
  }
  return obj;
}
