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
