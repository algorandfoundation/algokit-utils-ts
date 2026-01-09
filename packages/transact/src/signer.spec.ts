import { describe, expect, test } from 'vitest'
import * as nacl from 'tweetnacl'
import * as ed from '@noble/ed25519'
import { generateAddressWithSigners } from './signer'
import { nobleEd25519Generator, peikertXHdAccountGenerator, peikertXHdWalletGenerator } from '@algorandfoundation/algokit-crypto'

describe('signer', () => {
  test('generateSigners with tweetnacl', async () => {
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

  test('generateSigners with @noble/ed25519', async () => {
    const privateKey = ed.utils.randomSecretKey()
    const publicKey = await ed.getPublicKeyAsync(privateKey)
    const rawSigner = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
      return ed.signAsync(bytesToSign, privateKey)
    }

    const addressWithSigners = generateAddressWithSigners({ ed25519Pubkey: publicKey, rawEd25519Signer: rawSigner })

    expect(addressWithSigners.addr.publicKey).toEqual(publicKey)
    expect(addressWithSigners.signer).toBeDefined()
    expect(addressWithSigners.lsigSigner).toBeDefined()
    expect(addressWithSigners.programDataSigner).toBeDefined()
    expect(addressWithSigners.mxBytesSigner).toBeDefined()
  })

  test('generateSigners with nobleEd25519Generator', async () => {
    const generated = nobleEd25519Generator()

    const addressWithSigners = generateAddressWithSigners(generated)

    expect(addressWithSigners.addr.publicKey).toEqual(generated.ed25519Pubkey)
    expect(addressWithSigners.signer).toBeDefined()
    expect(addressWithSigners.lsigSigner).toBeDefined()
    expect(addressWithSigners.programDataSigner).toBeDefined()
    expect(addressWithSigners.mxBytesSigner).toBeDefined()
  })

  test('generateSigners with peikertXHdAccountGenerator', async () => {
    const { hdRootKey } = await peikertXHdWalletGenerator()
    const generated = await peikertXHdAccountGenerator(hdRootKey, 0, 0)

    const addressWithSigners = generateAddressWithSigners(generated)

    expect(addressWithSigners.addr.publicKey).toEqual(generated.ed25519Pubkey)
    expect(addressWithSigners.signer).toBeDefined()
    expect(addressWithSigners.lsigSigner).toBeDefined()
    expect(addressWithSigners.programDataSigner).toBeDefined()
    expect(addressWithSigners.mxBytesSigner).toBeDefined()
  })
})
