/**
 * State proof transaction specific fields
 */
export type StateProofTransactionFields = {
  /** State proof type */
  stateProofType?: number

  /** State proof */
  stateProof?: StateProof

  /** State proof message */
  message?: StateProofMessage
}

export type StateProof = {
  sigCommit: Uint8Array
  signedWeight: bigint
  sigProofs: MerkleArrayProof
  partProofs: MerkleArrayProof
  merkleSignatureSaltVersion: number
  reveals: Reveal[]
  positionsToReveal: bigint[]
}

export type MerkleArrayProof = {
  path: Uint8Array[]
  hashFactory: HashFactory
  treeDepth: number
}

export type HashFactory = {
  hashType: number
}

export type MerkleSignatureVerifier = {
  commitment: Uint8Array
  keyLifetime: bigint
}

export type Participant = {
  verifier: MerkleSignatureVerifier
  weight: bigint
}

export type FalconVerifier = {
  publicKey: Uint8Array
}

export type FalconSignatureStruct = {
  signature: Uint8Array
  vectorCommitmentIndex: bigint
  proof: MerkleArrayProof
  verifyingKey: FalconVerifier
}

export type SigslotCommit = {
  sig: FalconSignatureStruct
  lowerSigWeight: bigint
}

export type Reveal = {
  position: bigint
  sigslot: SigslotCommit
  participant: Participant
}

export type StateProofMessage = {
  blockHeadersCommitment: Uint8Array
  votersCommitment: Uint8Array
  lnProvenWeight: bigint
  firstAttestedRound: bigint
  lastAttestedRound: bigint
}
