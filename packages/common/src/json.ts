import JSONbigFactory from 'json-bigint'

const JSONbig = JSONbigFactory({
  useNativeBigInt: true,
  strict: true,
})

/**
 * Parse JSON with bigint support.
 * @param str - The JSON string to parse.
 */
export function parseJson(str: string) {
  return JSONbig.parse(str, (_: string, value: unknown): unknown => {
    if (value != null && typeof value === 'object' && Object.getPrototypeOf(value) == null) {
      // JSONbig.parse objects are created with Object.create(null) and thus have a null prototype
      Object.setPrototypeOf(value, Object.prototype)
    }

    if (typeof value === 'bigint') {
      if (value > Number.MAX_SAFE_INTEGER) {
        return value
      }
      // JSONbig.parse converts number to BigInts if they are >= 10**15. This is smaller than
      // Number.MAX_SAFE_INTEGER, so we can convert some BigInts back to normal numbers.
      return Number(value)
    }

    return value
  })
}

/**
 * Convert a JavaScript value to a JSON string with bigint support.
 *
 * @param value - A JavaScript value, usually an object or array, to be converted.
 * @param replacer - A function that transforms the results.
 * @param space - Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 */
export function stringifyJson(
  value: unknown,
  replacer?: (this: unknown, key: string, value: unknown) => unknown,
  space?: string | number,
): string {
  return JSONbig.stringify(value, replacer, space)
}
