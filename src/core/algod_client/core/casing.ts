function toCamel(segmented: string): string {
  if (!segmented) return segmented;
  // Fast path: if no hyphen, return as-is but ensure typical camel conversion for underscores
  if (!segmented.includes("-")) return segmented.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
  return segmented
    .split("-")
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}

function toKebab(camel: string): string {
  if (!camel) return camel;
  // Convert camelCase or mixedCase to kebab-case; leave existing hyphens and numbers intact
  return camel
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function toCamelCaseKeysDeep<T = any>(value: T): T {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (Array.isArray(value)) return value.map((v) => toCamelCaseKeysDeep(v)) as unknown as T;
  if (value instanceof Uint8Array) return value;
  if (!isPlainObject(value)) return value;

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    const newKey = toCamel(k);
    out[newKey] = toCamelCaseKeysDeep(v as unknown);
  }
  return out as unknown as T;
}

export function toKebabCaseKeysDeep<T = any>(value: T): T {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (Array.isArray(value)) return value.map((v) => toKebabCaseKeysDeep(v)) as unknown as T;
  if (value instanceof Uint8Array) return value;
  if (!isPlainObject(value)) return value;

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    const newKey = toKebab(k);
    out[newKey] = toKebabCaseKeysDeep(v as unknown);
  }
  return out as unknown as T;
}
