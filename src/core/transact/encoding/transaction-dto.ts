/**
 * Represents the encodeable data structure for an Algorand transaction
 * that can be msgpack encoded and decoded.
 *
 * All fields are optional (except type), as default values should be ommitted when encoding.
 */
export interface TransactionDto {
  // Common transaction fields
  /** Transaction type */
  type: 'pay' | 'axfer' | 'afrz' | 'acfg' | 'keyreg' | 'appl'

  /** Sender address */
  snd?: Uint8Array

  /** First valid round */
  fv?: bigint

  /** Last valid round */
  lv?: bigint

  /** Genesis ID (optional) */
  gen?: string

  /** Genesis hash (optional) */
  gh?: Uint8Array

  /** Transaction fee in microALGO (optional) */
  fee?: bigint

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
  amt?: bigint

  /** Payment receiver address */
  rcv?: Uint8Array

  /** Close remainder to address */
  close?: Uint8Array

  // Asset transfer fields (type: 'axfer')
  /** Asset ID for transfer */
  xaid?: bigint

  /** Asset amount to transfer */
  aamt?: bigint

  /** Asset receiver address */
  arcv?: Uint8Array

  /** Asset close remainder to address */
  aclose?: Uint8Array

  /** Asset sender address (for clawback) */
  asnd?: Uint8Array

  // Asset config fields (type: 'acfg')
  /** Asset ID for configuration */
  caid?: bigint

  /** Asset parameters */
  apar?: AssetParamsDto

  // Asset freeze fields (type: 'afrz')
  /** Asset ID for freeze */
  faid?: bigint

  /** Address to freeze/unfreeze */
  fadd?: Uint8Array

  /** Freeze state */
  afrz?: boolean

  // Application call fields (type: 'appl')
  /** Application ID */
  apid?: bigint

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
  apfa?: bigint[]

  /** Asset references */
  apas?: bigint[]

  /** Extra program pages */
  apep?: number

  // Key registration fields (type: 'keyreg')
  /** Vote key */
  votekey?: Uint8Array

  /** Selection key */
  selkey?: Uint8Array

  /** Vote first round */
  votefst?: bigint

  /** Vote last round */
  votelst?: bigint

  /** Vote key dilution */
  votekd?: bigint

  /** State proof key */
  sprfkey?: Uint8Array

  /** Non-participation flag */
  nonpart?: boolean
}

/**
 * Encodeable asset parameters structure
 */
export interface AssetParamsDto {
  /** Total number of units */
  t?: bigint

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
export interface StateSchemaDto {
  /** Number of uints */
  nui?: number

  /** Number of byte slices */
  nbs?: number
}
