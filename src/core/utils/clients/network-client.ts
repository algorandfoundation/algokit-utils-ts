/**
 * Returns true if the given network genesisId is associated with a LocalNet network.
 * @param genesisId The network genesis ID
 * @returns Whether the given genesis ID is associated with a LocalNet network
 */
export function genesisIdIsLocalNet(genesisId: string) {
  return genesisId === 'devnet-v1' || genesisId === 'sandnet-v1' || genesisId === 'dockernet-v1'
}
