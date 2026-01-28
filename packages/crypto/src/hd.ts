import { BIP32DerivationType, fromSeed, KeyContext, XHDWalletAPI, harden } from '@algorandfoundation/xhd-wallet-api'
import { RawEd25519Signer } from './ed25519'

export type BIP44Path = [number, number, number, number, number]

export type RawHdWalletSigner = (bytesToSign: Uint8Array, bip44Path: BIP44Path) => Promise<Uint8Array>

export type HdWalletGenerator = (seed?: Uint8Array) => Promise<{
  hdRootKey: Uint8Array
  rawHdSigner: RawHdWalletSigner
}>

export type HdAccountGenerator = (
  rootKey: Uint8Array,
  account: number,
  index: number,
) => Promise<{
  ed25519Pubkey: Uint8Array
  bip44Path: BIP44Path
  rawEd25519Signer: RawEd25519Signer
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

const xhd = new XHDWalletAPI()

export const peikertXHdWalletGenerator: HdWalletGenerator = async (seed?: Uint8Array) => {
  const seedArray = seed ?? new Uint8Array(32)
  if (seed === undefined) {
    crypto.getRandomValues(seedArray)
  }

  const rootKey = fromSeed(Buffer.from(seedArray))

  const rawHdSigner: RawHdWalletSigner = async (bytesToSign: Uint8Array, bip44Path: BIP44Path): Promise<Uint8Array> => {
    verifyPath(bip44Path)
    const { account, index } = getPathComponents(bip44Path)

    return xhd.signAlgoTransaction(rootKey, KeyContext.Address, account, index, bytesToSign, BIP32DerivationType.Peikert)
  }

  return { hdRootKey: rootKey, rawHdSigner }
}

export const peikertXHdAccountGenerator: HdAccountGenerator = async (rootKey: Uint8Array, account: number, index: number) => {
  const ed25519Pubkey = await xhd.keyGen(rootKey, KeyContext.Address, account, index, BIP32DerivationType.Peikert)

  const rawEd25519Signer: RawEd25519Signer = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
    return xhd.signAlgoTransaction(rootKey, KeyContext.Address, account, index, bytesToSign, BIP32DerivationType.Peikert)
  }

  const bip44Path: BIP44Path = [harden(44), harden(283), harden(account), 0, index]

  return { ed25519Pubkey, rawEd25519Signer, bip44Path }
}
