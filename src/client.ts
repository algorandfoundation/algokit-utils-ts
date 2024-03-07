import algosdk from 'algosdk'
import AlgokitComposer, {
  AppCallParams,
  AssetConfigParams,
  AssetCreateParams,
  AssetDestroyParams,
  AssetFreezeParams,
  AssetTransferParams,
  KeyRegParams,
  MethodCallParams,
  PayTxnParams,
} from './composer'

export default class AlgokitClient {
  algod: algosdk.Algodv2

  signers: { [address: string]: algosdk.TransactionSigner } = {}

  cachedSuggestedParamsTimeout: number = 3000 // three seconds

  cachedSuggestedParams?: { params: algosdk.SuggestedParams; time: number }

  defaultSigner?: algosdk.TransactionSigner

  constructor({ algodClient, defaultSigner }: { algodClient: algosdk.Algodv2; defaultSigner?: algosdk.TransactionSigner }) {
    this.algod = algodClient
    this.defaultSigner = defaultSigner
  }

  async getSuggestedParams() {
    if (this.cachedSuggestedParams && Date.now() - this.cachedSuggestedParams.time < this.cachedSuggestedParamsTimeout) {
      return this.cachedSuggestedParams.params
    }

    const params = await this.algod.getTransactionParams().do()
    this.cachedSuggestedParams = { params, time: Date.now() }

    return params
  }

  newGroup() {
    return new AlgokitComposer(
      this.algod,
      (addr: string) => this.signers[addr] || this.defaultSigner,
      () => this.getSuggestedParams(),
    )
  }

  sendPayment(params: PayTxnParams) {
    return this.newGroup().addPayment(params).execute()
  }

  sendAssetCreate(params: AssetCreateParams) {
    return this.newGroup().addAssetCreate(params).execute()
  }

  sendAssetConfig(params: AssetConfigParams) {
    return this.newGroup().addAssetConfig(params).execute()
  }

  sendAssetFreeze(params: AssetFreezeParams) {
    return this.newGroup().addAssetFreeze(params).execute()
  }

  sendAssetDestroy(params: AssetDestroyParams) {
    return this.newGroup().addAssetDestroy(params).execute()
  }

  sendAssetTransfer(params: AssetTransferParams) {
    return this.newGroup().addAssetTransfer(params).execute()
  }

  sendAppCall(params: AppCallParams) {
    return this.newGroup().addAppCall(params).execute()
  }

  sendKeyReg(params: KeyRegParams) {
    return this.newGroup().addKeyReg(params).execute()
  }

  sendMethodCall(params: MethodCallParams) {
    return this.newGroup().addMethodCall(params).execute()
  }
}
