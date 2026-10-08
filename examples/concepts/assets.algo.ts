/* eslint-disable no-console -- examples print their results to demonstrate output */
/**
 * Demonstrates the full lifecycle of an Algorand Standard Asset (ASA).
 *
 * This maps to the Concepts -> Assets docs page and exercises every ASA
 * operation: creation, opt-in / opt-out (single and bulk), transfer, reconfigure,
 * freeze, clawback, queries, and destruction.
 *
 * Prerequisites: a running LocalNet (`algokit localnet start`).
 * Run with: tsx --tsconfig examples/tsconfig.json examples/concepts/assets.algo.ts
 */

import { setupLocalNetEnvironment } from './_helpers.algo'

async function main() {
  const { algorand, accountA: creator, accountB: holder } = await setupLocalNetEnvironment()

  // example: CREATE_ASSET
  const createResult = await algorand.send.assetCreate({
    sender: creator.addr,
    total: 1000n,
    decimals: 0,
    assetName: 'Example Asset',
    unitName: 'EX',
    manager: creator.addr,
    reserve: creator.addr,
    freeze: creator.addr,
    clawback: creator.addr,
  })
  const assetId = createResult.assetId
  // example: CREATE_ASSET

  // An account must opt in before it can hold an asset.
  // example: OPT_IN_ASSET
  await algorand.send.assetOptIn({
    sender: holder.addr,
    assetId,
    signer: holder.signer,
  })
  // example: OPT_IN_ASSET

  // example: TRANSFER_ASSET
  await algorand.send.assetTransfer({
    sender: creator.addr,
    receiver: holder.addr,
    assetId,
    amount: 100n,
  })
  // example: TRANSFER_ASSET

  // Every control address must be specified explicitly on the config params;
  // a field left unset is cleared permanently by the protocol at submission.
  // example: RECONFIGURE_ASSET
  await algorand.send.assetConfig({
    sender: creator.addr,
    assetId,
    manager: creator.addr,
    reserve: creator.addr,
    freeze: creator.addr,
    clawback: creator.addr,
  })
  // example: RECONFIGURE_ASSET

  // example: FREEZE_ASSET
  await algorand.send.assetFreeze({
    sender: creator.addr, // the freeze authority
    assetId,
    account: holder.addr,
    frozen: true,
  })
  // example: FREEZE_ASSET

  // Unfreeze so the account can participate in the remaining transactions.
  await algorand.send.assetFreeze({ sender: creator.addr, assetId, account: holder.addr, frozen: false })

  // Clawback is expressed as an asset transfer signed by the clawback authority,
  // with `clawbackTarget` set to the account the units are pulled from.
  // example: CLAWBACK_ASSET
  await algorand.send.assetTransfer({
    sender: creator.addr, // the clawback authority
    receiver: creator.addr,
    assetId,
    amount: 100n,
    clawbackTarget: holder.addr,
  })
  // example: CLAWBACK_ASSET

  // Two throwaway assets to demonstrate the bulk helpers.
  const asset1Id = (await algorand.send.assetCreate({ sender: creator.addr, total: 1000n, decimals: 0, unitName: 'B1' })).assetId
  const asset2Id = (await algorand.send.assetCreate({ sender: creator.addr, total: 1000n, decimals: 0, unitName: 'B2' })).assetId

  // example: BULK_OPT_IN_ASSET
  await algorand.asset.bulkOptIn(holder.addr, [asset1Id, asset2Id], {
    signer: holder.signer,
  })
  // example: BULK_OPT_IN_ASSET

  // example: BULK_OPT_OUT_ASSET
  await algorand.asset.bulkOptOut(holder.addr, [asset1Id, asset2Id], {
    signer: holder.signer,
  })
  // example: BULK_OPT_OUT_ASSET

  // Opt-out of a single asset (zero balance after the clawback above).
  // example: OPT_OUT_ASSET
  await algorand.send.assetOptOut({
    sender: holder.addr,
    assetId,
    creator: creator.addr,
    ensureZeroBalance: true,
    signer: holder.signer,
  })
  // example: OPT_OUT_ASSET

  // example: ASSET_MANAGER_QUERIES
  const assetInfo = await algorand.asset.getById(assetId)
  const creatorHolding = await algorand.asset.getAccountInformation(creator.addr, assetId)
  // example: ASSET_MANAGER_QUERIES

  // Destroy requires all units to sit in the creator account (they do, after the
  // clawback) and the sender to be the current manager.
  // example: DESTROY_ASSET
  await algorand.send.assetDestroy({ sender: creator.addr, assetId })
  // example: DESTROY_ASSET

  if (assetInfo.total !== 1000n) throw new Error(`Expected total 1000, got ${assetInfo.total}`)
  if (creatorHolding.balance !== 1000n) throw new Error(`Expected balance 1000, got ${creatorHolding.balance}`)
  console.log(`Exercised full lifecycle for asset ${assetId}`)
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
