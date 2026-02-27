import { Ed25519SigningKey, WrappedEd25519Seed } from './ed25519'
import * as ed from '@noble/ed25519'
import { WrappedHdExtendedPrivateKey, WrappedHdScalarAndPrefix } from './hd'
import { ed25519 } from '@noble/curves/ed25519.js'
import { sha512 } from '@noble/hashes/sha2.js'
import { bytesToNumberLE, numberToBytesLE } from '@noble/curves/utils.js'
import { mod } from '@noble/curves/abstract/modular.js'

export * from './ed25519'
export * from './hash'
export * from './hd'

export type WrappedEd25519Secret = WrappedEd25519Seed | WrappedHdScalarAndPrefix | WrappedHdExtendedPrivateKey

const ED25519_SEED_LENGTH = 32
const ED25519_SCALAR_AND_PREFIX_LENGTH = 64
const ED25519_EXTENDED_PRIVATE_KEY_LENGTH = 96

const assertEd25519SecretLength = (secret: Uint8Array, secretType: 'seed' | 'scalar || prefix' | 'extended'): void => {
  let expectedLength: number
  switch (secretType) {
    case 'seed':
      expectedLength = ED25519_SEED_LENGTH
      break
    case 'scalar || prefix':
      expectedLength = ED25519_SCALAR_AND_PREFIX_LENGTH
      break
    case 'extended':
      expectedLength = ED25519_EXTENDED_PRIVATE_KEY_LENGTH
      break
    default:
      throw new Error(`Unknown secret type: ${secretType}`)
  }

  if (secret.length !== expectedLength) {
    throw new Error(`Expected unwrapped Ed25519 ${secretType} to be ${expectedLength} bytes, got ${secret.length}.`)
  }
}

const throwWrapUnwrapErrors = (operationError: unknown, wrapError: unknown, operationName: string): never => {
  throw new AggregateError(
    [operationError, wrapError],
    `${operationName} failed and failed to re-wrap Ed25519 secret. Check both errors for details.`,
  )
}

function rawSign(extendedSecretKey: Uint8Array, data: Uint8Array): Uint8Array {
  const scalar = bytesToNumberLE(extendedSecretKey.slice(0, 32))

  const kR = extendedSecretKey.slice(32, 64)

  // (1): pubKey = scalar * G
  const publicKey = rawPubkey(extendedSecretKey)

  // (2): h = hash(kR || msg) mod q
  const rHash = sha512(new Uint8Array([...kR, ...data]))
  const r = mod(bytesToNumberLE(rHash), ed25519.Point.Fn.ORDER)

  // (4): R = r * G
  const R = ed25519.Point.BASE.multiply(r)

  // h = hash(R || pubKey || msg) mod q
  const hHash = sha512(new Uint8Array([...R.toBytes(), ...publicKey, ...data]))
  const h = mod(bytesToNumberLE(hHash), ed25519.Point.Fn.ORDER)

  // (5): S = (r + h * k) mod q
  const S = mod(r + h * scalar, ed25519.Point.Fn.ORDER)

  return new Uint8Array([...R.toBytes(), ...numberToBytesLE(S, 32)])
}

function rawPubkey(extendedSecretKey: Uint8Array): Uint8Array {
  const scalar = bytesToNumberLE(extendedSecretKey.slice(0, 32))
  const clearedTopBitScalar = scalar & ((1n << 255n) - 1n)
  const reducedScalar = mod(clearedTopBitScalar, ed25519.Point.Fn.ORDER)

  // pubKey = scalar * G
  const publicKey = ed25519.Point.BASE.multiply(reducedScalar)
  return publicKey.toBytes()
}

/**
 * Creates an Ed25519 signing key from a wrapped secret using the @noble/ed25519 implementation.
 *
 * NOTE: This function will zero out the unwrapped secret after the wrap function is called.
 *
 * @param wrapUnwrap - The wrapped secret provider that unwraps and re-wraps the Ed25519 secret.
 * @returns A promise that resolves to an Ed25519 signing key containing the public key and raw signer.
 */
export const nobleEd25519SigningKeyFromWrappedSecret = async (wrapUnwrap: WrappedEd25519Secret): Promise<Ed25519SigningKey> => {
  let wrapFunction: () => Promise<void>
  if ('wrapEd25519Seed' in wrapUnwrap) {
    wrapFunction = wrapUnwrap.wrapEd25519Seed
  } else if ('wrapHdScalarAndPrefix' in wrapUnwrap) {
    wrapFunction = wrapUnwrap.wrapHdScalarAndPrefix
  } else if ('wrapHdExtendedPrivateKey' in wrapUnwrap) {
    wrapFunction = wrapUnwrap.wrapHdExtendedPrivateKey
  } else {
    throw new Error('Invalid WrappedEd25519Secret: missing wrap function')
  }

  const signer = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
    let secret: Uint8Array | undefined = undefined
    let signature: Uint8Array | undefined = undefined
    let signingError: unknown
    let wrapError: unknown
    try {
      if ('unwrapEd25519Seed' in wrapUnwrap) {
        secret = await wrapUnwrap.unwrapEd25519Seed()
        assertEd25519SecretLength(secret, 'seed')
        signature = await ed.signAsync(bytesToSign, secret)
      } else if ('unwrapHdScalarAndPrefix' in wrapUnwrap) {
        secret = await wrapUnwrap.unwrapHdScalarAndPrefix()
        assertEd25519SecretLength(secret, 'scalar || prefix')
        signature = rawSign(secret, bytesToSign)
      } else if ('unwrapHdExtendedPrivateKey' in wrapUnwrap) {
        secret = await wrapUnwrap.unwrapHdExtendedPrivateKey()
        assertEd25519SecretLength(secret, 'extended')
        signature = rawSign(secret.slice(0, 64), bytesToSign)
      } else {
        throw new Error('Invalid WrappedEd25519Secret: missing unwrap function')
      }
    } catch (error) {
      signingError = error
    } finally {
      try {
        await wrapFunction()
      } catch (error) {
        wrapError = error
      } finally {
        secret?.fill(0)
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

    if (signature === undefined) {
      throw new Error('Signing failed unexpectedly without an error.')
    }

    return signature
  }

  let pubkey: Uint8Array | undefined = undefined
  let pubkeyError: unknown
  let wrapError: unknown
  let secret: Uint8Array | undefined = undefined
  try {
    if ('unwrapEd25519Seed' in wrapUnwrap) {
      secret = await wrapUnwrap.unwrapEd25519Seed()
      assertEd25519SecretLength(secret, 'seed')
      pubkey = await ed.getPublicKeyAsync(secret)
    } else if ('unwrapHdScalarAndPrefix' in wrapUnwrap) {
      secret = await wrapUnwrap.unwrapHdScalarAndPrefix()
      assertEd25519SecretLength(secret, 'scalar || prefix')
      pubkey = rawPubkey(secret)
    } else if ('unwrapHdExtendedPrivateKey' in wrapUnwrap) {
      secret = await wrapUnwrap.unwrapHdExtendedPrivateKey()
      assertEd25519SecretLength(secret, 'extended')
      pubkey = rawPubkey(secret.slice(0, 64))
    } else {
      throw new Error('Invalid WrappedEd25519Secret: missing unwrap function')
    }
  } catch (error) {
    pubkeyError = error
  } finally {
    try {
      await wrapFunction()
    } catch (error) {
      wrapError = error
    } finally {
      secret?.fill(0)
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

  if (pubkey === undefined) {
    throw new Error('Deriving Ed25519 public key failed unexpectedly without an error.')
  }

  return {
    ed25519Pubkey: pubkey,
    rawEd25519Signer: signer,
  }
}

/**
 * Creates an ed25519 signing key from a wrapped secret using the default ed25519 implementation (currently @noble/ed25519).
 * The implementation may change in the future. To explicitly use the @noble/ed25519 implementation, use `nobleEd25519SigningKeyFromWrappedSecret`.
 *
 * NOTE: This function will zero out the unwrapped secret after the wrap function is called.
 *
 * @param wrapUnwrap - The wrapped secret provider that unwraps and re-wraps the ed25519 secret.
 * @returns A promise that resolves to an ed25519 signing key with public key and raw signer.
 */
export const ed25519SigningKeyFromWrappedSecret = nobleEd25519SigningKeyFromWrappedSecret
