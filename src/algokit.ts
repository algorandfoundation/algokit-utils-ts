import algosdk from 'algosdk'
import { assetOptIn, assetOptOut } from './asset'
import {
  getAlgoClient,
  getAlgoIndexerClient,
  getAlgoKmdClient,
  getAlgoNodeConfig,
  getConfigFromEnvOrDefaults,
  getDefaultLocalNetConfig,
} from './network-client'
import { getTransactionParams, performAtomicTransactionComposerSimulate, sendAtomicTransactionComposer } from './transaction'
import { transferAlgos } from './transfer'
import { AlgoAmount } from './types/amount'
import { AlgoConfig } from './types/network-client'
import { TransactionNote } from './types/transaction'
import Algodv2 = algosdk.Algodv2
import Indexer = algosdk.Indexer
import Kmd = algosdk.Kmd
import AtomicTransactionComposer = algosdk.AtomicTransactionComposer
import SuggestedParams = algosdk.SuggestedParams
import Transaction = algosdk.Transaction
import TransactionSigner = algosdk.TransactionSigner
import modelsv2 = algosdk.modelsv2

export interface AlgoClients {
  algod: Algodv2
  indexer?: Indexer
  kmd?: Kmd
}

export type AccountAddress = string

export type TransactionSent = {
  /** The transaction */
  transaction: Transaction
  /** The response if the transaction was sent and waited for */
  confirmation: modelsv2.PendingTransactionResponse
}

export class AlgoKit {
  private _algod: Algodv2
  private _indexer?: Indexer
  private _kmd?: Kmd

  private _suggestedParams?: SuggestedParams
  private _suggestedParamsExpiry?: Date

  private constructor(config: AlgoConfig | AlgoClients) {
    if ('algod' in config) {
      this._algod = config.algod
      this._indexer = config.indexer
      this._kmd = config.kmd
    } else {
      this._algod = getAlgoClient(config.algodConfig)
      this._indexer = config.indexerConfig ? getAlgoIndexerClient(config.indexerConfig) : undefined
      this._kmd = config.kmdConfig ? getAlgoKmdClient(config.kmdConfig) : undefined
    }
  }

  public get algod(): Algodv2 {
    return this._algod
  }

  public get indexer(): Indexer {
    if (!this._indexer) throw new Error('Attempt to use Indexer client in AlgoKit instance with no Indexer configured')
    return this._indexer
  }

  public get kmd(): Kmd {
    if (!this._kmd) throw new Error('Attempt to use Kmd client in AlgoKit instance with no Kmd configured')
    return this._kmd
  }

  public get transaction() {
    return {
      transferAlgos: async (transfer: {
        amount: AlgoAmount
        from: AccountAddress
        to: AccountAddress
        note?: TransactionNote
        atc?: AtomicTransactionComposer
      }) =>
        (
          await transferAlgos(
            {
              amount: transfer.amount,
              from: { addr: transfer.from, signer: algosdk.makeEmptyTransactionSigner() },
              to: transfer.to,
              skipSending: true,
              transactionParams: await this.getTransactionParams(),
              note: transfer.note,
              atc: transfer.atc,
            },
            this.algod,
          )
        ).transaction,
      assetOptIn: async (optIn: { assetId: number; account: AccountAddress; note?: TransactionNote; atc?: AtomicTransactionComposer }) =>
        (
          await assetOptIn(
            {
              account: { addr: optIn.account, signer: algosdk.makeEmptyTransactionSigner() },
              assetId: optIn.assetId,
              skipSending: true,
              transactionParams: await this.getTransactionParams(),
              note: optIn.note,
              atc: optIn.atc,
            },
            this.algod,
          )
        ).transaction,
      assetOptOut: async (optOut: { assetId: number; account: AccountAddress; note?: TransactionNote; atc?: AtomicTransactionComposer }) =>
        (
          await assetOptOut(
            {
              account: { addr: optOut.account, signer: algosdk.makeEmptyTransactionSigner() },
              assetId: optOut.assetId,
              skipSending: true,
              transactionParams: await this.getTransactionParams(),
              note: optOut.note,
              atc: optOut.atc,
            },
            this.algod,
          )
        ).transaction,
    }
  }

  public get send() {
    return {
      transferAlgos: async (transfer: {
        amount: AlgoAmount
        from: AccountAddress
        to: AccountAddress
        signer: TransactionSigner
        note?: TransactionNote
      }) =>
        (await transferAlgos(
          {
            amount: transfer.amount,
            from: { addr: transfer.from, signer: transfer.signer },
            to: transfer.to,
            transactionParams: await this.getTransactionParams(),
            note: transfer.note,
          },
          this.algod,
        )) as TransactionSent,
      assetOptIn: async (optIn: { assetId: number; account: AccountAddress; signer: TransactionSigner; note?: TransactionNote }) =>
        (await assetOptIn(
          {
            account: { addr: optIn.account, signer: optIn.signer },
            assetId: optIn.assetId,
            transactionParams: await this.getTransactionParams(),
            note: optIn.note,
          },
          this.algod,
        )) as TransactionSent,
      assetOptOut: async (optOut: { assetId: number; account: AccountAddress; signer: TransactionSigner; note?: TransactionNote }) =>
        (await assetOptOut(
          {
            account: { addr: optOut.account, signer: optOut.signer },
            assetId: optOut.assetId,
            transactionParams: await this.getTransactionParams(),
            note: optOut.note,
          },
          this.algod,
        )) as TransactionSent,
    }
  }

  public compose(defaults?: { atc?: AtomicTransactionComposer; signer: TransactionSigner }) {
    const atc = defaults?.atc ?? new AtomicTransactionComposer()
    const noSigner = algosdk.makeEmptyTransactionSigner()
    let promiseChain: Promise<unknown> = Promise.resolve()
    const compose = {
      transferAlgos: (transfer: {
        amount: AlgoAmount
        from: AccountAddress
        to: AccountAddress
        signer?: TransactionSigner
        note?: TransactionNote
      }) => {
        promiseChain = promiseChain.then(async () =>
          atc.addTransaction({
            txn: await this.transaction.transferAlgos({ ...transfer, atc }),
            signer: transfer.signer ?? defaults?.signer ?? noSigner,
          }),
        )
        return compose
      },
      assetOptIn: (optIn: { assetId: number; account: AccountAddress; signer?: TransactionSigner; note?: TransactionNote }) => {
        promiseChain = promiseChain.then(async () =>
          atc.addTransaction({
            txn: await this.transaction.assetOptIn({ ...optIn, atc }),
            signer: optIn.signer ?? defaults?.signer ?? noSigner,
          }),
        )
        return compose
      },
      assetOptOut: (optOut: { assetId: number; account: AccountAddress; signer?: TransactionSigner; note?: TransactionNote }) => {
        promiseChain = promiseChain.then(async () =>
          atc.addTransaction({
            txn: await this.transaction.assetOptIn({ ...optOut, atc }),
            signer: optOut.signer ?? defaults?.signer ?? noSigner,
          }),
        )
        return compose
      },
      transactions: async () => {
        await promiseChain
        return atc.buildGroup().map((t) => t.txn)
      },
      transactionsWithSigners: async () => {
        await promiseChain
        return atc.buildGroup()
      },
      atc: async () => {
        await promiseChain
        return atc
      },
      simulate: async () => {
        await promiseChain
        const result = await performAtomicTransactionComposerSimulate(atc, this.algod)
        return result
      },
      addTransaction: (transaction: Transaction, signer?: TransactionSigner) => {
        atc.addTransaction({ txn: transaction, signer: signer ?? defaults?.signer ?? noSigner })
        return compose
      },
      send: async () => {
        await promiseChain
        return sendAtomicTransactionComposer(
          {
            atc,
          },
          this.algod,
        )
      },
    }
    return compose
  }

  public useSuggestedParams(suggestedParams: SuggestedParams, until?: Date) {
    this._suggestedParams = suggestedParams
    this._suggestedParamsExpiry = until
    return this
  }

  public async getTransactionParams(): Promise<SuggestedParams> {
    if (this._suggestedParams && (!this._suggestedParamsExpiry || this._suggestedParamsExpiry > new Date())) {
      return { ...this._suggestedParams }
    }

    this._suggestedParams = await getTransactionParams(undefined, this.algod)
    // Cache for 5s
    this._suggestedParamsExpiry = new Date(new Date().getTime() + 5_000)
    return this._suggestedParams
  }

  public static defaultLocalNet() {
    return new AlgoKit({
      algodConfig: getDefaultLocalNetConfig('algod'),
      indexerConfig: getDefaultLocalNetConfig('indexer'),
      kmdConfig: getDefaultLocalNetConfig('kmd'),
    })
  }

  public static testNet() {
    return new AlgoKit({
      algodConfig: getAlgoNodeConfig('testnet', 'algod'),
      indexerConfig: getAlgoNodeConfig('testnet', 'indexer'),
      kmdConfig: undefined,
    })
  }

  public static mainNet() {
    return new AlgoKit({
      algodConfig: getAlgoNodeConfig('mainnet', 'algod'),
      indexerConfig: getAlgoNodeConfig('mainnet', 'indexer'),
      kmdConfig: undefined,
    })
  }

  public static fromClients(clients: AlgoClients) {
    return new AlgoKit(clients)
  }

  public static fromEnvironment() {
    return new AlgoKit(getConfigFromEnvOrDefaults())
  }

  public static fromConfig(config: AlgoConfig) {
    return new AlgoKit(config)
  }
}
