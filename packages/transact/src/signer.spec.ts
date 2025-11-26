import { describe, expect, test } from 'vitest'
import nacl from 'tweetnacl'
import { generateSigners } from './signer'

describe('signer', () => {
  test('generateSigners', async () => {
    const keypair = nacl.sign.keyPair()
    const rawSigner = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
      return nacl.sign.detached(bytesToSign, keypair.secretKey)
    }

    const addressWithSigners = generateSigners(keypair.publicKey, rawSigner)

    expect(addressWithSigners.addr.publicKey).toEqual(keypair.publicKey)
    expect(addressWithSigners.signer).toBeDefined()
    expect(addressWithSigners.lsigSigner).toBeDefined()
    expect(addressWithSigners.programDataSigner).toBeDefined()
  })
})
