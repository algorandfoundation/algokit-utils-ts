import { Account, Algodv2 } from 'algosdk'
import { transferAsset } from './transfer'

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
