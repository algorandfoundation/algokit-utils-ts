import { describe, expect, it } from 'vitest'
import { peikertXHdWalletGenerator, recoverDerivedKeypair } from './hd'
import { nobleEd25519Verifier } from './ed25519'
describe('HD', () => {
  it('recoverDerivedKeypair', async () => {
    const { accountGenerator } = await peikertXHdWalletGenerator()
    const { ed25519Pubkey, extendedPrivateKey } = await accountGenerator(0, 0)
    const { rawEd25519Signer } = recoverDerivedKeypair(extendedPrivateKey)
    const sig = await rawEd25519Signer(new Uint8Array([1, 2, 3]))

    const v = await nobleEd25519Verifier(sig, new Uint8Array([1, 2, 3]), ed25519Pubkey)

    expect(v).toBe(true)
  })
})
