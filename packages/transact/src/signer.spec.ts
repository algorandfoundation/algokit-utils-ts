import { describe, expect, test } from 'vitest'
import nacl from 'tweetnacl'
import * as ed from '@noble/ed25519'
import { AddressWithSigners, bytesForSigning, generateAddressWithSigners } from './signer'
import {
  ed25519Generator,
  ed25519Verifier,
  nobleEd25519Generator,
  nobleEd25519SigningKeyFromWrappedSecret,
  nobleEd25519Verifier,
  peikertXHdWalletGenerator,
} from '@algorandfoundation/algokit-crypto'
import { LogicSig, LogicSigAccount } from './logicsig'
import { Transaction } from './transactions/transaction'
import { TransactionType } from './transactions/transaction-type'
import { decodeSignedTransaction } from './transactions/signed-transaction'

const lsig = new LogicSig(new Uint8Array([1, 2, 3, 4, 5]))
const txn = new Transaction({
  type: TransactionType.Payment,
  sender: lsig.address(),
  firstValid: 1n,
  lastValid: 1000n,
})

async function runTests(addressWithSigners: AddressWithSigners, expectedPubkey: Uint8Array) {
  const { addr, lsigSigner, signer, programDataSigner, mxBytesSigner } = addressWithSigners

  expect(addr.publicKey).toEqual(expectedPubkey)
  expect(ed25519Verifier).toEqual(nobleEd25519Verifier)

  const stxns = await signer([txn], [0])
  const sig = decodeSignedTransaction(stxns[0]).sig
  expect(await ed25519Verifier(sig!, bytesForSigning.transaction(txn), addr.publicKey)).toBe(true)

  const lsigAccount = new LogicSigAccount(lsig.logic, [], addr)
  const lsigSignResult = (await lsigSigner(lsigAccount)) as { sig: Uint8Array }
  expect(await ed25519Verifier(lsigSignResult.sig, bytesForSigning.lsigForDelegation(lsig), addr.publicKey)).toBe(true)

  const programData = new Uint8Array([10, 20, 30])
  const programDataSig = await programDataSigner(programData, lsig)
  expect(await ed25519Verifier(programDataSig, bytesForSigning.programData(lsig, programData), addr.publicKey)).toBe(true)

  const mxBytes = new Uint8Array([5, 4, 3, 2, 1])
  const mxBytesSig = await mxBytesSigner(mxBytes)
  expect(await ed25519Verifier(mxBytesSig, bytesForSigning.mxBytes(mxBytes), addr.publicKey)).toBe(true)
}

describe('signer', () => {
  test('generateSigners with tweetnacl', async () => {
    const keypair = nacl.sign.keyPair()
    const rawSigner = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
      return nacl.sign.detached(bytesToSign, keypair.secretKey)
    }
    const addressWithSigners = generateAddressWithSigners({ ed25519Pubkey: keypair.publicKey, rawEd25519Signer: rawSigner })

    await runTests(addressWithSigners, keypair.publicKey)
  })

  test('generateSigners with @noble/ed25519', async () => {
    const privateKey = ed.utils.randomSecretKey()
    const publicKey = await ed.getPublicKeyAsync(privateKey)
    const rawSigner = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
      return ed.signAsync(bytesToSign, privateKey)
    }
    const addressWithSigners = generateAddressWithSigners({ ed25519Pubkey: publicKey, rawEd25519Signer: rawSigner })

    await runTests(addressWithSigners, publicKey)
  })

  test('generateSigners with nobleEd25519Generator', async () => {
    expect(ed25519Generator).toEqual(nobleEd25519Generator)

    const generated = ed25519Generator()
    const addressWithSigners = generateAddressWithSigners(generated)

    await runTests(addressWithSigners, generated.ed25519Pubkey)
  })

  test('generateSigners with peikertXHdAccountGenerator', async () => {
    const { accountGenerator } = await peikertXHdWalletGenerator()
    const generated = await accountGenerator(0, 0)
    const addressWithSigners = generateAddressWithSigners(generated)

    await runTests(addressWithSigners, generated.ed25519Pubkey)
  })

  test('full example xHD mx bytes flow', async () => {
    // Generate a new wallet with rootkey and account generator
    const { accountGenerator } = await peikertXHdWalletGenerator() // peikertXHdWalletGenerator from algokit-crypto

    // Generate an account at BIP44 path m/44'/283'/0'/0/0
    const generated = await accountGenerator(0, 0) // accountGenerator from peikertXHdWalletGenerator result

    // Generate Algorand-specific signing functions
    const addressWithSigners = generateAddressWithSigners(generated) // generateAddressWithSigners from algokit-transact

    const message = new TextEncoder().encode('Hello, Algorand!')

    // Sign the message
    const mxBytesSig = await addressWithSigners.mxBytesSigner(message)

    // Get the bytes that were actually signed
    const signedBytes = bytesForSigning.mxBytes(message) // bytesForSigning from algokit-transact

    // Verify the signature
    const isValid = await ed25519Verifier(mxBytesSig, signedBytes, addressWithSigners.addr.publicKey)
    expect(isValid).toBe(true)

    // Demonstrate it is not a raw signature
    const isRawValid = await ed25519Verifier(mxBytesSig, message, addressWithSigners.addr.publicKey)
    expect(isRawValid).toBe(false)
  })

  test('addr with signers from wrapped seed', async () => {
    const seed = ed.utils.randomSecretKey()
    const wrappedSeed = {
      unwrapEd25519Seed: async () => new Uint8Array(seed),
      wrapEd25519Seed: async () => {},
    }
    const signingKey = await nobleEd25519SigningKeyFromWrappedSecret(wrappedSeed)
    const addressWithSigners = generateAddressWithSigners(signingKey)

    await runTests(addressWithSigners, signingKey.ed25519Pubkey)
  })

  test('addr with signers from wrapped scalar || prefix', async () => {
    const { accountGenerator } = await peikertXHdWalletGenerator()
    const generated = await accountGenerator(0, 0)
    const wrappedScalarAndPrefix = {
      unwrapHdScalarAndPrefix: async () => new Uint8Array(generated.extendedPrivateKey.slice(0, 64)),
      wrapHdScalarAndPrefix: async () => {},
    }
    const signingKey = await nobleEd25519SigningKeyFromWrappedSecret(wrappedScalarAndPrefix)
    const addressWithSigners = generateAddressWithSigners(signingKey)

    await runTests(addressWithSigners, signingKey.ed25519Pubkey)
  })

  test('addr with signers from wrapped extended private key', async () => {
    const { accountGenerator } = await peikertXHdWalletGenerator()
    const generated = await accountGenerator(0, 0)
    const wrappedExtendedPrivateKey = {
      unwrapHdExtendedPrivateKey: async () => new Uint8Array(generated.extendedPrivateKey),
      wrapHdExtendedPrivateKey: async () => {},
    }
    const signingKey = await nobleEd25519SigningKeyFromWrappedSecret(wrappedExtendedPrivateKey)
    const addressWithSigners = generateAddressWithSigners(signingKey)

    await runTests(addressWithSigners, signingKey.ed25519Pubkey)
  })

  test('wrapped seed rejects invalid seed length when deriving pubkey', async () => {
    const wrappedSeed = {
      unwrapEd25519Seed: async () => new Uint8Array(31),
      wrapEd25519Seed: async () => {},
    }

    await expect(nobleEd25519SigningKeyFromWrappedSecret(wrappedSeed)).rejects.toThrow(
      'Expected unwrapped Ed25519 seed to be 32 bytes, got 31.',
    )
  })

  test('wrapped seed rejects invalid seed length when signing', async () => {
    const seed = ed.utils.randomSecretKey()
    let unwrapCallCount = 0
    const wrappedSeed = {
      unwrapEd25519Seed: async () => {
        unwrapCallCount += 1
        return unwrapCallCount === 1 ? seed : new Uint8Array(31)
      },
      wrapEd25519Seed: async () => {},
    }
    const signingKey = await nobleEd25519SigningKeyFromWrappedSecret(wrappedSeed)

    await expect(signingKey.rawEd25519Signer(new Uint8Array([1, 2, 3]))).rejects.toThrow(
      'Expected unwrapped Ed25519 seed to be 32 bytes, got 31.',
    )
  })

  test('wrapped seed reports both pubkey and wrap failures', async () => {
    const wrappedSeed = {
      unwrapEd25519Seed: async () => {
        throw new Error('unwrap failed')
      },
      wrapEd25519Seed: async () => {
        throw new Error('wrap failed')
      },
    }

    await expect(nobleEd25519SigningKeyFromWrappedSecret(wrappedSeed)).rejects.toThrow(
      'Deriving Ed25519 public key failed and failed to re-wrap Ed25519 secret. Check both errors for details.',
    )
  })

  test('wrapped seed reports both signing and wrap failures', async () => {
    const seed = ed.utils.randomSecretKey()
    let unwrapShouldFail = false
    let wrapShouldFail = false
    const wrappedSeed = {
      unwrapEd25519Seed: async () => {
        if (unwrapShouldFail) {
          throw new Error('unwrap failed')
        }
        return seed
      },
      wrapEd25519Seed: async () => {
        if (wrapShouldFail) {
          throw new Error('wrap failed')
        }
      },
    }
    const signingKey = await nobleEd25519SigningKeyFromWrappedSecret(wrappedSeed)

    unwrapShouldFail = true
    wrapShouldFail = true
    await expect(signingKey.rawEd25519Signer(new Uint8Array([1, 2, 3]))).rejects.toThrow(
      'Signing failed and failed to re-wrap Ed25519 secret. Check both errors for details.',
    )
  })

  test('wrapped HD scalar and prefix rejects invalid length', async () => {
    const wrappedHdScalarAndPrefix = {
      unwrapHdScalarAndPrefix: async () => new Uint8Array(63),
      wrapHdScalarAndPrefix: async () => {},
    }

    await expect(nobleEd25519SigningKeyFromWrappedSecret(wrappedHdScalarAndPrefix)).rejects.toThrow(
      'Expected unwrapped Ed25519 scalar || prefix to be 64 bytes, got 63.',
    )
  })

  test('wrapped HD extended private key rejects invalid length', async () => {
    const wrappedHdExtendedPrivateKey = {
      unwrapHdExtendedPrivateKey: async () => new Uint8Array(95),
      wrapHdExtendedPrivateKey: async () => {},
    }

    await expect(nobleEd25519SigningKeyFromWrappedSecret(wrappedHdExtendedPrivateKey)).rejects.toThrow(
      'Expected unwrapped Ed25519 extended to be 96 bytes, got 95.',
    )
  })

  test('wrapped seed zeroes seed after successful signing', async () => {
    const seed = ed.utils.randomSecretKey()
    const wrappedSeed = {
      unwrapEd25519Seed: async () => seed,
      wrapEd25519Seed: async () => {},
    }

    const signingKey = await nobleEd25519SigningKeyFromWrappedSecret(wrappedSeed)
    await signingKey.rawEd25519Signer(new Uint8Array([10, 20, 30]))

    expect(Array.from(seed).every((byte) => byte === 0)).toBe(true)
  })

  test('wrapped seed zeroes seed after failed signing', async () => {
    const seed = ed.utils.randomSecretKey()
    let unwrapCallCount = 0
    let wrapCallCount = 0
    const wrappedSeed = {
      unwrapEd25519Seed: async () => {
        unwrapCallCount += 1
        return unwrapCallCount === 1 ? new Uint8Array(seed) : seed
      },
      wrapEd25519Seed: async () => {
        wrapCallCount += 1
        if (wrapCallCount > 1) {
          throw new Error('wrap failed')
        }
      },
    }

    const signingKey = await nobleEd25519SigningKeyFromWrappedSecret(wrappedSeed)
    await expect(signingKey.rawEd25519Signer(new Uint8Array([1, 2, 3]))).rejects.toThrow('wrap failed')

    expect(Array.from(seed).every((byte) => byte === 0)).toBe(true)
  })
})
