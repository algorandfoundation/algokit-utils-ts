import { ZERO_ADDRESS } from '../algokit_common'
import { BoxReference, HoldingReference, LocalsReference, ResourceReference } from '../algokit_transact'
import { Address } from './encoding/address.js'

/**
 * foreignArraysToResourceReferences makes a single array of ResourceReferences from various foreign resource arrays.
 * Note, runtime representation of ResourceReference uses addresses, app and asset identifiers, not indexes.
 *
 * @param accounts - optional array of accounts
 * @param foreignAssets - optional array of foreign assets
 * @param foreignApps - optional array of foreign apps
 * @param holdings - optional array of holdings
 * @param locals - optional array of locals
 * @param boxes - optional array of boxes
 */
export function foreignArraysToResourceReferences({
  appIndex,
  accounts,
  foreignAssets,
  foreignApps,
  holdings,
  locals,
  boxes,
}: {
  appIndex: bigint | number
  accounts?: ReadonlyArray<string | Address>
  foreignAssets?: ReadonlyArray<number | bigint>
  foreignApps?: ReadonlyArray<number | bigint>
  holdings?: ReadonlyArray<HoldingReference>
  locals?: ReadonlyArray<LocalsReference>
  boxes?: ReadonlyArray<BoxReference>
}): Array<ResourceReference> {
  const accessList: Array<ResourceReference> = []
  function ensureAddress(addr: string) {
    if (!addr || addr === ZERO_ADDRESS) {
      return
    }
    if (!accessList.find((rr) => rr.address === addr)) {
      accessList.push({ address: addr })
    }
  }
  function ensureAsset(asset: number | bigint) {
    if (!accessList.find((rr) => rr.assetId === BigInt(asset))) {
      accessList.push({ assetId: BigInt(asset) })
    }
  }
  function ensureApp(app: number | bigint) {
    if (!accessList.find((rr) => rr.appId === app)) {
      accessList.push({ appId: BigInt(app) })
    }
  }
  for (const acct of accounts ?? []) {
    ensureAddress(acct.toString())
  }
  for (const asset of foreignAssets ?? []) {
    ensureAsset(asset)
  }
  for (const app of foreignApps ?? []) {
    ensureApp(app)
  }
  for (const holding of holdings ?? []) {
    if (holding.address) {
      ensureAddress(holding.address)
    }
    ensureAsset(holding.assetId)
    accessList.push(holding)
  }
  for (const local of locals ?? []) {
    if (local.address) {
      ensureAddress(local.address)
    }
    if (local.appId && BigInt(local.appId) !== appIndex) {
      ensureApp(local.appId)
    }
    accessList.push({ locals: local })
  }
  for (const box of boxes ?? []) {
    if (box.appId && BigInt(box.appId) !== appIndex) {
      ensureApp(box.appId)
    }
    accessList.push({ box })
  }
  return accessList
}
