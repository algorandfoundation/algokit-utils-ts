import * as ed from '@noble/ed25519'
import sha512 from 'js-sha512'
import { BIP32DerivationType, fromSeed, KeyContext, XHDWalletAPI, harden } from '@algorandfoundation/xhd-wallet-api'

export type RawEd25519Verifier = (signature: Uint8Array, message: Uint8Array, pubkey: Uint8Array) => Promise<boolean>

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

export type RawEd25519Signer = (bytesToSign: Uint8Array) => Promise<Uint8Array>
export type Ed25519Generator = (seed?: Uint8Array) => {
  ed25519Pubkey: Uint8Array
  ed25519SecretKey: Uint8Array
  rawEd25519Signer: RawEd25519Signer
}

ed.hashes.sha512 = (msg: ed.Bytes) => new Uint8Array(sha512.sha512.digest(msg))

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

const xhd = new XHDWalletAPI()
export type BIP44Path = [number, number, number, number, number]

export type RawHdWalletSigner = (bytesToSign: Uint8Array, bip44Path: BIP44Path) => Promise<Uint8Array>

export type HdWalletGenerator = (seed?: Uint8Array) => Promise<{
  hdRootKey: Uint8Array
  rawHdSigner: RawHdWalletSigner
}>

const verifyPath = (bip44Path: BIP44Path) => {
  if (bip44Path.length !== 5) {
    throw new Error('BIP44 path must have exactly 5 elements')
  }
  if (bip44Path[0] !== harden(44)) {
    throw new Error("BIP44 path must start with 44'")
  }
  if (bip44Path[1] !== harden(283)) {
    throw new Error("BIP44 path must have hardened coin type 283' for Algorand")
  }
}

const getPathComponents = (bip44Path: BIP44Path) => {
  const account = bip44Path[2]
  const index = bip44Path[4]
  return { account, index }
}

export const peikertXHdWalletGenerator: HdWalletGenerator = async (seed?: Uint8Array) => {
  const seedArray = seed ?? new Uint8Array(32)
  const newSeedBytes = new Uint8Array(32)
  if (seed === undefined) {
    crypto.getRandomValues(newSeedBytes)
  }

  const rootKey = fromSeed(Buffer.from(seed === undefined ? newSeedBytes : seedArray))

  const rawHdSigner: RawHdWalletSigner = async (bytesToSign: Uint8Array, bip44Path: BIP44Path): Promise<Uint8Array> => {
    verifyPath(bip44Path)
    const { account, index } = getPathComponents(bip44Path)

    return xhd.signAlgoTransaction(rootKey, KeyContext.Address, account, index, bytesToSign, BIP32DerivationType.Peikert)
  }

  return { hdRootKey: rootKey, rawHdSigner }
}

export type HdAccountGenerator = (
  rootKey: Uint8Array,
  account: number,
  index: number,
) => Promise<{
  ed25519Pubkey: Uint8Array
  bip44Path: BIP44Path
  rawEd25519Signer: RawEd25519Signer
}>

export const peikertXHdAccountGenerator: HdAccountGenerator = async (rootKey: Uint8Array, account: number, index: number) => {
  const ed25519Pubkey = await xhd.keyGen(rootKey, KeyContext.Address, account, index, BIP32DerivationType.Peikert)

  const rawEd25519Signer: RawEd25519Signer = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
    return xhd.signAlgoTransaction(rootKey, KeyContext.Address, account, index, bytesToSign, BIP32DerivationType.Peikert)
  }

  const bip44Path: BIP44Path = [harden(44), harden(283), harden(account), 0, index]

  return { ed25519Pubkey, rawEd25519Signer, bip44Path }
}
