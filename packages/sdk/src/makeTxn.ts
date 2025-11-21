import { SuggestedParams } from '@algorandfoundation/algokit-algod-client'
import type { Transaction } from '@algorandfoundation/algokit-transact'
import { OnApplicationComplete, TransactionType } from '@algorandfoundation/algokit-transact'
import { foreignArraysToResourceReferences } from './appAccess.js'
import { Address } from './encoding/address.js'
import {
  ApplicationCallReferenceParams,
  ApplicationCallTransactionParams,
  AssetConfigurationTransactionParams,
  AssetFreezeTransactionParams,
  AssetTransferTransactionParams,
  KeyRegistrationTransactionParams,
  PaymentTransactionParams,
} from './types/transactions/base.js'

// Helper function to convert Address to string
function addressToClass(addr: string | Address | undefined): Address | undefined {
  if (!addr) return undefined
  return typeof addr === 'string' ? Address.fromString(addr) : addr
}

// Helper function to ensure bigint
function ensureBigInt(value: number | bigint | undefined): bigint | undefined {
  if (value === undefined) return undefined
  return typeof value === 'bigint' ? value : BigInt(value)
}

/** Contains parameters common to every transaction type */
export interface CommonTransactionParams {
  /** Algorand address of sender */
  sender: string | Address
  /** Suggested parameters relevant to the network that will accept this transaction */
  suggestedParams: SuggestedParams
  /** Optional, arbitrary data to be stored in the transaction's note field */
  note?: Uint8Array
  /**
   * Optional, 32-byte lease to associate with this transaction.
   *
   * The sender cannot send another transaction with the same lease until the last round of original
   * transaction has passed.
   */
  lease?: Uint8Array
  /** The Algorand address that will be used to authorize all future transactions from the sender, if provided. */
  rekeyTo?: string | Address
}

/**
 * Create a new payment transaction
 *
 * @param options - Payment transaction parameters
 */
export function makePaymentTxnWithSuggestedParamsFromObject({
  sender,
  receiver,
  amount,
  closeRemainderTo,
  suggestedParams,
  note,
  lease,
  rekeyTo,
}: PaymentTransactionParams & CommonTransactionParams): Transaction {
  const txn: Transaction = {
    type: TransactionType.Payment,
    sender: addressToClass(sender)!,
    firstValid: BigInt(suggestedParams.firstValid),
    lastValid: BigInt(suggestedParams.lastValid),
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    note,
    lease,
    rekeyTo: addressToClass(rekeyTo),
    payment: {
      receiver: addressToClass(receiver)!,
      amount: ensureBigInt(amount)!,
      closeRemainderTo: addressToClass(closeRemainderTo),
    },
  }

  return txn
}

/**
 * Create a new key registration transaction
 *
 * @param options - Key registration transaction parameters
 */
export function makeKeyRegistrationTxnWithSuggestedParamsFromObject({
  sender,
  voteKey,
  selectionKey,
  stateProofKey,
  voteFirst,
  voteLast,
  voteKeyDilution,
  nonParticipation,
  suggestedParams,
  note,
  lease,
  rekeyTo,
}: KeyRegistrationTransactionParams & CommonTransactionParams): Transaction {
  const txn: Transaction = {
    type: TransactionType.KeyRegistration,
    sender: addressToClass(sender)!,
    firstValid: BigInt(suggestedParams.firstValid),
    lastValid: BigInt(suggestedParams.lastValid),
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    note,
    lease,
    rekeyTo: addressToClass(rekeyTo),
    keyRegistration: {
      voteKey,
      selectionKey,
      stateProofKey,
      voteFirst: ensureBigInt(voteFirst),
      voteLast: ensureBigInt(voteLast),
      voteKeyDilution: ensureBigInt(voteKeyDilution),
      nonParticipation,
    },
  }

  return txn
}

/**
 * Base function for creating any type of asset config transaction.
 *
 * @param options - Asset config transaction parameters
 */
export function makeBaseAssetConfigTxn({
  sender,
  assetIndex,
  total,
  decimals,
  defaultFrozen,
  manager,
  reserve,
  freeze,
  clawback,
  unitName,
  assetName,
  assetURL,
  assetMetadataHash,
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: AssetConfigurationTransactionParams & CommonTransactionParams): Transaction {
  const txn: Transaction = {
    type: TransactionType.AssetConfig,
    sender: addressToClass(sender)!,
    firstValid: BigInt(suggestedParams.firstValid),
    lastValid: BigInt(suggestedParams.lastValid),
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    note,
    lease,
    rekeyTo: addressToClass(rekeyTo),
    assetConfig: {
      assetId: ensureBigInt(assetIndex)!,
      total: ensureBigInt(total),
      decimals: typeof decimals === 'number' ? decimals : undefined,
      defaultFrozen,
      manager: addressToClass(manager),
      reserve: addressToClass(reserve),
      freeze: addressToClass(freeze),
      clawback: addressToClass(clawback),
      unitName,
      assetName,
      url: assetURL,
      metadataHash: assetMetadataHash,
    },
  }

  return txn
}

/**
 * Create a new asset creation transaction
 *
 * @param options - Asset creation transaction parameters
 */
export function makeAssetCreateTxnWithSuggestedParamsFromObject({
  sender,
  total,
  decimals,
  defaultFrozen,
  manager,
  reserve,
  freeze,
  clawback,
  unitName,
  assetName,
  assetURL,
  assetMetadataHash,
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: Omit<AssetConfigurationTransactionParams, 'assetIndex'> & CommonTransactionParams): Transaction {
  return makeBaseAssetConfigTxn({
    sender,
    assetIndex: 0,
    total,
    decimals,
    defaultFrozen,
    manager,
    reserve,
    freeze,
    clawback,
    unitName,
    assetName,
    assetURL,
    assetMetadataHash,
    note,
    lease,
    rekeyTo,
    suggestedParams,
  })
}

/** Contains asset modification transaction parameters */
export interface AssetModificationTransactionParams {
  /**
   * The unique ID of the asset to be modified
   */
  assetIndex: number | bigint

  /**
   * The Algorand address in charge of reserve, freeze, clawback, destruction, etc.
   *
   * If empty, this role will be irrevocably removed from this asset.
   */
  manager?: string | Address

  /**
   * The Algorand address representing asset reserve.
   *
   * If empty, this role will be irrevocably removed from this asset.
   */
  reserve?: string | Address

  /**
   * The Algorand address with power to freeze/unfreeze asset holdings.
   *
   * If empty, this role will be irrevocably removed from this asset.
   */
  freeze?: string | Address

  /**
   * The Algorand address with power to revoke asset holdings.
   *
   * If empty, this role will be irrevocably removed from this asset.
   */
  clawback?: string | Address

  /**
   * This is a safety flag to prevent unintentionally removing a role from an asset. If undefined or
   * true, an error will be thrown if any of assetManager, assetReserve, assetFreeze, or
   * assetClawback are empty.
   *
   * Set this to false to allow removing roles by leaving the corresponding address empty.
   */
  strictEmptyAddressChecking?: boolean
}

/**
 * Create a new asset config transaction. This transaction can be issued by the asset manager to
 * change the manager, reserve, freeze, or clawback address.
 *
 * You must respecify existing addresses to keep them the same; leaving a field blank is the same as
 * turning that feature off for this asset.
 *
 * @param options - Asset modification transaction parameters
 */
export function makeAssetConfigTxnWithSuggestedParamsFromObject({
  sender,
  assetIndex,
  manager,
  reserve,
  freeze,
  clawback,
  strictEmptyAddressChecking,
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: AssetModificationTransactionParams & CommonTransactionParams): Transaction {
  if (!assetIndex) {
    throw Error('assetIndex must be provided')
  }
  const strictChecking = strictEmptyAddressChecking ?? true
  if (strictChecking && (manager == null || reserve == null || freeze == null || clawback == null)) {
    throw Error(
      'strictEmptyAddressChecking is enabled, but an address is empty. If this is intentional, set strictEmptyAddressChecking to false.',
    )
  }
  return makeBaseAssetConfigTxn({
    sender,
    assetIndex,
    manager,
    reserve,
    freeze,
    clawback,
    note,
    lease,
    rekeyTo,
    suggestedParams,
  })
}

/**
 * Create a new asset destroy transaction. This will allow the asset's manager to remove this asset
 * from the ledger, provided all outstanding assets are held by the creator.
 *
 * @param options - Asset destroy transaction parameters
 */
export function makeAssetDestroyTxnWithSuggestedParamsFromObject({
  sender,
  assetIndex,
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: Required<Pick<AssetConfigurationTransactionParams, 'assetIndex'>> & CommonTransactionParams): Transaction {
  if (!assetIndex) {
    throw Error('assetIndex must be provided')
  }
  return makeBaseAssetConfigTxn({
    sender,
    assetIndex,
    note,
    lease,
    rekeyTo,
    suggestedParams,
  })
}

/**
 * Create a new asset freeze transaction. This transaction allows the asset's freeze manager to
 * freeze or un-freeze an account, blocking or allowing asset transfers to and from the targeted
 * account.
 *
 * @param options - Asset freeze transaction parameters
 */
export function makeAssetFreezeTxnWithSuggestedParamsFromObject({
  sender,
  assetIndex,
  freezeTarget,
  frozen,
  suggestedParams,
  note,
  lease,
  rekeyTo,
}: AssetFreezeTransactionParams & CommonTransactionParams): Transaction {
  const txn: Transaction = {
    type: TransactionType.AssetFreeze,
    sender: addressToClass(sender)!,
    firstValid: BigInt(suggestedParams.firstValid),
    lastValid: BigInt(suggestedParams.lastValid),
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    note,
    lease,
    rekeyTo: addressToClass(rekeyTo),
    assetFreeze: {
      assetId: ensureBigInt(assetIndex)!,
      freezeTarget: addressToClass(freezeTarget)!,
      frozen,
    },
  }

  return txn
}

/**
 * Create a new asset transfer transaction.
 *
 * Special case: to opt into an assets, set amount=0 and sender=receiver.
 *
 * @param options - Asset transfer transaction parameters
 */
export function makeAssetTransferTxnWithSuggestedParamsFromObject({
  sender,
  receiver,
  amount,
  closeRemainderTo,
  assetSender,
  note,
  assetIndex,
  suggestedParams,
  rekeyTo,
  lease,
}: AssetTransferTransactionParams & CommonTransactionParams): Transaction {
  if (!assetIndex) {
    throw Error('assetIndex must be provided')
  }

  const txn: Transaction = {
    type: TransactionType.AssetTransfer,
    sender: addressToClass(sender)!,
    firstValid: BigInt(suggestedParams.firstValid),
    lastValid: BigInt(suggestedParams.lastValid),
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    note,
    lease,
    rekeyTo: addressToClass(rekeyTo),
    assetTransfer: {
      assetId: ensureBigInt(assetIndex)!,
      receiver: addressToClass(receiver)!,
      amount: ensureBigInt(amount)!,
      assetSender: addressToClass(assetSender),
      closeRemainderTo: addressToClass(closeRemainderTo),
    },
  }

  return txn
}

/**
 * Base function for creating any application call transaction.
 *
 * @param options - Application call transaction parameters
 */
export function makeApplicationCallTxnFromObject({
  sender,
  appIndex,
  onComplete,
  appArgs,
  accounts,
  foreignApps,
  foreignAssets,
  boxes,
  convertToAccess,
  holdings,
  locals,
  access,
  approvalProgram,
  clearProgram,
  numLocalInts,
  numLocalByteSlices,
  numGlobalInts,
  numGlobalByteSlices,
  extraPages,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rejectVersion, // TODO: handle reject version
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: ApplicationCallTransactionParams & CommonTransactionParams & ApplicationCallReferenceParams): Transaction {
  if (onComplete == null) {
    throw Error('onComplete must be provided')
  }
  if (access && (accounts || foreignApps || foreignAssets || boxes || holdings || locals)) {
    throw Error('cannot specify both access and other access fields')
  }
  let access2 = access
  if (convertToAccess) {
    access2 = foreignArraysToResourceReferences({
      appIndex,
      accounts: accounts?.map((a) => addressToClass(a)!),
      foreignApps,
      foreignAssets,
      holdings,
      locals,
      boxes,
    })
  }

  // Convert legacy foreign arrays to new format if access is not provided
  const accountReferences = access2 ? undefined : accounts?.map((a) => addressToClass(a)!)
  const appReferences = access2 ? undefined : foreignApps?.map((a) => ensureBigInt(a)!)
  const assetReferences = access2 ? undefined : foreignAssets?.map((a) => ensureBigInt(a)!)

  // Convert boxes if present (boxes have app index and name)
  const boxReferences = access2
    ? undefined
    : boxes?.map((box) => ({
        appId: ensureBigInt(box.appId) || BigInt(0),
        name: box.name,
      }))

  const txn: Transaction = {
    type: TransactionType.AppCall,
    sender: addressToClass(sender)!,
    firstValid: BigInt(suggestedParams.firstValid),
    lastValid: BigInt(suggestedParams.lastValid),
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    note,
    lease,
    rekeyTo: addressToClass(rekeyTo),
    appCall: {
      appId: ensureBigInt(appIndex) || BigInt(0),
      onComplete,
      approvalProgram,
      clearStateProgram: clearProgram,
      globalStateSchema:
        numGlobalInts !== undefined || numGlobalByteSlices !== undefined
          ? {
              numUints: Number(numGlobalInts) || 0,
              numByteSlices: Number(numGlobalByteSlices) || 0,
            }
          : undefined,
      localStateSchema:
        numLocalInts !== undefined || numLocalByteSlices !== undefined
          ? {
              numUints: Number(numLocalInts) || 0,
              numByteSlices: Number(numLocalByteSlices) || 0,
            }
          : undefined,
      extraProgramPages: extraPages !== undefined ? Number(extraPages) : undefined,
      args: appArgs,
      // Only pass legacy foreign arrays if access is not provided
      accountReferences: access2 ? undefined : accountReferences,
      assetReferences: access2 ? undefined : assetReferences,
      appReferences: access2 ? undefined : appReferences,
      boxReferences: access2 ? undefined : boxReferences,
      accessReferences: access2,
    },
  }

  return txn
}

/**
 * Make a transaction that will create an application.
 *
 * @param options - Application creation transaction parameters
 */
export function makeApplicationCreateTxnFromObject({
  sender,
  onComplete,
  appArgs,
  accounts,
  foreignApps,
  foreignAssets,
  boxes,
  convertToAccess,
  holdings,
  locals,
  access,
  approvalProgram,
  clearProgram,
  numLocalInts,
  numLocalByteSlices,
  numGlobalInts,
  numGlobalByteSlices,
  extraPages,
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: Omit<ApplicationCallTransactionParams, 'appIndex' | 'approvalProgram' | 'clearProgram'> &
  Required<Pick<ApplicationCallTransactionParams, 'approvalProgram' | 'clearProgram'>> &
  CommonTransactionParams &
  ApplicationCallReferenceParams): Transaction {
  if (!approvalProgram || !clearProgram) {
    throw Error('approvalProgram and clearProgram must be provided')
  }
  if (onComplete == null) {
    throw Error('onComplete must be provided')
  }
  return makeApplicationCallTxnFromObject({
    sender,
    appIndex: 0,
    onComplete,
    appArgs,
    accounts,
    foreignApps,
    foreignAssets,
    boxes,
    convertToAccess,
    holdings,
    locals,
    access,
    approvalProgram,
    clearProgram,
    numLocalInts,
    numLocalByteSlices,
    numGlobalInts,
    numGlobalByteSlices,
    extraPages,
    note,
    lease,
    rekeyTo,
    suggestedParams,
  })
}

/**
 * Make a transaction that changes an application's approval and clear programs
 *
 * @param options - Application update transaction parameters
 */
export function makeApplicationUpdateTxnFromObject({
  sender,
  appIndex,
  appArgs,
  accounts,
  foreignApps,
  foreignAssets,
  boxes,
  convertToAccess,
  holdings,
  locals,
  access,
  approvalProgram,
  clearProgram,
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: Omit<
  ApplicationCallTransactionParams,
  | 'onComplete'
  | 'numLocalInts'
  | 'numLocalByteSlices'
  | 'numGlobalInts'
  | 'numGlobalByteSlices'
  | 'extraPages'
  | 'approvalProgram'
  | 'clearProgram'
> &
  Required<Pick<ApplicationCallTransactionParams, 'approvalProgram' | 'clearProgram'>> &
  CommonTransactionParams &
  ApplicationCallReferenceParams): Transaction {
  if (!appIndex) {
    throw Error('appIndex must be provided')
  }
  if (!approvalProgram || !clearProgram) {
    throw Error('approvalProgram and clearProgram must be provided')
  }
  return makeApplicationCallTxnFromObject({
    sender,
    appIndex,
    onComplete: OnApplicationComplete.UpdateApplication,
    appArgs,
    accounts,
    foreignApps,
    foreignAssets,
    boxes,
    convertToAccess,
    holdings,
    locals,
    access,
    approvalProgram,
    clearProgram,
    note,
    lease,
    rekeyTo,
    suggestedParams,
  })
}

/**
 * Make a transaction that deletes an application
 *
 * @param options - Application deletion transaction parameters
 */
export function makeApplicationDeleteTxnFromObject({
  sender,
  appIndex,
  appArgs,
  accounts,
  foreignApps,
  foreignAssets,
  boxes,
  convertToAccess,
  holdings,
  locals,
  access,
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: Omit<
  ApplicationCallTransactionParams,
  | 'onComplete'
  | 'numLocalInts'
  | 'numLocalByteSlices'
  | 'numGlobalInts'
  | 'numGlobalByteSlices'
  | 'extraPages'
  | 'approvalProgram'
  | 'clearProgram'
> &
  CommonTransactionParams &
  ApplicationCallReferenceParams): Transaction {
  if (!appIndex) {
    throw Error('appIndex must be provided')
  }
  return makeApplicationCallTxnFromObject({
    sender,
    appIndex,
    onComplete: OnApplicationComplete.DeleteApplication,
    appArgs,
    accounts,
    foreignApps,
    foreignAssets,
    boxes,
    convertToAccess,
    holdings,
    locals,
    access,
    note,
    lease,
    rekeyTo,
    suggestedParams,
  })
}

/**
 * Make a transaction that opts in to use an application
 *
 * @param options - Application opt-in transaction parameters
 */
export function makeApplicationOptInTxnFromObject({
  sender,
  appIndex,
  appArgs,
  accounts,
  foreignApps,
  foreignAssets,
  boxes,
  convertToAccess,
  holdings,
  locals,
  access,
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: Omit<
  ApplicationCallTransactionParams,
  | 'onComplete'
  | 'numLocalInts'
  | 'numLocalByteSlices'
  | 'numGlobalInts'
  | 'numGlobalByteSlices'
  | 'extraPages'
  | 'approvalProgram'
  | 'clearProgram'
> &
  CommonTransactionParams &
  ApplicationCallReferenceParams): Transaction {
  if (!appIndex) {
    throw Error('appIndex must be provided')
  }
  return makeApplicationCallTxnFromObject({
    sender,
    appIndex,
    onComplete: OnApplicationComplete.OptIn,
    appArgs,
    accounts,
    foreignApps,
    foreignAssets,
    boxes,
    note,
    convertToAccess,
    holdings,
    locals,
    access,
    lease,
    rekeyTo,
    suggestedParams,
  })
}

/**
 * Make a transaction that closes out a user's state in an application
 *
 * @param options - Application close-out transaction parameters
 */
export function makeApplicationCloseOutTxnFromObject({
  sender,
  appIndex,
  appArgs,
  accounts,
  foreignApps,
  foreignAssets,
  boxes,
  convertToAccess,
  holdings,
  locals,
  access,
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: Omit<
  ApplicationCallTransactionParams,
  | 'onComplete'
  | 'numLocalInts'
  | 'numLocalByteSlices'
  | 'numGlobalInts'
  | 'numGlobalByteSlices'
  | 'extraPages'
  | 'approvalProgram'
  | 'clearProgram'
> &
  CommonTransactionParams &
  ApplicationCallReferenceParams): Transaction {
  if (!appIndex) {
    throw Error('appIndex must be provided')
  }
  return makeApplicationCallTxnFromObject({
    sender,
    appIndex,
    onComplete: OnApplicationComplete.CloseOut,
    appArgs,
    accounts,
    foreignApps,
    foreignAssets,
    boxes,
    convertToAccess,
    holdings,
    locals,
    access,
    note,
    lease,
    rekeyTo,
    suggestedParams,
  })
}

/**
 * Make a transaction that clears a user's state in an application
 *
 * @param options - Application clear state transaction parameters
 */
export function makeApplicationClearStateTxnFromObject({
  sender,
  appIndex,
  appArgs,
  accounts,
  foreignApps,
  foreignAssets,
  boxes,
  convertToAccess,
  holdings,
  locals,
  access,
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: Omit<
  ApplicationCallTransactionParams,
  | 'onComplete'
  | 'numLocalInts'
  | 'numLocalByteSlices'
  | 'numGlobalInts'
  | 'numGlobalByteSlices'
  | 'extraPages'
  | 'approvalProgram'
  | 'clearProgram'
> &
  CommonTransactionParams &
  ApplicationCallReferenceParams): Transaction {
  if (!appIndex) {
    throw Error('appIndex must be provided')
  }
  return makeApplicationCallTxnFromObject({
    sender,
    appIndex,
    onComplete: OnApplicationComplete.ClearState,
    appArgs,
    accounts,
    foreignApps,
    foreignAssets,
    boxes,
    convertToAccess,
    holdings,
    locals,
    access,
    note,
    lease,
    rekeyTo,
    suggestedParams,
  })
}

/**
 * Make a transaction that just calls an application, doing nothing on completion
 *
 * @param options - Application no-op transaction parameters
 */
export function makeApplicationNoOpTxnFromObject({
  sender,
  appIndex,
  appArgs,
  accounts,
  foreignApps,
  foreignAssets,
  boxes,
  convertToAccess,
  holdings,
  locals,
  access,
  note,
  lease,
  rekeyTo,
  suggestedParams,
}: Omit<
  ApplicationCallTransactionParams,
  | 'onComplete'
  | 'numLocalInts'
  | 'numLocalByteSlices'
  | 'numGlobalInts'
  | 'numGlobalByteSlices'
  | 'extraPages'
  | 'approvalProgram'
  | 'clearProgram'
> &
  CommonTransactionParams &
  ApplicationCallReferenceParams): Transaction {
  if (!appIndex) {
    throw Error('appIndex must be provided')
  }
  return makeApplicationCallTxnFromObject({
    sender,
    appIndex,
    onComplete: OnApplicationComplete.NoOp,
    appArgs,
    accounts,
    foreignApps,
    foreignAssets,
    boxes,
    convertToAccess,
    holdings,
    locals,
    access,
    note,
    lease,
    rekeyTo,
    suggestedParams,
  })
}
