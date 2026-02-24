import * as ed from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha2.js'

export type RawEd25519Verifier = (signature: Uint8Array, message: Uint8Array, pubkey: Uint8Array) => Promise<boolean>
export type RawEd25519Signer = (bytesToSign: Uint8Array) => Promise<Uint8Array>
export type Ed25519Generator = (seed?: Uint8Array) => {
  ed25519Pubkey: Uint8Array
  ed25519SecretKey: Uint8Array
  rawEd25519Signer: RawEd25519Signer
}

/**
 * Verifies an ed25519 signature using the @noble/ed25519 implementation.
 *
 * @param message - The original message that was signed.
 * @param signature - The ed25519 signature to verify.
 * @returns A promise that resolves to true if the signature is valid, false otherwise.
 */
export const nobleEd25519Verifier: RawEd25519Verifier = async (
  signature: Uint8Array,
  message: Uint8Array,
  pubkey: Uint8Array,
): Promise<boolean> => {
  return ed.verifyAsync(signature, message, pubkey)
}

/**
 * Verifies an ed25519 signature using the default ed25519 implementation (currently @noble/ed25519).
 * The implementation may change in the future. To explicitly use the @noble/ed25519 implementation, use `nobleEd25519Verifier`.
 *
 * @param message - The original message that was signed.
 * @param signature - The ed25519 signature to verify.
 * @returns A promise that resolves to true if the signature is valid, false otherwise.
 */
export const ed25519Verifier: RawEd25519Verifier = nobleEd25519Verifier

ed.hashes.sha512 = (msg: ed.Bytes) => sha512(msg)

/**
 * Generates an ed25519 keypair and a raw signer function using the @noble/ed25519 implementation.
 *
 * @param seed - Optional seed for key generation. If not provided, a random seed will be used.
 * @returns An object containing the ed25519 public key, secret key, and a raw signer function.
 */
export const nobleEd25519Generator: Ed25519Generator = (seed?: Uint8Array) => {
  const ed25519SecretKey = ed.utils.randomSecretKey(seed)
  const ed25519Pubkey = ed.getPublicKey(ed25519SecretKey)

  const rawEd25519Signer: RawEd25519Signer = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
    return ed.signAsync(bytesToSign, ed25519SecretKey)
  }

  return { ed25519Pubkey, ed25519SecretKey, rawEd25519Signer }
}

/**
 * Generates an ed25519 keypair and a raw signer function using the default ed25519 implementation (currently @noble/ed25519).
 * The implementation may change in the future. To explicitly use the @noble/ed25519 implementation, use `nobleEd25519Generator`.
 *
 * @param seed - Optional seed for key generation. If not provided, a random seed will be used.
 * @returns An object containing the ed25519 public key, secret key, and a raw signer function.
 */
export const ed25519Generator: Ed25519Generator = nobleEd25519Generator

const ED25519_SEED_LENGTH = 32

const assertEd25519SeedLength = (seed: Uint8Array): void => {
  if (seed.length !== ED25519_SEED_LENGTH) {
    throw new Error(`Expected unwrapped Ed25519 seed to be ${ED25519_SEED_LENGTH} bytes, got ${seed.length}.`)
  }
}

const throwWrapUnwrapErrors = (operationError: unknown, wrapError: unknown, operationName: string): never => {
  throw new AggregateError(
    [operationError, wrapError],
    `${operationName} failed and failed to re-wrap Ed25519 seed. Check both errors for details.`,
  )
}

export type Ed25519SigningKey = {
  ed25519Pubkey: Uint8Array
  rawEd25519Signer: RawEd25519Signer
}

/**
 * Represents an Ed25519 seed that can be unwrapped for short-lived use and then re-wrapped.
 */
export type WrappedEd25519Seed = {
  /**
   * Unwraps and returns the 32-byte Ed25519 seed.
   */
  unwrapEd25519Seed: () => Promise<Uint8Array>
  /**
   * Re-wraps the Ed25519 seed after use.
   */
  wrapEd25519Seed: () => Promise<void>
}

/**
 * Creates an Ed25519 signing key from a wrapped seed using the @noble/ed25519 implementation.
 *
 * NOTE: This function will zero out the seed after the wrap function is called
 *
 * @param wrapUnwrap - The wrapped seed provider that unwraps and re-wraps the Ed25519 seed.
 * @returns A promise that resolves to an Ed25519 signing key containing the public key and raw signer.
 */
export const nobleEd25519SigningKeyFromWrappedSeed = async (wrapUnwrap: WrappedEd25519Seed): Promise<Ed25519SigningKey> => {
  const signer = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
    let seed: Uint8Array | undefined = undefined
    let signature!: Uint8Array
    let signingError: unknown
    let wrapError: unknown
    try {
      seed = await wrapUnwrap.unwrapEd25519Seed()
      assertEd25519SeedLength(seed)
      signature = await ed.signAsync(bytesToSign, seed)
    } catch (error) {
      signingError = error
    } finally {
      try {
        await wrapUnwrap.wrapEd25519Seed()
      } catch (error) {
        wrapError = error
      } finally {
        seed?.fill(0)
      }
    }

    if (signingError !== undefined && wrapError !== undefined) {
      throwWrapUnwrapErrors(signingError, wrapError, 'Signing')
    }

    if (signingError !== undefined) {
      throw signingError
    }

    if (wrapError !== undefined) {
      throw wrapError
    }

    return signature
  }

  let pubkey!: Uint8Array
  let pubkeyError: unknown
  let wrapError: unknown
  let seed: Uint8Array | undefined = undefined
  try {
    seed = await wrapUnwrap.unwrapEd25519Seed()
    assertEd25519SeedLength(seed)
    pubkey = await ed.getPublicKeyAsync(seed)
  } catch (error) {
    pubkeyError = error
  } finally {
    try {
      await wrapUnwrap.wrapEd25519Seed()
    } catch (error) {
      wrapError = error
    } finally {
      seed?.fill(0)
    }
  }

  if (pubkeyError !== undefined && wrapError !== undefined) {
    throwWrapUnwrapErrors(pubkeyError, wrapError, 'Deriving Ed25519 public key')
  }

  if (pubkeyError !== undefined) {
    throw pubkeyError
  }

  if (wrapError !== undefined) {
    throw wrapError
  }

  return {
    ed25519Pubkey: pubkey,
    rawEd25519Signer: signer,
  }
}

/**
 * Creates an ed25519 signing key from a wrapped seed using the default ed25519 implementation (currently @noble/ed25519).
 * The implementation may change in the future. To explicitly use the @noble/ed25519 implementation, use `nobleEd25519SigningKeyFromWrappedSeed`.
 *
 * NOTE: This function will zero out the seed after the wrap function is called
 *
 * @param wrapUnwrap - The wrapped seed provider that unwraps and re-wraps the ed25519 seed.
 * @returns A promise that resolves to an ed25519 signing key with public key and raw signer.
 */
export const ed25519SigningKeyFromWrappedSeed = nobleEd25519SigningKeyFromWrappedSeed
