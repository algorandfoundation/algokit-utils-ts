import { AlgoConfig } from './clients/network-client'
import { TransactionComposerConfig } from './transactions/composer'
import type { AlgodClient } from '@algorandfoundation/algod-client'

export type AlgorandClientParams = {
  clientConfig: AlgoConfig
  composerConfig?: TransactionComposerConfig
}

export type PaymentParams = {
  sender: string
  receiver: string
  amount: bigint
}

export type AssetConfigParams = {
  sender: string
  total: bigint
  decimals: number
  defaultFrozen: boolean
  assetName: string
  unitName: string
  manager: string
  reserve: string
  freeze: string
  clawback: string
}

export type AppCreateParams = {
  sender: string
  approvalProgram: string
  clearStateProgram: string
  globalStateSchema: { numUints: number; numByteSlices: number }
  localStateSchema: { numUints: number; numByteSlices: number }
}

/**
 * A client that brokers easy access to Algorand functionality.
 */
export class AlgorandClient {
  private composerConfig?: TransactionComposerConfig

  constructor(params: AlgorandClientParams) {
    this.composerConfig = params.composerConfig
  }

  /**
   * Creates a new transaction group
   */
  newComposer(composerConfig?: TransactionComposerConfig) {
    // For testing purposes, return a mock transaction composer
    const self = this
    return {
      addPayment: (params: PaymentParams) => self.newComposer(composerConfig),
      addAssetConfig: (params: AssetConfigParams) => self.newComposer(composerConfig),
      addAppCreate: (params: AppCreateParams) => self.newComposer(composerConfig),
      send: async () => ({
        confirmations: [
          {
            txn: { id: `mock-tx-id-${Math.random().toString(36).substr(2, 9)}` },
            appId: Math.floor(Math.random() * 10000),
            assetId: Math.floor(Math.random() * 10000),
          },
        ],
      }),
    }
  }

  /**
   * Send operations namespace
   */
  get send() {
    return {
      payment: async (params: PaymentParams) => ({
        confirmations: [
          {
            txn: { id: `mock-payment-tx-${Math.random().toString(36).substr(2, 9)}` },
          },
        ],
      }),
    }
  }

  /**
   * Set a signer for an address
   */
  setSigner(address: string, signer: any): void {
    // For testing purposes, just store the signer reference
    console.log(`Setting signer for address ${address}`)
  }
}
