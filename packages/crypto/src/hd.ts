import { BIP32DerivationType, fromSeed, KeyContext, XHDWalletAPI, harden } from '@algorandfoundation/xhd-wallet-api'
import { RawEd25519Signer } from './ed25519'
import { ed25519 } from '@noble/curves/ed25519.js'
import { sha512 } from '@noble/hashes/sha2.js'
export type BIP44Path = [number, number, number, number, number]
import { bytesToNumberLE, numberToBytesLE } from '@noble/curves/utils.js'
import { mod } from '@noble/curves/abstract/modular.js'

export type HdWalletGenerator = (seed?: Uint8Array) => Promise<{
  hdRootKey: Uint8Array
  accountGenerator: HdAccountGenerator
}>

export type HdAccountGenerator = (
  account: number,
  index: number,
) => Promise<{
  /** The ed25519 public key corresponding to the generated account and index. */
  ed25519Pubkey: Uint8Array
  /** The extended ed25519 private key (96 bytes for scalar + prefix + chain code) corresponding to the generated account and index. */
  extendedPrivateKey: Uint8Array
  /** The BIP44 path used to derive the key for the generated account and index. */
  bip44Path: BIP44Path
  /** A signer function that can sign bytes using the ed25519 secret key corresponding to the generated account and index. */
  rawEd25519Signer: RawEd25519Signer
}>

const xhd = new XHDWalletAPI()

export const peikertXHdWalletGenerator: HdWalletGenerator = async (seed?: Uint8Array) => {
  const seedArray = seed ?? new Uint8Array(32)
  if (seed === undefined) {
    crypto.getRandomValues(seedArray)
  }

  const rootKey = fromSeed(Buffer.from(seedArray))

  const accountGenerator: HdAccountGenerator = async (account: number, index: number) => {
    const ed25519Pubkey = await xhd.keyGen(rootKey, KeyContext.Address, account, index, BIP32DerivationType.Peikert)

    const rawEd25519Signer: RawEd25519Signer = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
      return xhd.signAlgoTransaction(rootKey, KeyContext.Address, account, index, bytesToSign, BIP32DerivationType.Peikert)
    }

    const bip44Path: BIP44Path = [harden(44), harden(283), harden(account), 0, index]

    const xPrv = await xhd.deriveKey(rootKey, bip44Path, true, BIP32DerivationType.Peikert)

    return { ed25519Pubkey, rawEd25519Signer, bip44Path, extendedPrivateKey: xPrv }
  }

  return { hdRootKey: rootKey, accountGenerator }
}

// TODO: This function should be exposed from HD lib, but for now we have it in AK
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

export function recoverDerivedKeypair(extendedSecretKey: Uint8Array): {
  ed25519Pubkey: Uint8Array
  rawEd25519Signer: RawEd25519Signer
} {
  const ed25519Pubkey = rawPubkey(extendedSecretKey)

  const rawEd25519Signer: RawEd25519Signer = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
    return rawSign(extendedSecretKey, bytesToSign)
  }

  return { ed25519Pubkey, rawEd25519Signer }
}
