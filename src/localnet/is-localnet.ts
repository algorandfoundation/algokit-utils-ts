import algosdk from 'algosdk'
import Algodv2 = algosdk.Algodv2

/** Returns true if the algod client is pointing to a LocalNet Algorand network */
export async function isLocalNet(algod: Algodv2): Promise<boolean> {
  const params = await algod.getTransactionParams().do()

  return params.genesisID === 'devnet-v1' || params.genesisID === 'sandnet-v1' || params.genesisID === 'dockernet-v1'
}
