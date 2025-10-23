import { describe, expect, it } from 'vitest'
import { CreateWalletRequest } from '@algorandfoundation/kmd-client'
import { createKmdClient, getKmdEnv, randomWalletName } from './helpers'

const WALLET_DRIVER = 'sqlite'

describe('KMD wallet lifecycle', () => {
  it('creates a wallet and lists it', async () => {
    const env = getKmdEnv()
    const client = createKmdClient(env)
    const walletName = randomWalletName('wallet_lifecycle')

    const createResponse = await client.createWallet({
      body: {
        walletName,
        walletDriverName: WALLET_DRIVER,
        walletPassword: env.walletPassword,
      } satisfies CreateWalletRequest,
    })

    expect(createResponse.wallet?.name).toBe(walletName)

    const listResponse = await client.listWallets()
    const wallets = listResponse.wallets ?? []
    const found = wallets.some((wallet) => wallet.name === walletName)

    expect(found).toBe(true)
  })
})
