import { describe, expect, test } from 'vitest'
import nacl from 'tweetnacl'
import { generateAddressWithSigners } from './signer'

describe('signer', () => {
  test('generateSigners', async () => {
    const keypair = nacl.sign.keyPair()
    const rawSigner = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
      return nacl.sign.detached(bytesToSign, keypair.secretKey)
    }

    const addressWithSigners = generateAddressWithSigners({ ed25519Pubkey: keypair.publicKey, rawEd25519Signer: rawSigner })

    expect(addressWithSigners.addr.publicKey).toEqual(keypair.publicKey)
    expect(addressWithSigners.signer).toBeDefined()
    expect(addressWithSigners.lsigSigner).toBeDefined()
    expect(addressWithSigners.programDataSigner).toBeDefined()
    expect(addressWithSigners.mxBytesSigner).toBeDefined()
  })
})
