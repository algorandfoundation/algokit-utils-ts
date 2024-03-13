import algosdk from 'algosdk'
import AlgokitComposer, {
  AppCallParams,
  AssetConfigParams,
  AssetCreateParams,
  AssetDestroyParams,
  AssetFreezeParams,
  AssetOptInParams,
  AssetTransferParams,
  KeyRegParams,
  MethodCallParams,
  PayTxnParams,
} from './composer'

export default class AlgokitClient {
  /** The algosdk algod client */
  algod: algosdk.Algodv2

  /** A map of address to transaction signer functions */
  signers: { [address: string]: algosdk.TransactionSigner } = {}

  /** The amount of time a suggested params response will be cached for */
  cachedSuggestedParamsTimeout: number = 3000 // three seconds

  /** The last suggested params response */
  cachedSuggestedParams?: { params: algosdk.SuggestedParams; time: number }

  /** The default signer to use if no signer is provided or found in `signers` */
  defaultSigner?: algosdk.TransactionSigner

  constructor({ algodClient, defaultSigner }: { algodClient: algosdk.Algodv2; defaultSigner?: algosdk.TransactionSigner }) {
    this.algod = algodClient
    this.defaultSigner = defaultSigner
  }

  /** Get suggested params (either cached or from algod) */
  async getSuggestedParams() {
    if (this.cachedSuggestedParams && Date.now() - this.cachedSuggestedParams.time < this.cachedSuggestedParamsTimeout) {
      return this.cachedSuggestedParams.params
    }

    const params = await this.algod.getTransactionParams().do()
    this.cachedSuggestedParams = { params, time: Date.now() }

    return params
  }

  /** Start a new `AlgokitComposer` transaction group */
  newGroup() {
    return new AlgokitComposer(
      this.algod,
      (addr: string) => this.signers[addr] || this.defaultSigner,
      () => this.getSuggestedParams(),
    )
  }

  /**
   * Methods for sending a transaction
   */
  send = {
    payment: (params: PayTxnParams) => {
      return this.newGroup().addPayment(params).execute()
    },
    assetCreate: (params: AssetCreateParams) => {
      return this.newGroup().addAssetCreate(params).execute()
    },
    assetConfig: (params: AssetConfigParams) => {
      return this.newGroup().addAssetConfig(params).execute()
    },
    assetFreeze: (params: AssetFreezeParams) => {
      return this.newGroup().addAssetFreeze(params).execute()
    },
    assetDestroy: (params: AssetDestroyParams) => {
      return this.newGroup().addAssetDestroy(params).execute()
    },
    assetTransfer: (params: AssetTransferParams) => {
      return this.newGroup().addAssetTransfer(params).execute()
    },
    appCall: (params: AppCallParams) => {
      return this.newGroup().addAppCall(params).execute()
    },
    keyReg: (params: KeyRegParams) => {
      return this.newGroup().addKeyReg(params).execute()
    },
    methodCall: (params: MethodCallParams) => {
      return this.newGroup().addMethodCall(params).execute()
    },
    assetOptIn: (params: AssetOptInParams) => {
      return this.newGroup().addAssetOptIn(params).execute()
    },
  }

  /**
   * Methods for building transactions
   */
  transactions = {
    payment: async (params: PayTxnParams) => {
      return (await this.newGroup().addPayment(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    assetCreate: async (params: AssetCreateParams) => {
      return (await this.newGroup().addAssetCreate(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    assetConfig: async (params: AssetConfigParams) => {
      return (await this.newGroup().addAssetConfig(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    assetFreeze: async (params: AssetFreezeParams) => {
      return (await this.newGroup().addAssetFreeze(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    assetDestroy: async (params: AssetDestroyParams) => {
      return (await this.newGroup().addAssetDestroy(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    assetTransfer: async (params: AssetTransferParams) => {
      return (await this.newGroup().addAssetTransfer(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    appCall: async (params: AppCallParams) => {
      return (await this.newGroup().addAppCall(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    keyReg: async (params: KeyRegParams) => {
      return (await this.newGroup().addKeyReg(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    methodCall: async (params: MethodCallParams) => {
      return (await this.newGroup().addMethodCall(params).buildGroup()).map((ts) => ts.txn)
    },
    assetOptIn: async (params: AssetOptInParams) => {
      return (await this.newGroup().addAssetOptIn(params).buildGroup()).map((ts) => ts.txn)[0]
    },
  }
}
