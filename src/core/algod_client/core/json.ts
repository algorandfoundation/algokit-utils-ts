// Use require to avoid ESM/CJS interop issues in consumers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONBigFactory = require("json-bigint");

export type IntDecoding = "safe" | "unsafe" | "mixed" | "bigint";

// Instances
const JSONBigMixed = JSONBigFactory({ useNativeBigInt: true, alwaysParseAsBig: false });
const JSONBigAllBig = JSONBigFactory({ useNativeBigInt: true, alwaysParseAsBig: true });

function traverseAndThrowOnBigInt(obj: any): void {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (obj === null || obj === undefined) return;
  const t = typeof obj;
  if (t === "bigint") {
    throw new Error('Integer exceeds safe range while INT_DECODING is "safe"');
  }
  if (t !== "object") return;
  if (Array.isArray(obj)) {
    for (const v of obj) traverseAndThrowOnBigInt(v);
  } else {
    for (const v of Object.values(obj)) traverseAndThrowOnBigInt(v);
  }
}

function convertLargeNumericStrings(obj: any): any {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (obj == null) return obj;
  if (typeof obj === "string") {
    if (/^\d+$/.test(obj)) {
      const asNum = Number(obj);
      if (!Number.isSafeInteger(asNum)) return BigInt(obj);
    }
    return obj;
  }
  if (Array.isArray(obj)) return obj.map(convertLargeNumericStrings);
  if (typeof obj === "object") {
    for (const k of Object.keys(obj)) obj[k] = convertLargeNumericStrings(obj[k]);
  }
  return obj;
}

export function parseJson(text: string, intDecoding: IntDecoding = "mixed"): any {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  switch (intDecoding) {
    case "unsafe":
      return JSON.parse(text);
    case "bigint": {
      const v = JSONBigAllBig.parse(text);
      return convertLargeNumericStrings(v);
    }
    case "safe": {
      const value = JSONBigMixed.parse(text);
      traverseAndThrowOnBigInt(value);
      return value;
    }
    case "mixed":
    default: {
      const v = JSONBigMixed.parse(text);
      return convertLargeNumericStrings(v);
    }
  }
}

export function stringifyJson(value: any): string {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  return JSON.stringify(value, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
}
