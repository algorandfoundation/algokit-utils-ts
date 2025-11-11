/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccessReference } from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { TransactionSignerAccount } from './account'
import { AlgoAmount } from './amount'
import { BoxReference } from './app-manager'

// TODO: PD - do not export this

function isAddress(value: any): value is algosdk.Address {
  return value instanceof algosdk.Address
}

function isUint8Array(value: any): value is Uint8Array {
  return value instanceof Uint8Array
}

function isTransactionSignerAccount(value: any): value is TransactionSignerAccount {
  return value && typeof value === 'object' && 'addr' in value && 'signer' in value
}

function isBoxReference(value: any): value is BoxReference {
  return value && typeof value === 'object' && 'appId' in value && 'name' in value
}

function isAccessReference(value: any): value is AccessReference {
  return (
    value &&
    typeof value === 'object' &&
    ('address' in value || 'appId' in value || 'assetId' in value || 'holding' in value || 'locals' in value || 'box' in value)
  )
}

function isABIMethod(value: any): value is algosdk.ABIMethod {
  return value instanceof algosdk.ABIMethod
}

function isAlgoAmount(value: any): value is AlgoAmount {
  return value instanceof AlgoAmount
}

function isPrimitive(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean'
  )
}

function isFunction(value: any): boolean {
  return typeof value === 'function'
}

function deepCloneValue(value: any): any {
  // Primitives - return as-is (immutable)
  if (isPrimitive(value)) {
    return value
  }

  // Functions - return as-is (e.g., TransactionSigner)
  if (isFunction(value)) {
    return value
  }

  // AlgoAmount - return as-is (immutable - contains only bigint)
  if (isAlgoAmount(value)) {
    return value
  }

  // Address - deep clone
  if (isAddress(value)) {
    return new algosdk.Address(new Uint8Array(value.publicKey))
  }

  // Uint8Array - deep clone
  if (isUint8Array(value)) {
    return new Uint8Array(value)
  }

  // ABIMethod - deep clone by reconstructing from JSON
  if (isABIMethod(value)) {
    return new algosdk.ABIMethod(value.toJSON())
  }

  // TransactionSignerAccount - deep clone Address, keep signer function
  if (isTransactionSignerAccount(value)) {
    return {
      addr: deepCloneValue(value.addr),
      signer: value.signer, // Function - don't clone
    }
  }

  // Array - recursively clone each element
  if (Array.isArray(value)) {
    return value.map((item) => deepCloneValue(item))
  }

  // BoxReference - deep clone with nested handling
  if (isBoxReference(value)) {
    return {
      appId: value.appId,
      name: deepCloneValue(value.name),
    }
  }

  // AccessReference - deep clone with careful handling of optional nested structures
  if (isAccessReference(value)) {
    const cloned: AccessReference = {}
    if (value.address !== undefined) cloned.address = value.address
    if (value.appId !== undefined) cloned.appId = value.appId
    if (value.assetId !== undefined) cloned.assetId = value.assetId
    if (value.holding !== undefined) cloned.holding = { ...value.holding }
    if (value.locals !== undefined) cloned.locals = { ...value.locals }
    if (value.box !== undefined) {
      cloned.box = {
        appId: value.box.appId,
        name: deepCloneValue(value.box.name),
      }
    }
    return cloned
  }

  // Plain object - recursively clone all properties
  if (typeof value === 'object' && value !== null) {
    const cloned: any = {}
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        cloned[key] = deepCloneValue(value[key])
      }
    }
    return cloned
  }

  // Fallback - return as-is
  return value
}

export function deepCloneTransactionParams<T extends Record<string, any>>(params: T): T {
  const cloned: any = {}

  // Iterate through all properties dynamically
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      cloned[key] = deepCloneValue(params[key])
    }
  }

  return cloned as T
}
