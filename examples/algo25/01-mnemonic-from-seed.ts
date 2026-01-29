/**
 * Example: Mnemonic from Seed
 *
 * This example demonstrates how to use mnemonicFromSeed() to convert a 32-byte
 * seed into a 25-word Algorand mnemonic. The mnemonic uses BIP39-style word
 * encoding where each word represents 11 bits of data.
 *
 * Key concepts:
 * - A 32-byte (256-bit) seed produces 24 data words (256 / 11 = ~23.3, rounded up)
 * - A 25th checksum word is computed from the SHA-512/256 hash of the seed
 * - The mnemonic is deterministic: same seed always produces same mnemonic
 *
 * No LocalNet required - pure utility function
 */

import { mnemonicFromSeed } from '@algorandfoundation/algokit-utils/algo25'
import { formatBytes, formatHex, printHeader, printInfo, printStep, printSuccess } from '../shared/utils.js'

function main() {
  printHeader('Mnemonic from Seed Example')

  // Step 1: Generate a random 32-byte seed
  printStep(1, 'Generate a Random 32-byte Seed')

  const seed = new Uint8Array(32)
  crypto.getRandomValues(seed)

  printInfo(`Seed length: ${seed.length} bytes (256 bits)`)
  printInfo(`Seed bytes: ${formatBytes(seed, 16)}`)
  printInfo(`Seed hex: ${formatHex(seed)}`)

  // Step 2: Convert seed to mnemonic
  printStep(2, 'Convert Seed to 25-Word Mnemonic')

  const mnemonic = mnemonicFromSeed(seed)
  const words = mnemonic.split(' ')

  printInfo(`Total words: ${words.length}`)
  printInfo(`Data words: 24 (encoding 256 bits of seed data)`)
  printInfo(`Checksum word: 1 (derived from SHA-512/256 hash of seed)`)

  // Step 3: Display the 25 words
  printStep(3, 'Display the Mnemonic Words')

  printInfo('Mnemonic words:')
  // Display words in rows of 5 for readability
  for (let i = 0; i < words.length; i += 5) {
    const row = words.slice(i, i + 5)
    const numbered = row.map((w, j) => `${(i + j + 1).toString().padStart(2, ' ')}. ${w.padEnd(10)}`).join(' ')
    printInfo(`  ${numbered}`)
  }

  // Step 4: Explain the 11-bit encoding scheme
  printStep(4, 'Explain the 11-bit Encoding Scheme')

  printInfo('How seed bits map to mnemonic words:')
  printInfo('  - Seed: 32 bytes = 256 bits')
  printInfo('  - Each word encodes 11 bits (2^11 = 2048 possible words)')
  printInfo('  - 256 bits / 11 bits per word = 23.27 words')
  printInfo('  - This rounds up to 24 words (with 8 padding bits)')
  printInfo('  - 24 words × 11 bits = 264 bits total')
  printInfo('  - Extra 8 bits are zero-padded')
  printInfo('')
  printInfo('Checksum word calculation:')
  printInfo('  - Compute SHA-512/256 hash of the 32-byte seed')
  printInfo('  - Take the first 11 bits of the hash')
  printInfo('  - Map those 11 bits to a word from the wordlist')
  printInfo('  - This becomes the 25th (checksum) word')

  // Step 5: Verify determinism
  printStep(5, 'Verify Determinism - Same Seed Produces Same Mnemonic')

  const mnemonic1 = mnemonicFromSeed(seed)
  const mnemonic2 = mnemonicFromSeed(seed)

  printInfo(`First call result:`)
  printInfo(`  "${mnemonic1.split(' ').slice(0, 5).join(' ')}..."`)
  printInfo(`Second call result:`)
  printInfo(`  "${mnemonic2.split(' ').slice(0, 5).join(' ')}..."`)

  const isIdentical = mnemonic1 === mnemonic2
  printInfo(`Mnemonics identical: ${isIdentical ? 'Yes' : 'No'}`)

  if (isIdentical) {
    printSuccess('Determinism verified: same seed always produces same mnemonic')
  }

  // Step 6: Show a second random seed for comparison
  printStep(6, 'Different Seed Produces Different Mnemonic')

  const seed2 = new Uint8Array(32)
  crypto.getRandomValues(seed2)
  const mnemonic3 = mnemonicFromSeed(seed2)

  printInfo(`Seed 1 (first 8 bytes): ${formatHex(seed.slice(0, 8))}...`)
  printInfo(`Seed 2 (first 8 bytes): ${formatHex(seed2.slice(0, 8))}...`)
  printInfo('')
  printInfo(`Mnemonic 1 (first 3 words): ${mnemonic1.split(' ').slice(0, 3).join(' ')}...`)
  printInfo(`Mnemonic 2 (first 3 words): ${mnemonic3.split(' ').slice(0, 3).join(' ')}...`)

  const isDifferent = mnemonic1 !== mnemonic3
  printInfo(`Mnemonics different: ${isDifferent ? 'Yes' : 'No'}`)

  // Summary
  printStep(7, 'Summary')

  printInfo('mnemonicFromSeed() converts a 32-byte seed to a 25-word mnemonic:')
  printInfo('  - Input: 32-byte Uint8Array (cryptographically random seed)')
  printInfo('  - Output: Space-separated string of 25 words')
  printInfo('  - Words 1-24: Encode the 256-bit seed (11 bits per word)')
  printInfo('  - Word 25: Checksum derived from SHA-512/256 hash')
  printInfo('  - Deterministic: reproducible from the same seed')
  printInfo('  - BIP39-compatible wordlist: 2048 English words')

  printSuccess('Mnemonic from Seed example completed successfully!')
}

main()
