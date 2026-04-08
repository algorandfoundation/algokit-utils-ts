export function arrayEqual<T>(a: ArrayLike<T>, b: ArrayLike<T>): boolean {
  if (a.length !== b.length) {
    return false
  }
  return Array.from(a).every((val, i) => val === b[i])
}

export function concatArrays(...arrs: ArrayLike<number>[]): Uint8Array {
  const size = arrs.reduce((sum, arr) => sum + arr.length, 0)
  const c = new Uint8Array(size)

  let offset = 0
  for (let i = 0; i < arrs.length; i++) {
    c.set(arrs[i], offset)
    offset += arrs[i].length
  }

  return c
}
