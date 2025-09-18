export type TealCompile = {
  /**
   * base32 SHA512_256 of program bytes (Address style)
   */
  hash: string;

  /**
   * base64 encoded program bytes
   */
  result: string;

  /**
   * JSON of the source map
   */
  sourcemap?: {};
};
