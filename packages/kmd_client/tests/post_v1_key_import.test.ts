import { randomBytes } from 'crypto'
import nacl from 'tweetnacl'
import { describe, expect, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig } from './config'
import { getWalletHandle, publicKeyToAddress, releaseWalletHandle } from './fixtures'
import { ImportKeyResponse } from './schemas'

describe('POST v1_key_import', () => {
  // Polytest Suite: POST v1_key_import

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate a random ed25519 keypair
        const seed = randomBytes(32)
        const keyPair = nacl.sign.keyPair.fromSeed(seed)

        const result = await client.importKey({
          walletHandleToken,
          privateKey: keyPair.secretKey,
        })

        ImportKeyResponse.parse(result)

        // Verify the imported key's address matches the public key
        const expectedAddress = publicKeyToAddress(keyPair.publicKey)
        expect(result.address.toString()).toBe(expectedAddress)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})
