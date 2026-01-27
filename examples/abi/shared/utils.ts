/**
 * Shared utility functions for ABI examples
 */

/**
 * Prints a header/title for an example section
 * @param title The title to display
 */
export function printHeader(title: string): void {
  const line = '='.repeat(60)
  console.log(`\n${line}`)
  console.log(`  ${title}`)
  console.log(`${line}\n`)
}

/**
 * Prints a numbered step in an example
 * @param step The step number
 * @param description The step description
 */
export function printStep(step: number, description: string): void {
  console.log(`\n--- Step ${step}: ${description} ---`)
}

/**
 * Prints an informational message
 * @param message The message to display
 */
export function printInfo(message: string): void {
  console.log(`[INFO] ${message}`)
}

/**
 * Prints a success message
 * @param message The message to display
 */
export function printSuccess(message: string): void {
  console.log(`[SUCCESS] ${message}`)
}

/**
 * Prints an error message
 * @param message The message to display
 */
export function printError(message: string): void {
  console.log(`[ERROR] ${message}`)
}

/**
 * Formats a byte array as a readable string showing length and preview
 * @param bytes The byte array to format
 * @param maxPreviewBytes Maximum number of bytes to show in preview (default: 8)
 * @returns Formatted string like "16 bytes: [0x00, 0x01, 0x02, ...]"
 */
export function formatBytes(bytes: Uint8Array, maxPreviewBytes: number = 8): string {
  const preview = Array.from(bytes.slice(0, maxPreviewBytes))
    .map((b) => `0x${b.toString(16).padStart(2, '0')}`)
    .join(', ')
  const suffix = bytes.length > maxPreviewBytes ? ', ...' : ''
  return `${bytes.length} bytes: [${preview}${suffix}]`
}

/**
 * Formats a byte array as a hexadecimal string
 * @param bytes The byte array to format
 * @returns Hexadecimal string representation (e.g., "0x0102030405")
 */
export function formatHex(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `0x${hex}`
}
