/*
  Minimal client runtime config holder
*/
export type BaseURL = string;

export interface ClientConfig {
  BASE: BaseURL;
  VERSION?: string;
  WITH_CREDENTIALS?: boolean;
  CREDENTIALS?: "include" | "omit" | "same-origin";
  TOKEN?: string | (() => string | Promise<string>);
  USERNAME?: string;
  PASSWORD?: string;
  HEADERS?: Record<string, string> | (() => Record<string, string> | Promise<Record<string, string>>);
  ENCODE_PATH?: (path: string) => string;
  INT_DECODING?: "safe" | "unsafe" | "mixed" | "bigint";
}
