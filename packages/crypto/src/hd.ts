import { BIP32DerivationType, fromSeed, KeyContext, XHDWalletAPI, harden } from '@algorandfoundation/xhd-wallet-api'
import { RawEd25519Signer } from './ed25519'
export type BIP44Path = [number, number, number, number, number]

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

/**
 * Represents a scalar || prefix secret that can be unwrapped for short-lived use and then re-wrapped.
 */
export type WrappedHdScalarAndPrefix = {
  /**
   * Unwraps and returns the 64-byte Ed25519 scalar || prefix.
   */
  unwrapHdScalarAndPrefix: () => Promise<Uint8Array>
  /**
   * Re-wraps the scalar || prefix  after use.
   */
  wrapHdScalarAndPrefix: () => Promise<void>
}

/**
 * Represents a scalar || prefix || chain_code secret that can be unwrapped for short-lived use and then re-wrapped.
 */
export type WrappedHdExtendedPrivateKey = {
  /**
   * Unwraps and returns the 96-byte Ed25519 scalar || prefix || chain_code.
   */
  unwrapHdExtendedPrivateKey: () => Promise<Uint8Array>
  /**
   * Re-wraps the scalar || prefix  after use.
   */
  wrapHdExtendedPrivateKey: () => Promise<void>
}
