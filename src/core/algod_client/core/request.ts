import type { ClientConfig } from "./ClientConfig";
import { ApiError } from "./ApiError";
import { parseJson, stringifyJson } from "./json";
import { decodeMsgPack, encodeMsgPack, normalizeMsgPackIntegers } from "./msgpack";
import { toCamelCaseKeysDeep } from "./casing";
import { toKebabCaseKeysDeep } from "./casing";

const encodeURIPath = (path: string): string => encodeURI(path).replace(/%5B/g, "[").replace(/%5D/g, "]");

export async function request<T>(
  config: ClientConfig,
  options: {
    method: string;
    url: string;
    path?: Record<string, string | number | bigint>;
    query?: Record<string, any>;
    headers?: Record<string, string>;
    body?: any;
    mediaType?: string;
    responseHeader?: string;
  },
): Promise<T> {
  // Replace path params before constructing URL to avoid encoded braces preventing replacement
  let rawPath = options.url;
  if (options.path) {
    for (const [key, value] of Object.entries(options.path)) {
      const raw = typeof value === "bigint" ? value.toString() : String(value);
      const replace = config.ENCODE_PATH ? config.ENCODE_PATH(raw) : encodeURIPath(raw);
      rawPath = rawPath.replace(`{${key}}`, replace);
    }
  }

  const url = new URL(rawPath, config.BASE);

  // Query params
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value === undefined || value === null) continue;
      const v = typeof value === "bigint" ? value.toString() : String(value);
      url.searchParams.append(key, v);
    }
  }

  const headers: Record<string, string> = {
    ...(typeof config.HEADERS === "function" ? await config.HEADERS() : (config.HEADERS ?? {})),
    ...(options.headers ?? {}),
  };

  // Auth: Bearer or Basic
  const token = typeof config.TOKEN === "function" ? await config.TOKEN() : config.TOKEN;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!token && config.USERNAME && config.PASSWORD) {
    headers["Authorization"] = `Basic ${btoa(`${config.USERNAME}:${config.PASSWORD}`)}`;
  }

  // Prepare body based on media type
  let body: any = undefined;
  if (options.body != null) {
    if (options.mediaType?.includes("json")) {
      body = stringifyJson(toKebabCaseKeysDeep(options.body));
    } else if (options.mediaType?.includes("msgpack")) {
      // Encode typed models to msgpack for requests
      body = encodeMsgPack(toKebabCaseKeysDeep(options.body));
    } else {
      // For binary/text, pass through as-is
      body = options.body;
    }
  }

  const response = await fetch(url.toString(), {
    method: options.method,
    headers,
    body,
    credentials: config.CREDENTIALS,
  });

  if (!response.ok) {
    let body: any = undefined;
    try {
      const ct = response.headers.get("content-type");
      if (ct && ct.includes("application/json")) body = parseJson(await response.text(), config.INT_DECODING ?? "mixed");
      else body = await response.text();
    } catch {}
    throw new ApiError(url.toString(), response.status, body);
  }

  if (options.responseHeader) {
    const value = response.headers.get(options.responseHeader);
    return value as unknown as T;
  }

  // Parse response by content-type
  const contentType = response.headers.get("content-type") || "";

  // Handle msgpack responses - decode to typed models
  if (contentType.includes("application/msgpack")) {
    const buf = new Uint8Array(await response.arrayBuffer());
    const decoded = decodeMsgPack(buf);
    const normalized = normalizeMsgPackIntegers(decoded, config.INT_DECODING ?? "bigint");
    // Lightweight mapping: if the response contains arrays/objects with x-algokit-signed-txn shapes
    // they will decode to DTOs and be assignable to AlgokitSignedTransaction via alias.
    return toCamelCaseKeysDeep(normalized) as T;
  }

  // Handle raw binary responses (e.g., application/x-binary for raw transactions)
  if (contentType.includes("application/x-binary") || contentType.includes("application/octet-stream")) {
    // For raw binary, return as Uint8Array without decoding
    return new Uint8Array(await response.arrayBuffer()) as unknown as T;
  }

  // Handle JSON responses
  if (contentType.includes("application/json")) {
    const text = await response.text();
    const parsed = parseJson(text, config.INT_DECODING ?? "mixed");
    return toCamelCaseKeysDeep(parsed) as T;
  }

  // Fallback to text
  const text = await response.text();
  try {
    const parsed = JSON.parse(text);
    return toCamelCaseKeysDeep(parsed) as T;
  } catch {
    return text as unknown as T;
  }
}
