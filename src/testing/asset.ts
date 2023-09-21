import { Account, Algodv2, Kmd, makeAssetCreateTxnWithSuggestedParamsFromObject } from 'algosdk'
import { algos, microAlgos } from '../amount'
import { ensureFunded, transferAsset } from '../transfer'

export async function generateTestAsset(client: Algodv2, sender: Account, total?: number) {
  total = !total ? Math.floor(Math.random() * 100) + 20 : total
  const decimals = 0
  const assetName = `ASA ${Math.floor(Math.random() * 100) + 1}_${Math.floor(Math.random() * 100) + 1}_${total}`

  const params = await client.getTransactionParams().do()

  const txn = makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: sender.addr,
    suggestedParams: params,
    total: total * 10 ** decimals,
    decimals: decimals,
    defaultFrozen: false,
    unitName: '',
    assetName: assetName,
    manager: sender.addr,
    reserve: sender.addr,
    freeze: sender.addr,
    clawback: sender.addr,
    assetURL: 'https://path/to/my/asset/details',
  })

  const stxn = txn.signTxn(sender.sk)

  let txid = await client.sendRawTransaction(stxn).do()
  txid = txid['txId']

  const ptx = await client.pendingTransactionInformation(txid).do()

  const assetId = ptx['asset-index']

  return assetId
}

export async function optIn(algod: Algodv2, account: Account, assetId: number) {
  await transferAsset(
    {
      from: account,
      to: account.addr,
      assetId,
      amount: 0,
      note: `Opt in asset id ${assetId}`,
    },
    algod,
  )
}

export async function ensureFundsAndOptIn(algod: Algodv2, account: Account, assetId: number, kmd: Kmd) {
  await ensureFunded(
    {
      accountToFund: account,
      minSpendingBalance: microAlgos(1),
      minFundingIncrement: algos(1),
    },
    algod,
    kmd,
  )

  return optIn(algod, account, assetId)
}
