export const isNode = () => {
  return typeof process !== 'undefined' && process.versions != null && process.versions.node != null
}
