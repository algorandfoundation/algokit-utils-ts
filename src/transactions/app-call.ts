import {
  ApplicationLocalReference,
  AssetHoldingReference,
  SimulateUnnamedResourcesAccessed,
  SuggestedParams,
} from '@algorandfoundation/algokit-algod-client'
import { MAX_ACCOUNT_REFERENCES, MAX_OVERALL_REFERENCES, getAppAddress } from '@algorandfoundation/algokit-common'
import {
  AccessReference,
  OnApplicationComplete,
  BoxReference as TransactBoxReference,
  Transaction,
  TransactionType,
} from '@algorandfoundation/algokit-transact'
import { Address } from '@algorandfoundation/sdk'
import { AppManager, BoxIdentifier, BoxReference as UtilsBoxReference } from '../types/app-manager'
import { Expand } from '../types/expand'
import { calculateExtraProgramPages } from '../util'
import { CommonTransactionParams, buildTransactionCommonData } from './common'

/** Common parameters for defining an application call transaction. */
export type CommonAppCallParams = CommonTransactionParams & {
  /** ID of the application; 0 if the application is being created. */
  appId: bigint
  /** The [on-complete](https://dev.algorand.co/concepts/smart-contracts/avm#oncomplete) action of the call; defaults to no-op. */
  onComplete?: OnApplicationComplete
  /** Any [arguments to pass to the smart contract call](/concepts/smart-contracts/languages/teal/#argument-passing). */
  args?: Uint8Array[]
  /** Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). */
  accountReferences?: (string | Address)[]
  /** The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). */
  appReferences?: bigint[]
  /** The ID of any assets to load to the [foreign assets array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). */
  assetReferences?: bigint[]
  /** Any boxes to load to the [boxes array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).
   *
   * Either the name identifier (which will be set against app ID of `0` i.e.
   *  the current app), or a box identifier with the name identifier and app ID.
   */
  boxReferences?: (UtilsBoxReference | BoxIdentifier)[]
  /** Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. */
  accessReferences?: AccessReference[]
  /** The lowest application version for which this transaction should immediately fail. 0 indicates that no version check should be performed. */
  rejectVersion?: number
}

/** Parameters to define an app create transaction */
export type AppCreateParams = Expand<
  Omit<CommonAppCallParams, 'appId'> & {
    onComplete?: Exclude<OnApplicationComplete, OnApplicationComplete.ClearState>
    /** The program to execute for all OnCompletes other than ClearState as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). */
    approvalProgram: string | Uint8Array
    /** The program to execute for ClearState OnComplete as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). */
    clearStateProgram: string | Uint8Array
    /** The state schema for the app. This is immutable once the app is created. */
    schema?: {
      /** The number of integers saved in global state. */
      globalInts: number
      /** The number of byte slices saved in global state. */
      globalByteSlices: number
      /** The number of integers saved in local state. */
      localInts: number
      /** The number of byte slices saved in local state. */
      localByteSlices: number
    }
    /** Number of extra pages required for the programs.
     * Defaults to the number needed for the programs in this call if not specified.
     * This is immutable once the app is created. */
    extraProgramPages?: number
  }
>

/** Parameters to define an app update transaction */
export type AppUpdateParams = Expand<
  CommonAppCallParams & {
    onComplete?: OnApplicationComplete.UpdateApplication
    /** The program to execute for all OnCompletes other than ClearState as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) */
    approvalProgram: string | Uint8Array
    /** The program to execute for ClearState OnComplete as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) */
    clearStateProgram: string | Uint8Array
  }
>

/** Parameters to define an application call transaction. */
export type AppCallParams = CommonAppCallParams & {
  onComplete?: Exclude<OnApplicationComplete, OnApplicationComplete.UpdateApplication>
}

/** Common parameters to define an ABI method call transaction. */
export type AppMethodCallParams = CommonAppCallParams & {
  onComplete?: Exclude<OnApplicationComplete, OnApplicationComplete.UpdateApplication | OnApplicationComplete.ClearState>
}

/** Parameters to define an application delete call transaction. */
export type AppDeleteParams = CommonAppCallParams & {
  onComplete?: OnApplicationComplete.DeleteApplication
}

export const buildAppCreate = async (
  params: AppCreateParams,
  appManager: AppManager,
  suggestedParams: SuggestedParams,
  defaultValidityWindow: bigint,
): Promise<Transaction> => {
  const commonData = buildTransactionCommonData(params, suggestedParams, defaultValidityWindow)
  const approvalProgram =
    typeof params.approvalProgram === 'string'
      ? (await appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
      : params.approvalProgram
  const clearStateProgram =
    typeof params.clearStateProgram === 'string'
      ? (await appManager.compileTeal(params.clearStateProgram)).compiledBase64ToBytes
      : params.clearStateProgram
  const globalStateSchema =
    params.schema?.globalByteSlices !== undefined || params.schema?.globalInts !== undefined
      ? {
          numByteSlices: params.schema?.globalByteSlices ?? 0,
          numUints: params.schema?.globalInts ?? 0,
        }
      : undefined
  const localStateSchema =
    params.schema?.localByteSlices !== undefined || params.schema?.localInts !== undefined
      ? {
          numByteSlices: params.schema?.localByteSlices ?? 0,
          numUints: params.schema?.localInts ?? 0,
        }
      : undefined
  const extraProgramPages =
    params.extraProgramPages !== undefined ? params.extraProgramPages : calculateExtraProgramPages(approvalProgram!, clearStateProgram!)

  // If accessReferences is provided, we should not pass legacy foreign arrays
  const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

  return {
    ...commonData,
    type: TransactionType.AppCall,
    appCall: {
      appId: 0n, // App creation always uses ID 0
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      approvalProgram: approvalProgram,
      clearStateProgram: clearStateProgram,
      globalStateSchema: globalStateSchema,
      localStateSchema: localStateSchema,
      extraProgramPages: extraProgramPages,
      args: params.args,
      ...(hasAccessReferences
        ? { accessReferences: params.accessReferences }
        : {
            accountReferences: params.accountReferences?.map((a) => a.toString()),
            appReferences: params.appReferences,
            assetReferences: params.assetReferences,
            boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
          }),
      rejectVersion: params.rejectVersion,
    },
  } satisfies Transaction
}

export const buildAppUpdate = async (
  params: AppUpdateParams,
  appManager: AppManager,
  suggestedParams: SuggestedParams,
  defaultValidityWindow: bigint,
): Promise<Transaction> => {
  const commonData = buildTransactionCommonData(params, suggestedParams, defaultValidityWindow)
  const approvalProgram =
    typeof params.approvalProgram === 'string'
      ? (await appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
      : params.approvalProgram
  const clearStateProgram =
    typeof params.clearStateProgram === 'string'
      ? (await appManager.compileTeal(params.clearStateProgram)).compiledBase64ToBytes
      : params.clearStateProgram

  // If accessReferences is provided, we should not pass legacy foreign arrays
  const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

  return {
    ...commonData,
    type: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: OnApplicationComplete.UpdateApplication,
      approvalProgram: approvalProgram,
      clearStateProgram: clearStateProgram,
      args: params.args,
      ...(hasAccessReferences
        ? { accessReferences: params.accessReferences }
        : {
            accountReferences: params.accountReferences?.map((a) => a.toString()),
            appReferences: params.appReferences,
            assetReferences: params.assetReferences,
            boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
          }),
      rejectVersion: params.rejectVersion,
    },
  } satisfies Transaction
}

export const buildAppCall = (
  params: AppCallParams | AppDeleteParams,
  suggestedParams: SuggestedParams,
  defaultValidityWindow: bigint,
): Transaction => {
  const commonData = buildTransactionCommonData(params, suggestedParams, defaultValidityWindow)
  // If accessReferences is provided, we should not pass legacy foreign arrays
  const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

  return {
    ...commonData,
    type: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      args: params.args,
      ...(hasAccessReferences
        ? { accessReferences: params.accessReferences }
        : {
            accountReferences: params.accountReferences?.map((a) => a.toString()),
            appReferences: params.appReferences,
            assetReferences: params.assetReferences,
            boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
          }),
      rejectVersion: params.rejectVersion,
    },
  } satisfies Transaction
}

/**
 * Populate transaction-level resources for app call transactions
 */
export function populateTransactionResources(
  transaction: Transaction, // NOTE: transaction is mutated in place
  resourcesAccessed: SimulateUnnamedResourcesAccessed,
  groupIndex: number,
): void {
  if (transaction.type !== TransactionType.AppCall || transaction.appCall === undefined) {
    return
  }

  // Check for unexpected resources at transaction level
  if (resourcesAccessed.boxes || resourcesAccessed.extraBoxRefs) {
    throw new Error('Unexpected boxes at the transaction level')
  }
  if (resourcesAccessed.appLocals) {
    throw new Error('Unexpected app locals at the transaction level')
  }
  if (resourcesAccessed.assetHoldings) {
    throw new Error('Unexpected asset holdings at the transaction level')
  }

  let accountsCount = 0
  let appsCount = 0
  let assetsCount = 0
  const boxesCount = transaction.appCall.boxReferences?.length ?? 0

  // Populate accounts
  if (resourcesAccessed.accounts) {
    transaction.appCall.accountReferences = transaction.appCall.accountReferences ?? []
    for (const account of resourcesAccessed.accounts) {
      if (!transaction.appCall.accountReferences.includes(account)) {
        transaction.appCall.accountReferences.push(account)
      }
    }
    accountsCount = transaction.appCall.accountReferences.length
  }

  // Populate apps
  if (resourcesAccessed.apps) {
    transaction.appCall.appReferences = transaction.appCall.appReferences ?? []
    for (const appId of resourcesAccessed.apps) {
      if (!transaction.appCall.appReferences.includes(appId)) {
        transaction.appCall.appReferences.push(appId)
      }
    }
    appsCount = transaction.appCall.appReferences.length
  }

  // Populate assets
  if (resourcesAccessed.assets) {
    transaction.appCall.assetReferences = transaction.appCall.assetReferences ?? []
    for (const assetId of resourcesAccessed.assets) {
      if (!transaction.appCall.assetReferences.includes(assetId)) {
        transaction.appCall.assetReferences.push(assetId)
      }
    }
    assetsCount = transaction.appCall.assetReferences.length
  }

  // Validate reference limits
  if (accountsCount > MAX_ACCOUNT_REFERENCES) {
    throw new Error(`Account reference limit of ${MAX_ACCOUNT_REFERENCES} exceeded in transaction ${groupIndex}`)
  }

  if (accountsCount + assetsCount + appsCount + boxesCount > MAX_OVERALL_REFERENCES) {
    throw new Error(`Resource reference limit of ${MAX_OVERALL_REFERENCES} exceeded in transaction ${groupIndex}`)
  }
}

enum GroupResourceType {
  Account,
  App,
  Asset,
  Box,
  ExtraBoxRef,
  AssetHolding,
  AppLocal,
}

/**
 * Populate group-level resources for app call transactions
 */
export function populateGroupResources(
  transactions: Transaction[], // NOTE: transactions are mutated in place
  groupResources: SimulateUnnamedResourcesAccessed,
): void {
  let remainingAccounts = [...(groupResources.accounts ?? [])]
  let remainingApps = [...(groupResources.apps ?? [])]
  let remainingAssets = [...(groupResources.assets ?? [])]
  const remainingBoxes = [...(groupResources.boxes ?? [])]

  // Process cross-reference resources first (app locals and asset holdings) as they are most restrictive
  if (groupResources.appLocals) {
    groupResources.appLocals.forEach((appLocal) => {
      populateGroupResource(transactions, { type: GroupResourceType.AppLocal, data: appLocal })
      // Remove resources from remaining if we're adding them here
      remainingAccounts = remainingAccounts.filter((acc) => acc !== appLocal.account)
      remainingApps = remainingApps.filter((app) => app !== appLocal.app)
    })
  }

  if (groupResources.assetHoldings) {
    groupResources.assetHoldings.forEach((assetHolding) => {
      populateGroupResource(transactions, { type: GroupResourceType.AssetHolding, data: assetHolding })
      // Remove resources from remaining if we're adding them here
      remainingAccounts = remainingAccounts.filter((acc) => acc !== assetHolding.account)
      remainingAssets = remainingAssets.filter((asset) => asset !== assetHolding.asset)
    })
  }

  // Process accounts next because account limit is 4
  remainingAccounts.forEach((account) => {
    populateGroupResource(transactions, { type: GroupResourceType.Account, data: account })
  })

  // Process boxes
  remainingBoxes.forEach((boxRef) => {
    populateGroupResource(transactions, {
      type: GroupResourceType.Box,
      data: {
        appId: boxRef.app,
        name: boxRef.name,
      },
    })
    // Remove apps as resource if we're adding it here
    remainingApps = remainingApps.filter((app) => app !== boxRef.app)
  })

  // Process assets
  remainingAssets.forEach((asset) => {
    populateGroupResource(transactions, { type: GroupResourceType.Asset, data: asset })
  })

  // Process remaining apps
  remainingApps.forEach((app) => {
    populateGroupResource(transactions, { type: GroupResourceType.App, data: app })
  })

  // Handle extra box refs
  if (groupResources.extraBoxRefs) {
    for (let i = 0; i < groupResources.extraBoxRefs; i++) {
      populateGroupResource(transactions, { type: GroupResourceType.ExtraBoxRef })
    }
  }
}

/**
 * Helper function to check if an app call transaction is below resource limit
 */
function isAppCallBelowResourceLimit(txn: Transaction): boolean {
  if (txn.type !== TransactionType.AppCall) {
    return false
  }
  if (txn.appCall?.accessReferences?.length) {
    return false
  }

  const accountsCount = txn.appCall?.accountReferences?.length || 0
  const assetsCount = txn.appCall?.assetReferences?.length || 0
  const appsCount = txn.appCall?.appReferences?.length || 0
  const boxesCount = txn.appCall?.boxReferences?.length || 0

  return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES
}

type GroupResourceToPopulate =
  | { type: GroupResourceType.Account; data: string }
  | { type: GroupResourceType.App; data: bigint }
  | { type: GroupResourceType.Asset; data: bigint }
  | { type: GroupResourceType.Box; data: TransactBoxReference }
  | { type: GroupResourceType.ExtraBoxRef }
  | { type: GroupResourceType.AssetHolding; data: AssetHoldingReference }
  | { type: GroupResourceType.AppLocal; data: ApplicationLocalReference }

/**
 * Helper function to populate a specific resource into a transaction group
 */
function populateGroupResource(
  transactions: Transaction[], // NOTE: transactions are mutated in place
  resource: GroupResourceToPopulate,
): void {
  // For asset holdings and app locals, first try to find a transaction that already has the account available
  if (resource.type === GroupResourceType.AssetHolding || resource.type === GroupResourceType.AppLocal) {
    const account = resource.data.account

    // Try to find a transaction that already has the account available
    const groupIndex1 = transactions.findIndex((txn) => {
      if (!isAppCallBelowResourceLimit(txn)) {
        return false
      }

      const appCall = txn.appCall!

      // Check if account is in foreign accounts array
      if (appCall.accountReferences?.includes(account)) {
        return true
      }

      // Check if account is available as an app account
      if (appCall.appReferences) {
        for (const appId of appCall.appReferences) {
          if (account === getAppAddress(appId)) {
            return true
          }
        }
      }

      // Check if account appears in any app call transaction fields
      if (txn.sender === account) {
        return true
      }

      return false
    })

    if (groupIndex1 !== -1) {
      const appCall = transactions[groupIndex1].appCall!
      if (resource.type === GroupResourceType.AssetHolding) {
        appCall.assetReferences = appCall.assetReferences ?? []
        if (!appCall.assetReferences.includes(resource.data.asset)) {
          appCall.assetReferences.push(resource.data.asset)
        }
      } else {
        appCall.appReferences = appCall.appReferences ?? []
        if (!appCall.appReferences.includes(resource.data.app)) {
          appCall.appReferences.push(resource.data.app)
        }
      }
      return
    }

    // Try to find a transaction that has the asset/app available and space for account
    const groupIndex2 = transactions.findIndex((txn) => {
      if (!isAppCallBelowResourceLimit(txn)) {
        return false
      }

      const appCall = txn.appCall!
      if ((appCall.accountReferences?.length ?? 0) >= MAX_ACCOUNT_REFERENCES) {
        return false
      }

      if (resource.type === GroupResourceType.AssetHolding) {
        return appCall.assetReferences?.includes(resource.data.asset) || false
      } else {
        return appCall.appReferences?.includes(resource.data.app) || appCall.appId === resource.data.app
      }
    })

    if (groupIndex2 !== -1) {
      const appCall = transactions[groupIndex2].appCall!
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(account)) {
        appCall.accountReferences.push(account)
      }
      return
    }
  }

  // For boxes, first try to find a transaction that already has the app available
  if (resource.type === GroupResourceType.Box) {
    const groupIndex = transactions.findIndex((txn) => {
      if (!isAppCallBelowResourceLimit(txn)) {
        return false
      }

      const appCall = txn.appCall!
      return appCall.appReferences?.includes(resource.data.appId) || appCall.appId === resource.data.appId
    })

    if (groupIndex !== -1) {
      const appCall = transactions[groupIndex].appCall!
      appCall.boxReferences = appCall.boxReferences ?? []
      const exists = appCall.boxReferences.some(
        (b) =>
          b.appId === resource.data.appId &&
          b.name.length === resource.data.name.length &&
          b.name.every((byte, i) => byte === resource.data.name[i]),
      )
      if (!exists) {
        appCall.boxReferences.push({ appId: resource.data.appId, name: resource.data.name })
      }
      return
    }
  }

  // Find the first transaction that can accommodate the resource
  const groupIndex = transactions.findIndex((txn) => {
    if (txn.type !== TransactionType.AppCall) {
      return false
    }
    if (txn.appCall?.accessReferences?.length) {
      return false
    }

    const appCall = txn.appCall!
    const accountsCount = appCall.accountReferences?.length ?? 0
    const assetsCount = appCall.assetReferences?.length ?? 0
    const appsCount = appCall.appReferences?.length ?? 0
    const boxesCount = appCall.boxReferences?.length ?? 0

    switch (resource.type) {
      case GroupResourceType.Account:
        return accountsCount < MAX_ACCOUNT_REFERENCES
      case GroupResourceType.AssetHolding:
      case GroupResourceType.AppLocal:
        return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES - 1 && accountsCount < MAX_ACCOUNT_REFERENCES
      case GroupResourceType.Box:
        if (resource.data.appId !== 0n) {
          return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES - 1
        } else {
          return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES
        }
      default:
        return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES
    }
  })

  if (groupIndex === -1) {
    throw new Error('No more transactions below reference limit. Add another app call to the group.')
  }

  const appCall = transactions[groupIndex].appCall!

  switch (resource.type) {
    case GroupResourceType.Account:
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(resource.data)) {
        appCall.accountReferences.push(resource.data)
      }
      break
    case GroupResourceType.App:
      appCall.appReferences = appCall.appReferences ?? []
      if (!appCall.appReferences.includes(resource.data)) {
        appCall.appReferences.push(resource.data)
      }
      break
    case GroupResourceType.Box: {
      appCall.boxReferences = appCall.boxReferences ?? []
      const exists = appCall.boxReferences.some(
        (b) =>
          b.appId === resource.data.appId &&
          b.name.length === resource.data.name.length &&
          b.name.every((byte, i) => byte === resource.data.name[i]),
      )
      if (!exists) {
        appCall.boxReferences.push({ appId: resource.data.appId, name: resource.data.name })
      }
      if (resource.data.appId !== 0n) {
        appCall.appReferences = appCall.appReferences ?? []
        if (!appCall.appReferences.includes(resource.data.appId)) {
          appCall.appReferences.push(resource.data.appId)
        }
      }
      break
    }
    case GroupResourceType.ExtraBoxRef:
      appCall.boxReferences = appCall.boxReferences ?? []
      appCall.boxReferences.push({ appId: 0n, name: new Uint8Array(0) })
      break
    case GroupResourceType.AssetHolding:
      appCall.assetReferences = appCall.assetReferences ?? []
      if (!appCall.assetReferences.includes(resource.data.asset)) {
        appCall.assetReferences.push(resource.data.asset)
      }
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(resource.data.account)) {
        appCall.accountReferences.push(resource.data.account)
      }
      break
    case GroupResourceType.AppLocal:
      appCall.appReferences = appCall.appReferences ?? []
      if (!appCall.appReferences.includes(resource.data.app)) {
        appCall.appReferences.push(resource.data.app)
      }
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(resource.data.account)) {
        appCall.accountReferences.push(resource.data.account)
      }
      break
    case GroupResourceType.Asset:
      appCall.assetReferences = appCall.assetReferences ?? []
      if (!appCall.assetReferences.includes(resource.data)) {
        appCall.assetReferences.push(resource.data)
      }
      break
  }
}
