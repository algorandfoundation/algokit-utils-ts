/**
 * Temporary SignedTransaction model for msgpack encoding/decoding.
 * This will be replaced when utils-ts is integrated into the monorepo.
 *
 * This type represents a signed Algorand transaction that can be
 * encoded to msgpack format for the simulate endpoint.
 */

/**
 * Base transaction structure that all transaction types share
 */
export type BaseTransaction = {
  /** Transaction type */
  type: "pay" | "axfer" | "afrz" | "acfg" | "keyreg" | "appl";

  /** Sender address (base64 or string) */
  sender: string;

  /** Fee in microALGO */
  fee?: number | bigint;

  /** First valid round */
  firstValid: number | bigint;

  /** Last valid round */
  lastValid: number | bigint;

  /** Genesis ID */
  genesisId?: string;

  /** Genesis hash (base64) */
  genesisHash?: string;

  /** Transaction note (base64 or Uint8Array) */
  note?: string | Uint8Array;

  /** Lease (base64) */
  lease?: string;

  /** Rekey to address */
  rekeyTo?: string;

  /** Group ID (base64) */
  group?: string;
};

/**
 * Payment transaction
 */
export type PaymentTransaction = BaseTransaction & {
  type: "pay";

  /** Receiver address */
  receiver: string;

  /** Amount in microALGO */
  amount: number | bigint;

  /** Close remainder to address */
  closeRemainderTo?: string;
};

/**
 * Asset transfer transaction
 */
export type AssetTransferTransaction = BaseTransaction & {
  type: "axfer";

  /** Asset ID */
  assetIndex: number | bigint;

  /** Asset amount */
  amount: number | bigint;

  /** Asset receiver */
  receiver: string;

  /** Asset close to */
  closeRemainderTo?: string;

  /** Asset sender (for clawback) */
  assetSender?: string;
};

/**
 * Asset config transaction
 */
export type AssetConfigTransaction = BaseTransaction & {
  type: "acfg";

  /** Asset ID (0 for creation) */
  assetIndex?: number | bigint;

  /** Asset parameters */
  assetParams?: {
    total?: number | bigint;
    decimals?: number;
    defaultFrozen?: boolean;
    unitName?: string;
    assetName?: string;
    url?: string;
    metadataHash?: string;
    manager?: string;
    reserve?: string;
    freeze?: string;
    clawback?: string;
  };
};

/**
 * Asset freeze transaction
 */
export type AssetFreezeTransaction = BaseTransaction & {
  type: "afrz";

  /** Asset ID */
  assetIndex: number | bigint;

  /** Address to freeze/unfreeze */
  freezeAccount: string;

  /** Freeze state */
  frozen: boolean;
};

/**
 * Key registration transaction
 */
export type KeyRegTransaction = BaseTransaction & {
  type: "keyreg";

  /** Voting key */
  voteKey?: string;

  /** Selection key */
  selectionKey?: string;

  /** State proof key */
  stateProofKey?: string;

  /** First voting round */
  voteFirst?: number | bigint;

  /** Last voting round */
  voteLast?: number | bigint;

  /** Vote key dilution */
  voteKeyDilution?: number | bigint;

  /** Non-participation flag */
  nonParticipation?: boolean;
};

/**
 * Application call transaction
 */
export type ApplicationTransaction = BaseTransaction & {
  type: "appl";

  /** Application ID (0 for creation) */
  applicationId: number | bigint;

  /** OnComplete action */
  onComplete: number;

  /** Application arguments (base64 encoded) */
  applicationArgs?: string[];

  /** Accounts array */
  accounts?: string[];

  /** Foreign apps */
  foreignApps?: (number | bigint)[];

  /** Foreign assets */
  foreignAssets?: (number | bigint)[];

  /** Approval program (base64) */
  approvalProgram?: string;

  /** Clear program (base64) */
  clearProgram?: string;

  /** Global state schema */
  globalStateSchema?: {
    numUint: number;
    numByteSlice: number;
  };

  /** Local state schema */
  localStateSchema?: {
    numUint: number;
    numByteSlice: number;
  };

  /** Extra program pages */
  extraProgramPages?: number;

  /** Boxes */
  boxes?: Array<{
    appIndex: number | bigint;
    name: string;
  }>;
};

/**
 * Union type for all transaction types
 */
export type Transaction =
  | PaymentTransaction
  | AssetTransferTransaction
  | AssetConfigTransaction
  | AssetFreezeTransaction
  | KeyRegTransaction
  | ApplicationTransaction;

/**
 * Multisignature subsignature
 */
export type MultisigSubsignature = {
  /** Public key (base64) */
  publicKey?: string;

  /** Signature (base64) */
  signature?: string;
};

/**
 * Multisignature
 */
export type Multisignature = {
  /** Version */
  version: number;

  /** Threshold */
  threshold: number;

  /** Subsignatures */
  subsignatures?: MultisigSubsignature[];
};

/**
 * Logic signature
 */
export type LogicSignature = {
  /** Logic program (base64) */
  logic: string;

  /** Logic signature arguments (base64 encoded) */
  args?: string[];

  /** Signature (base64) */
  signature?: string;

  /** Multisignature */
  multisignature?: Multisignature;
};

/**
 * Signed transaction structure
 */
export type AlgokitSignedTransaction = {
  /** The transaction */
  transaction: Transaction;

  /** ED25519 signature (base64) */
  signature?: string;

  /** Multisignature */
  multiSignature?: Multisignature;

  /** Logic signature */
  logicSignature?: LogicSignature;

  /** Auth address (for rekeyed accounts) */
  authAddress?: string;
};
