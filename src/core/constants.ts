export const TRANSACTION_DOMAIN_SEPARATOR = 'TX'
export const TRANSACTION_GROUP_DOMAIN_SEPARATOR = 'TG'
export const MULTISIG_DOMAIN_SEPARATOR = 'MultisigAddr'
export const SIGNATURE_ENCODING_INCR = 75
export const HASH_BYTES_LENGTH = 32
export const PUBLIC_KEY_BYTE_LENGTH = 32
export const MAX_TX_GROUP_SIZE = 16
export const CHECKSUM_BYTE_LENGTH = 4
export const ADDRESS_LENGTH = 58
export const TRANSACTION_ID_LENGTH = 52
export const ZERO_ADDRESS = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'
export const LENGTH_ENCODE_BYTE_SIZE = 2
export const BOOL_TRUE_BYTE = 0x80
export const BOOL_FALSE_BYTE = 0x00
export const SIGNATURE_BYTE_LENGTH = 64
export const EMPTY_SIGNATURE = new Uint8Array(SIGNATURE_BYTE_LENGTH)

// Application program size constraints
export const MAX_EXTRA_PROGRAM_PAGES = 3
export const PROGRAM_PAGE_SIZE = 2048 // In bytes

// Application reference limits
export const MAX_APP_ARGS = 16
export const MAX_ARGS_SIZE = 2048 // Maximum size in bytes of all args combined
export const MAX_OVERALL_REFERENCES = 8
export const MAX_ACCOUNT_REFERENCES = 4
export const MAX_APP_REFERENCES = 8
export const MAX_ASSET_REFERENCES = 8
export const MAX_BOX_REFERENCES = 8

// Application state schema limits
export const MAX_GLOBAL_STATE_KEYS = 64
export const MAX_LOCAL_STATE_KEYS = 16

// Asset configuration limits
export const MAX_ASSET_NAME_LENGTH = 32 // In bytes
export const MAX_ASSET_UNIT_NAME_LENGTH = 8 // In bytes
export const MAX_ASSET_URL_LENGTH = 96 // In bytes
export const MAX_ASSET_DECIMALS = 19
