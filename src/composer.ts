import algosdk from 'algosdk'
import { sendAtomicTransactionComposer } from './transaction/transaction'

export type CommonTxnParams = {
  sender: string
  signer?: algosdk.TransactionSigner
  rekeyTo?: string
  note?: Uint8Array
  lease?: Uint8Array
  /** The transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction */
  flatFee?: number
  /** The fee to pay IN ADDITION to the suggested fee. Useful for covering inner transaction fees */
  extraFee?: number
  /** How many rounds the transaction should be valid for */
  validityWindow?: number
  /**
   * Set the first round this transaction is valid.
   * If left undefined, the value from algod will be used.
   * Only set this when you intentionally want this to be some time in the future
   */
  firstValidRound?: number
  /** The last round this transaction is valid. It is recommended to use validityWindow instead */
  lastValidRound?: number
}

export type PayTxnParams = CommonTxnParams & {
  to: string
  amount: number
}

export type AssetCreateParams = CommonTxnParams & {
  total: number
  decimals?: number
  defaultFrozen?: boolean
  manager?: string
  reserve?: string
  freeze?: string
  clawback?: string
  unitName?: string
  assetName?: string
  url?: string
  metadataHash?: Uint8Array
}

export type AssetConfigParams = CommonTxnParams & {
  assetID: number
  manager?: string
  reserve?: string
  freeze?: string
  clawback?: string
}

export type AssetFreezeParams = CommonTxnParams & {
  assetID: number
  account: string
  frozen: boolean
}

export type AssetDestroyParams = CommonTxnParams & {
  assetID: number
}

export type KeyRegParams = CommonTxnParams & {
  voteKey?: Uint8Array
  selectionKey?: Uint8Array
  voteFirst: number
  voteLast: number
  voteKeyDilution: number
  nonParticipation: boolean
  stateProofKey?: Uint8Array
}

export type AssetTransferParams = CommonTxnParams & {
  assetID: number
  amount: number
  to: string
  clawbackTarget?: string
  closeAssetTo?: string
}

export type AppCallParams = CommonTxnParams & {
  onComplete?: algosdk.OnApplicationComplete
  appID?: number
  approvalProgram?: Uint8Array
  clearProgram?: Uint8Array
  schema?: {
    globalUints: number
    globalByteSlices: number
    localUints: number
    localByteSlices: number
  }
  args?: Uint8Array[]
  accountReferences?: string[]
  appReferences?: number[]
  assetReferences?: number[]
  extraPages?: number
  boxReferences?: algosdk.BoxReference[]
}

export type MethodCallParams = CommonTxnParams &
  Omit<AppCallParams, 'args'> & {
    appID: number
    method: algosdk.ABIMethod
    args?: (algosdk.ABIValue | Txn)[]
  }

type Txn =
  | (PayTxnParams & { type: 'pay' })
  | (AssetCreateParams & { type: 'assetCreate' })
  | (AssetConfigParams & { type: 'assetConfig' })
  | (AssetFreezeParams & { type: 'assetFreeze' })
  | (AssetDestroyParams & { type: 'assetDestroy' })
  | (AssetTransferParams & { type: 'assetTransfer' })
  | (AppCallParams & { type: 'appCall' })
  | (KeyRegParams & { type: 'keyReg' })
  | (algosdk.TransactionWithSigner & { type: 'txnWithSigner' })
  | { atc: algosdk.AtomicTransactionComposer; type: 'atc' }
  | (MethodCallParams & { type: 'methodCall' })

export default class AlgokitComposer {
  atc: algosdk.AtomicTransactionComposer
  algod: algosdk.Algodv2
  getSuggestedParams: () => Promise<algosdk.SuggestedParams>
  getSigner: (address: string) => algosdk.TransactionSigner
  defaultValidityWindow: number = 10

  txns: Txn[] = []

  constructor(
    algod: algosdk.Algodv2,
    getSigner: (address: string) => algosdk.TransactionSigner,
    getSuggestedParams?: () => Promise<algosdk.SuggestedParams>,
  ) {
    this.atc = new algosdk.AtomicTransactionComposer()
    this.algod = algod
    const defaultGetSendParams = () => algod.getTransactionParams().do()
    this.getSuggestedParams = getSuggestedParams ?? defaultGetSendParams
    this.getSigner = getSigner
  }

  addPayment(params: PayTxnParams): AlgokitComposer {
    this.txns.push({ ...params, type: 'pay' })

    return this
  }

  addAssetCreate(params: AssetCreateParams): AlgokitComposer {
    this.txns.push({ ...params, type: 'assetCreate' })

    return this
  }

  addAssetConfig(params: AssetConfigParams): AlgokitComposer {
    this.txns.push({ ...params, type: 'assetConfig' })

    return this
  }

  addAssetFreeze(params: AssetFreezeParams): AlgokitComposer {
    this.txns.push({ ...params, type: 'assetFreeze' })

    return this
  }

  addAssetDestroy(params: AssetDestroyParams): AlgokitComposer {
    this.txns.push({ ...params, type: 'assetDestroy' })

    return this
  }

  addAssetTransfer(params: AssetTransferParams): AlgokitComposer {
    this.txns.push({ ...params, type: 'assetTransfer' })

    return this
  }

  addAppCall(params: AppCallParams): AlgokitComposer {
    this.txns.push({ ...params, type: 'appCall' })

    return this
  }

  addKeyReg(params: KeyRegParams): AlgokitComposer {
    this.txns.push({ ...params, type: 'keyReg' })

    return this
  }

  addAtc(atc: algosdk.AtomicTransactionComposer): AlgokitComposer {
    this.txns.push({ atc, type: 'atc' })
    return this
  }

  addMethodCall(params: MethodCallParams) {
    this.txns.push({ ...params, type: 'methodCall' })
    return this
  }

  private buildAtc(
    atc: algosdk.AtomicTransactionComposer,
    txnWithSigners: algosdk.TransactionWithSigner[],
    methodCalls: Map<number, algosdk.ABIMethod>,
  ) {
    const currentLength = txnWithSigners.length
    const group = atc.buildGroup()

    const atcMethodCalls = atc['methodCalls'] as Map<number, algosdk.ABIMethod>

    atcMethodCalls.forEach((method, idx) => {
      methodCalls.set(currentLength + idx, method)
    })

    group.forEach((ts) => {
      ts.txn.group = undefined
      txnWithSigners.push(ts)
    })

    return this
  }

  private commonTxnBuildStep(params: CommonTxnParams, txn: algosdk.Transaction, suggestedParams: algosdk.SuggestedParams) {
    if (params.lease) txn.addLease(params.lease)
    if (params.rekeyTo) txn.addRekey(params.rekeyTo)
    if (params.note) txn.note = params.note

    if (params.firstValidRound) {
      txn.firstRound = params.firstValidRound
    }

    if (params.lastValidRound) {
      txn.lastRound = params.lastValidRound
    } else {
      txn.lastRound = txn.firstRound + (params.validityWindow ?? this.defaultValidityWindow)
    }

    if (params.flatFee !== undefined && params.extraFee !== undefined) {
      throw Error('Cannot set both flatFee and extraFee')
    }

    if (params.flatFee !== undefined) {
      txn.fee = params.flatFee
    } else {
      txn.fee = txn.estimateSize() * suggestedParams.fee || algosdk.ALGORAND_MIN_TX_FEE
      if (params.extraFee) txn.fee += params.extraFee
    }

    return txn
  }

  private buildMethodCall(
    params: MethodCallParams,
    suggestedParams: algosdk.SuggestedParams,
    txnWithSigners: algosdk.TransactionWithSigner[],
    methodCalls: Map<number, algosdk.ABIMethod>,
    methodCallOffset: number = 0,
  ) {
    const methodArgs: algosdk.ABIArgument[] = []
    /** When a methodCall is encountered, we need to offset the arg index because one method call might have multiple txns */
    let argOffset = 0

    const isAbiValue = (x: unknown): x is algosdk.ABIValue => {
      if (Array.isArray(x)) return x.length == 0 || x.every(isAbiValue)

      return ['boolean', 'number', 'bigint', 'string', 'Uint8Array'].includes(typeof x)
    }

    params.args?.forEach((arg, i) => {
      if (isAbiValue(arg)) {
        methodArgs.push(arg)
        return
      }

      if (Object.values(algosdk.ABITransactionType).includes(params.method.args[i + argOffset].type as algosdk.ABITransactionType)) {
        const txnType = arg.type

        if (txnType === 'methodCall') {
          // Don't modify the real txnWithSigners because that will happen once we build the top-level ATC
          const tempTxnWithSigners: algosdk.TransactionWithSigner[] = []

          // Don't modify the real methodCalls because we aren't going to have the real txnWithSigners until we build the top-level ATC
          const tempMap = new Map<number, algosdk.ABIMethod>()

          this.buildMethodCall(arg, suggestedParams, tempTxnWithSigners, tempMap, methodCallOffset)
          methodArgs.push(...tempTxnWithSigners)
          argOffset += tempTxnWithSigners.length - 1

          tempMap.forEach((method, idx) => {
            methodCalls.set(methodCallOffset + idx, method)
          })

          methodCallOffset += tempTxnWithSigners.length

          return
        }

        let txn: algosdk.Transaction

        if (txnType === 'appCall') {
          txn = this.buildAppCall(arg, suggestedParams)
        } else if (txnType === 'pay') {
          txn = this.buildPayment(arg, suggestedParams)
        } else if (txnType === 'assetCreate') {
          txn = this.buildAssetCreate(arg, suggestedParams)
        } else if (txnType === 'assetConfig') {
          txn = this.buildAssetConfig(arg, suggestedParams)
        } else if (txnType === 'assetDestroy') {
          txn = this.buildAssetDestroy(arg, suggestedParams)
        } else if (txnType === 'assetFreeze') {
          txn = this.buildAssetFreeze(arg, suggestedParams)
        } else if (txnType === 'assetTransfer') {
          txn = this.buildAssetTransfer(arg, suggestedParams)
        } else if (txnType === 'keyReg') {
          txn = this.buildKeyReg(arg, suggestedParams)
        } else throw Error(`Unsupported method arg transaction type: ${txnType}`)

        methodArgs.push({ txn, signer: params.signer || this.getSigner(params.sender) })
        return
      }

      throw Error(`Unsupported method arg: ${arg}`)
    })

    const methodAtc = new algosdk.AtomicTransactionComposer()

    methodAtc.addMethodCall({
      ...params,
      suggestedParams,
      signer: params.signer ?? this.getSigner(params.sender),
      methodArgs: methodArgs,
    })

    this.buildAtc(methodAtc, txnWithSigners, methodCalls)
  }

  private buildPayment(params: PayTxnParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: params.sender,
      to: params.to,
      amount: params.amount,
      suggestedParams,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildAssetCreate(params: AssetCreateParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: params.sender,
      total: params.total,
      decimals: params.decimals ?? 0,
      suggestedParams,
      defaultFrozen: params.defaultFrozen ?? false,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildAppCall(params: AppCallParams, suggestedParams: algosdk.SuggestedParams) {
    const sdkParams = {
      from: params.sender,
      suggestedParams,
      onComplete: params.onComplete,
      approvalProgram: params.approvalProgram,
      clearProgram: params.clearProgram,
      appArgs: params.args,
      accounts: params.accountReferences,
      foreignApps: params.appReferences,
      foreignAssets: params.assetReferences,
      extraPages: params.extraPages,
      numLocalInts: params.schema?.localUints || 0,
      numLocalByteSlices: params.schema?.localByteSlices || 0,
      numGlobalInts: params.schema?.globalUints || 0,
      numGlobalByteSlices: params.schema?.globalByteSlices || 0,
    }

    let txn: algosdk.Transaction

    const onComplete = params.onComplete || algosdk.OnApplicationComplete.NoOpOC

    if (!params.appID) {
      if (params.approvalProgram === undefined || params.clearProgram === undefined) {
        throw new Error('approvalProgram and clearProgram are required for application creation')
      }

      txn = algosdk.makeApplicationCreateTxnFromObject({
        ...sdkParams,
        onComplete,
        approvalProgram: params.approvalProgram,
        clearProgram: params.clearProgram,
      })
    }

    txn = algosdk.makeApplicationCallTxnFromObject({ ...sdkParams, onComplete, appIndex: params.appID! })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildAssetConfig(params: AssetConfigParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject({
      from: params.sender,
      assetIndex: params.assetID,
      suggestedParams,
      manager: params.manager,
      reserve: params.reserve,
      freeze: params.freeze,
      clawback: params.clawback,
      strictEmptyAddressChecking: false,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildAssetDestroy(params: AssetDestroyParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
      from: params.sender,
      assetIndex: params.assetID,
      suggestedParams,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildAssetFreeze(params: AssetFreezeParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject({
      from: params.sender,
      assetIndex: params.assetID,
      freezeTarget: params.account,
      freezeState: params.frozen,
      suggestedParams,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildAssetTransfer(params: AssetTransferParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: params.sender,
      to: params.to,
      assetIndex: params.assetID,
      amount: params.amount,
      suggestedParams,
      closeRemainderTo: params.closeAssetTo,
      revocationTarget: params.clawbackTarget,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildKeyReg(params: KeyRegParams, suggestedParams: algosdk.SuggestedParams) {
    let txn: algosdk.Transaction

    if (params.nonParticipation) {
      txn = algosdk.makeKeyRegistrationTxnWithSuggestedParams(
        params.sender,
        params.note,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        suggestedParams,
        params.rekeyTo,
        true,
        undefined,
      )
    } else {
      txn = algosdk.makeKeyRegistrationTxnWithSuggestedParams(
        params.sender,
        params.note,
        params.voteKey!,
        params.selectionKey!,
        params.voteFirst,
        params.voteLast,
        params.voteKeyDilution,
        suggestedParams,
        params.rekeyTo,
        false,
        params.stateProofKey,
      )
    }

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  async buildTxn(
    txn: Txn,
    txnWithSigners: algosdk.TransactionWithSigner[],
    methodCalls: Map<number, algosdk.ABIMethod>,
    suggestedParams: algosdk.SuggestedParams,
  ) {
    if (txn.type === 'txnWithSigner') {
      txnWithSigners.push(txn)
      return
    }

    if (txn.type === 'atc') {
      this.buildAtc(txn.atc, txnWithSigners, methodCalls)
      return
    }

    if (txn.type === 'methodCall') {
      this.buildMethodCall(txn, suggestedParams, txnWithSigners, methodCalls)
      return
    }

    const signer = txn.signer ?? this.getSigner(txn.sender)

    if (txn.type === 'pay') {
      const payment = this.buildPayment(txn, suggestedParams)
      txnWithSigners.push({ txn: payment, signer })
    } else if (txn.type === 'assetCreate') {
      const assetCreate = this.buildAssetCreate(txn, suggestedParams)
      txnWithSigners.push({ txn: assetCreate, signer })
    } else if (txn.type === 'appCall') {
      const appCall = this.buildAppCall(txn, suggestedParams)
      txnWithSigners.push({ txn: appCall, signer })
    } else if (txn.type === 'assetConfig') {
      const assetConfig = this.buildAssetConfig(txn, suggestedParams)
      txnWithSigners.push({ txn: assetConfig, signer })
    } else if (txn.type === 'assetDestroy') {
      const assetDestroy = this.buildAssetDestroy(txn, suggestedParams)
      txnWithSigners.push({ txn: assetDestroy, signer })
    } else if (txn.type === 'assetFreeze') {
      const assetFreeze = this.buildAssetFreeze(txn, suggestedParams)
      txnWithSigners.push({ txn: assetFreeze, signer })
    } else if (txn.type === 'assetTransfer') {
      const assetTransfer = this.buildAssetTransfer(txn, suggestedParams)
      txnWithSigners.push({ txn: assetTransfer, signer })
    } else if (txn.type === 'keyReg') {
      const keyReg = this.buildKeyReg(txn, suggestedParams)
      txnWithSigners.push({ txn: keyReg, signer })
    }
  }

  async buildGroup() {
    const suggestedParams = await this.getSuggestedParams()

    const txnWithSigners: algosdk.TransactionWithSigner[] = []
    const methodCalls = new Map<number, algosdk.ABIMethod>()

    this.txns.forEach((txn) => {
      this.buildTxn(txn, txnWithSigners, methodCalls, suggestedParams)
    })

    txnWithSigners.forEach((ts) => {
      this.atc.addTransaction(ts)
    })

    const builtGroup = this.atc.buildGroup()

    this.atc['methodCalls'] = methodCalls

    return builtGroup
  }

  async execute(params?: { maxRoundsToWaitForConfirmation?: number }) {
    const group = await this.buildGroup()

    let waitRounds = params?.maxRoundsToWaitForConfirmation

    if (waitRounds === undefined) {
      const lastRound = group.reduce((max, txn) => Math.max(txn.txn.lastRound, max), 0)
      const { firstRound } = await this.getSuggestedParams()
      waitRounds = lastRound - firstRound
    }

    return await sendAtomicTransactionComposer(
      {
        atc: this.atc,
        sendParams: { suppressLog: true, maxRoundsToWaitForConfirmation: waitRounds },
      },
      this.algod,
    )
  }
}
