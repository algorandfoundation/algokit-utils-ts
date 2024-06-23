import { AlgorandClient } from '../types/algorand-client'

export async function generateTestAsset(algorand: AlgorandClient, sender: string, total?: number) {
  total = !total ? Math.floor(Math.random() * 100) + 20 : total
  const decimals = 0
  const assetName = `ASA ${Math.floor(Math.random() * 100) + 1}_${Math.floor(Math.random() * 100) + 1}_${total}`

  const asset = await algorand.send.assetCreate({
    sender: sender,
    total: BigInt(total * 10 ** decimals),
    decimals: decimals,
    defaultFrozen: false,
    unitName: '',
    assetName: assetName,
    manager: sender,
    reserve: sender,
    freeze: sender,
    clawback: sender,
    url: 'https://path/to/my/asset/details',
  })

  return asset.assetId
}
