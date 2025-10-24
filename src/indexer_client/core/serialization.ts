export function toBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }
  const globalRef: Record<string, unknown> = globalThis as unknown as Record<string, unknown>
  const btoaFn = globalRef.btoa as ((value: string) => string) | undefined
  if (typeof btoaFn === 'function') {
    return btoaFn(String.fromCharCode(...bytes))
  }
  throw new Error('Base64 encoding not supported in this environment')
}

export function fromBase64(s: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(s, 'base64'))
  }
  const globalRef: Record<string, unknown> = globalThis as unknown as Record<string, unknown>
  const atobFn = globalRef.atob as ((value: string) => string) | undefined
  if (typeof atobFn === 'function') {
    const bin = atobFn(s)
    const out = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i)
    return out
  }
  throw new Error('Base64 decoding not supported in this environment')
}
