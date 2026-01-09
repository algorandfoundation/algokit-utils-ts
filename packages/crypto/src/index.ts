import * as ed from '@noble/ed25519'
import sha512 from 'js-sha512'

export type RawEd25519Signer = (bytesToSign: Uint8Array) => Promise<Uint8Array>
export type RawEd25519Verifier = (message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array) => Promise<boolean>
export type Ed25519Generator = (seed?: Uint8Array) => {
  ed25519Pubkey: Uint8Array
  ed25519SecretKey: Uint8Array
  rawEd25519Signer: RawEd25519Signer
  rawEd25519Verifier: RawEd25519Verifier
}

ed.hashes.sha512 = (msg: ed.Bytes) => new Uint8Array(sha512.sha512.digest(msg))

export const nobleEd25519Generator: Ed25519Generator = (seed?: Uint8Array) => {
  const ed25519SecretKey = ed.utils.randomSecretKey(seed)
  const ed25519Pubkey = ed.getPublicKey(ed25519SecretKey)

  const rawEd25519Signer: RawEd25519Signer = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
    return ed.signAsync(bytesToSign, ed25519SecretKey)
  }

  const rawEd25519Verifier: RawEd25519Verifier = async (
    message: Uint8Array,
    signature: Uint8Array,
    publicKey: Uint8Array,
  ): Promise<boolean> => {
    return ed.verifyAsync(signature, message, publicKey)
  }

  return { ed25519Pubkey, ed25519SecretKey, rawEd25519Signer, rawEd25519Verifier }
}
