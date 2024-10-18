import * as algokit from '../src/index'
import { indexerWaitForRound } from './utils'

/* eslint-disable no-console */
async function main() {
  const algorand = algokit.AlgorandClient.defaultLocalNet()

  // Create a random account and fund it
  const creator = await algorand.account.random()
  const dispenser = await algorand.account.localNetDispenser()

  await algorand.send.payment({
    sender: dispenser.addr,
    /** That account that will receive the ALGO */
    receiver: creator.addr,
    /** Amount to send */
    amount: algokit.algos(1),
  })

  // example: ASSET_CREATE
  const createResult = await algorand.send.assetCreate({
    sender: creator.addr,
    /** The total amount of the smallest divisible unit to create */
    total: BigInt(1000),
    /** The amount of decimal places the asset should have */
    decimals: 0,
    /** Whether the asset is frozen by default in the creator address */
    defaultFrozen: false,
    /** The address that can change the manager, reserve, clawback, and freeze addresses. There will permanently be no manager if undefined or an empty string */
    manager: creator.addr,
    /** The address that holds the uncirculated supply */
    reserve: creator.addr,
    /** The address that can freeze the asset in any account. Freezing will be permanently disabled if undefined or an empty string. */
    freeze: creator.addr,
    /** The address that can clawback the asset from any account. Clawback will be permanently disabled if undefined or an empty string. */
    clawback: creator.addr,
    /** The short ticker name for the asset */
    unitName: 'ora',
    /** The full name of the asset */
    assetName: 'Orange',
    /** The metadata URL for the asset */
    url: 'http://path/to/my/asset/details',
  })

  const assetId = createResult.confirmation.assetIndex!
  console.log(`Asset ID created: ${assetId}\n`)

  const asset_create_confirmed_round = createResult.confirmation.confirmedRound!
  console.log(`Asset creation confirmed round: ${asset_create_confirmed_round}\n`)
  // example: ASSET_CREATE

  // example: ASSET_INFO
  const assetInfo = await algorand.client.algod.getAssetByID(Number(assetId)).do()
  console.log(`Asset Name: ${assetInfo.params.name}\n`)
  console.log('Asset Params: ', assetInfo.params, '\n')
  // example: ASSET_INFO

  // example: INDEXER_LOOKUP_ASSET
  // ensure indexer is caught up
  await indexerWaitForRound(algorand.client.indexer, asset_create_confirmed_round, 30)

  const indexerAssetInfo = await algorand.client.indexer.lookupAssetByID(Number(assetId)).do()
  console.log('Indexer Asset Info: ', indexerAssetInfo, '\n')
  // example: INDEXER_LOOKUP_ASSET

  // example: ASSET_CONFIG
  const manager = await algorand.account.random()

  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: manager.addr,
    amount: algokit.algos(1),
  })

  const configResult = await algorand.send.assetConfig({
    sender: creator.addr,
    /** ID of the asset */
    assetId: BigInt(assetId),
    /** The address that can change the manager, reserve, clawback, and freeze addresses. There will permanently be no manager if undefined or an empty string */
    manager: manager.addr,
    /** The address that holds the uncirculated supply */
    reserve: manager.addr,
    /** The address that can freeze the asset in any account. Freezing will be permanently disabled if undefined or an empty string. */
    freeze: manager.addr,
    /** The address that can clawback the asset from any account. Clawback will be permanently disabled if undefined or an empty string. */
    clawback: manager.addr,
  })
  console.log(`\nAsset Config Txn ID: ${configResult.txIds}\n`)
  // example: ASSET_CONFIG

  // example: ASSET_OPTIN
  const receiver = await algorand.account.random()

  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: receiver.addr,
    amount: algokit.algos(1),
  })

  await algorand.send.assetOptIn({
    sender: receiver.addr,
    /** ID of the asset */
    assetId: BigInt(assetId),
  })

  let receiverAssetInfo = await algorand.account.getAssetInformation(receiver.addr, Number(assetId))
  console.log(`\nAsset holding before asset_xfer: ${receiverAssetInfo.balance}\n`)
  // example: ASSET_OPTIN

  // example: ASSET_XFER
  await algorand.send.assetTransfer({
    sender: creator.addr,
    /** The account to send the asset to */
    receiver: receiver.addr,
    /** ID of the asset */
    assetId: BigInt(assetId),
    /** Amount of the asset to transfer (smallest divisible unit) */
    amount: BigInt(1),
  })

  receiverAssetInfo = await algorand.account.getAssetInformation(receiver.addr, Number(assetId))
  console.log(`\nAsset holding after asset_xfer: ${receiverAssetInfo.balance}\n`)
  // example: ASSET_XFER

  // example: ASSET_FREEZE
  await algorand.send.assetFreeze({
    sender: manager.addr,
    /** The ID of the asset */
    assetId: BigInt(assetId),
    /** The account to freeze or unfreeze */
    account: receiver.addr,
    /** Whether the assets in the account should be frozen */
    frozen: true,
  })

  receiverAssetInfo = await algorand.account.getAssetInformation(receiver.addr, Number(assetId))
  console.log(`\nAsset frozen in ${receiver.addr}?: ${receiverAssetInfo.frozen}\n`)
  // example: ASSET_FREEZE

  // example: ASSET_CLAWBACK
  await algorand.send.assetTransfer({
    sender: manager.addr,
    /** ID of the asset */
    assetId: BigInt(assetId),
    /** Amount of the asset to transfer (smallest divisible unit) */
    amount: BigInt(1),
    /** The account to send the asset to */
    receiver: creator.addr,
    /** The account to take the asset from */
    clawbackTarget: receiver.addr,
  })

  receiverAssetInfo = await algorand.account.getAssetInformation(receiver.addr, Number(assetId))
  console.log(`\nAsset holding after clawback: ${receiverAssetInfo.balance}\n`)
  // example: ASSET_CLAWBACK

  // example: ASSET_OPT_OUT
  // opt-out is an zero amount transfer with the `closeRemainderTo` field set to
  // any account that can receive the asset.
  // note that closing to the asset creator will always succeed
  await algorand.send.assetTransfer({
    sender: receiver.addr,
    /** ID of the asset */
    assetId: BigInt(assetId),
    /** Amount of the asset to transfer (smallest divisible unit) */
    amount: BigInt(0),
    /** The account to send the asset to */
    receiver: creator.addr,
    /** The account to close the asset to */
    closeAssetTo: creator.addr,
  })
  // example: ASSET_OPT_OUT

  // example: ASSET_DELETE
  await algorand.send.assetDestroy({
    sender: manager.addr,
    /** ID of the asset */
    assetId: BigInt(assetId),
  })
  // example: ASSET_DELETE
}

main()
