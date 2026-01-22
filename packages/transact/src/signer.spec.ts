import { describe, expect, test } from 'vitest'
import nacl from 'tweetnacl'
import { generateAddressWithSigners } from './signer'

describe('signer', () => {
  test('generateSigners', async () => {
    // #region example-generateAddressWithSigners
    // Generate signers from an ed25519 keypair
    const keypair = nacl.sign.keyPair()

    // Create a raw signing callback
    const rawSigner = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
      return nacl.sign.detached(bytesToSign, keypair.secretKey)
    }

    // Generate all signer types from the keypair
    const addressWithSigners = generateAddressWithSigners({
      ed25519Pubkey: keypair.publicKey,
      rawEd25519Signer: rawSigner,
    })

    // Access the address and various signers
    const address = addressWithSigners.addr
    const transactionSigner = addressWithSigners.signer
    // #endregion example-generateAddressWithSigners

    expect(address.publicKey).toEqual(keypair.publicKey)
    expect(transactionSigner).toBeDefined()
    expect(addressWithSigners.lsigSigner).toBeDefined()
    expect(addressWithSigners.programDataSigner).toBeDefined()
    expect(addressWithSigners.mxBytesSigner).toBeDefined()
  })
})
