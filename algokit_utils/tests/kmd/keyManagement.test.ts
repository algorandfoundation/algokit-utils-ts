import { describe, expect, it } from 'vitest'
import type {
  CreateWalletRequest,
  InitWalletHandleTokenRequest,
  ListKeysRequest,
  ReleaseWalletHandleTokenRequest,
  GenerateKeyRequest,
} from '@algorandfoundation/kmd-client'
import { createKmdClient, getKmdEnv, randomWalletName } from './helpers'

const WALLET_DRIVER = 'sqlite'

describe('KMD key management', () => {
  it('generates and lists keys with a wallet handle token', async () => {
    const env = getKmdEnv()
    const client = createKmdClient(env)
    const walletName = randomWalletName('wallet_keys')

    const createWalletResponse = await client.createWallet({
      body: {
        walletName,
        walletDriverName: WALLET_DRIVER,
        walletPassword: env.walletPassword,
      } satisfies CreateWalletRequest,
    })

    const walletId = createWalletResponse.wallet?.id
    expect(walletId).toBeDefined()

    const initHandleResponse = await client.initWalletHandleToken({
      body: {
        walletId,
        walletPassword: env.walletPassword,
      } satisfies InitWalletHandleTokenRequest,
    })

    const walletHandleToken = initHandleResponse.walletHandleToken
    expect(walletHandleToken).toBeDefined()

    const listBeforeResponse = await client.listKeysInWallet({
      body: {
        walletHandleToken,
      } satisfies ListKeysRequest,
    })
    const beforeAddresses = listBeforeResponse.addresses ?? []

    await client.generateKey({
      body: {
        walletHandleToken,
        displayMnemonic: false,
      } satisfies GenerateKeyRequest,
    })

    const listAfterResponse = await client.listKeysInWallet({
      body: {
        walletHandleToken,
      } satisfies ListKeysRequest,
    })
    const afterAddresses = listAfterResponse.addresses ?? []

    expect(afterAddresses.length).toBe(beforeAddresses.length + 1)

    await client.releaseWalletHandleToken({
      body: {
        walletHandleToken,
      } satisfies ReleaseWalletHandleTokenRequest,
    })
  })
})
