/**
 * Represents the encodeable data structure for an Algorand transaction
 * that can be msgpack encoded and decoded.
 *
 * All fields are optional (except type), as default values should be ommitted when encoding.
 */
export type TransactionDto = {
  // Common transaction fields
  /** Transaction type */
  type: 'pay' | 'axfer' | 'afrz' | 'acfg' | 'keyreg' | 'appl' | 'stpf' | 'hb'

  /** Sender address */
  snd?: Uint8Array

  /** First valid round */
  fv?: bigint | number

  /** Last valid round */
  lv?: bigint | number

  /** Genesis ID (optional) */
  gen?: string

  /** Genesis hash (optional) */
  gh?: Uint8Array

  /** Transaction fee in microALGO (optional) */
  fee?: bigint | number

  /** Transaction note (optional) */
  note?: Uint8Array

  /** Lease (optional) */
  lx?: Uint8Array

  /** Rekey to address (optional) */
  rekey?: Uint8Array

  /** Group ID (optional) */
  grp?: Uint8Array

  // Payment transaction fields (type: 'pay')
  /** Payment amount in microALGO */
  amt?: bigint | number

  /** Payment receiver address */
  rcv?: Uint8Array

  /** Close remainder to address */
  close?: Uint8Array

  // Asset transfer fields (type: 'axfer')
  /** Asset ID for transfer */
  xaid?: bigint | number

  /** Asset amount to transfer */
  aamt?: bigint | number

  /** Asset receiver address */
  arcv?: Uint8Array

  /** Asset close remainder to address */
  aclose?: Uint8Array

  /** Asset sender address (for clawback) */
  asnd?: Uint8Array

  // Asset config fields (type: 'acfg')
  /** Asset ID for configuration */
  caid?: bigint | number

  /** Asset parameters */
  apar?: AssetParamsDto

  // Asset freeze fields (type: 'afrz')
  /** Asset ID for freeze */
  faid?: bigint | number

  /** Address to freeze/unfreeze */
  fadd?: Uint8Array

  /** Freeze state */
  afrz?: boolean

  // Application call fields (type: 'appl')
  /** Application ID */
  apid?: bigint | number

  /** OnApplicationComplete action */
  apan?: number

  /** Approval program */
  apap?: Uint8Array

  /** Clear state program */
  apsu?: Uint8Array

  /** Global state schema */
  apgs?: StateSchemaDto

  /** Local state schema */
  apls?: StateSchemaDto

  /** Application arguments */
  apaa?: Uint8Array[]

  /** Account references */
  apat?: Uint8Array[]

  /** Application references */
  apfa?: (bigint | number)[]

  /** Asset references */
  apas?: (bigint | number)[]

  /** Box references */
  apbx?: BoxReferenceDto[]

  /** Access references (unified resource references) */
  al?: ResourceReferenceDto[]

  /** Extra program pages */
  apep?: number

  // Key registration fields (type: 'keyreg')
  /** Vote key */
  votekey?: Uint8Array

  /** Selection key */
  selkey?: Uint8Array

  /** Vote first round */
  votefst?: bigint | number

  /** Vote last round */
  votelst?: bigint | number

  /** Vote key dilution */
  votekd?: bigint | number

  /** State proof key */
  sprfkey?: Uint8Array

  /** Non-participation flag */
  nonpart?: boolean

  /** Heartbeat parameters */
  hb?: HeartbeatParamsDto

  /** State proof type */
  sptype?: number

  /** State proof */
  sp?: StateProofDto

  /** State proof message */
  spmsg?: StateProofMessageDto
}

/**
 * Encodeable box reference structure for app call transactions
 */
export type BoxReferenceDto = {
  /** App index (0 means current app) */
  i?: bigint | number

  /** Box name */
  n?: Uint8Array
}

/**
 * Encodeable heartbeat parameters structure
 */
export type HeartbeatParamsDto = {
  /** Heartbeat address */
  a?: Uint8Array

  /** Heartbeat proof */
  prf?: HeartbeatProofDto

  /** Heartbeat seed */
  sd?: Uint8Array

  /** Heartbeat vote ID */
  vid?: Uint8Array

  /** Heartbeat key dilution */
  kd?: bigint | number
}

/**
 * Encodeable heartbeat proof structure
 */
export type HeartbeatProofDto = {
  /** Signature (64 bytes) */
  s?: Uint8Array

  /** Public key (32 bytes) */
  p?: Uint8Array

  /** Public key 2 (32 bytes) */
  p2?: Uint8Array

  /** Public key 1 signature (64 bytes) */
  p1s?: Uint8Array

  /** Public key 2 signature (64 bytes) */
  p2s?: Uint8Array
}

/**
 * Encodeable hash factory structure
 */
export type HashFactoryDto = {
  /** Hash type */
  t?: number
}

/**
 * Encodeable merkle array proof structure
 */
export type MerkleArrayProofDto = {
  /** Merkle path */
  pth?: Uint8Array[]

  /** Hash factory */
  hsh?: HashFactoryDto

  /** Tree depth */
  td?: number
}

/**
 * Encodeable merkle signature verifier structure
 */
export type MerkleSignatureVerifierDto = {
  /** Commitment (64 bytes) */
  cmt?: Uint8Array

  /** Key lifetime */
  lf?: bigint | number
}

/**
 * Encodeable participant structure
 */
export type ParticipantDto = {
  /** Verifier */
  p?: MerkleSignatureVerifierDto

  /** Weight */
  w?: bigint | number
}

/**
 * Encodeable falcon verifier structure
 */
export type FalconVerifierDto = {
  /** Public key */
  k?: Uint8Array
}

/**
 * Encodeable falcon signature structure
 */
export type FalconSignatureStructDto = {
  /** Signature */
  sig?: Uint8Array

  /** Vector commitment index */
  idx?: bigint | number

  /** Proof */
  prf?: MerkleArrayProofDto

  /** Verifying key */
  vkey?: FalconVerifierDto
}

/**
 * Encodeable sigslot commit structure
 */
export type SigslotCommitDto = {
  /** Signature */
  s?: FalconSignatureStructDto

  /** Lower signature weight */
  l?: bigint | number
}

/**
 * Encodeable reveal structure
 */
export type RevealDto = {
  /** Sigslot */
  s?: SigslotCommitDto

  /** Participant */
  p?: ParticipantDto
}

/**
 * Encodeable state proof structure
 */
export type StateProofDto = {
  /** Signature commitment */
  c?: Uint8Array

  /** Signed weight */
  w?: bigint | number

  /** Signature proofs */
  S?: MerkleArrayProofDto

  /** Participant proofs */
  P?: MerkleArrayProofDto

  /** Merkle signature salt version */
  v?: number

  /** Reveals - sparse map from position to reveal elements */
  r?: Map<bigint, RevealDto>

  /** Positions to reveal */
  pr?: (bigint | number)[]
}

/**
 * Encodeable state proof message structure
 */
export type StateProofMessageDto = {
  /** Block headers commitment */
  b?: Uint8Array

  /** Voters commitment */
  v?: Uint8Array

  /** Natural log of proven weight */
  P?: bigint | number

  /** First attested round */
  f?: bigint | number

  /** Last attested round */
  l?: bigint | number
}

/**
 * Encodeable asset parameters structure
 */
export type AssetParamsDto = {
  /** Total number of units */
  t?: bigint | number

  /** Number of decimal places */
  dc?: number

  /** Default frozen state */
  df?: boolean

  /** Unit name */
  un?: string

  /** Asset name */
  an?: string

  /** Asset URL */
  au?: string

  /** Asset metadata hash */
  am?: Uint8Array

  /** Manager address */
  m?: Uint8Array

  /** Freeze address */
  f?: Uint8Array

  /** Clawback address */
  c?: Uint8Array

  /** Reserve address */
  r?: Uint8Array
}

/**
 * Encodeable state schema structure
 */
export type StateSchemaDto = {
  /** Number of uints */
  nui?: number

  /** Number of byte slices */
  nbs?: number
}

/**
 * Encodeable resource reference structure for app call transactions
 */
export type ResourceReferenceDto = {
  /** Account address */
  d?: Uint8Array

  /** App index */
  p?: bigint | number

  /** Asset index */
  s?: bigint | number

  /** Box reference */
  b?: {
    /** App index (0 or index into access list) */
    i?: number
    /** Box name */
    n?: Uint8Array
  }

  /** Holding reference (1-based indices into access list) */
  h?: {
    /** Address index */
    d?: number
    /** Asset index (1-based index into access list) */
    s?: number
  }

  /** Local state reference (1-based indices into access list) */
  l?: {
    /** Address index */
    d?: number
    /** App index (0 means current app, or 1-based index into access list) */
    p?: number
  }
}
