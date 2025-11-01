import {
  MAX_TX_GROUP_SIZE,
  SIGNATURE_ENCODING_INCR,
  TRANSACTION_DOMAIN_SEPARATOR,
  TRANSACTION_GROUP_DOMAIN_SEPARATOR,
  TRANSACTION_ID_LENGTH,
  ZERO_ADDRESS,
  concatArrays,
  hash,
} from '@algorandfoundation/algokit-common'
import base32 from 'hi-base32'
import {
  OmitEmptyObjectCodec,
  addressArrayCodec,
  addressCodec,
  bigIntArrayCodec,
  bigIntCodec,
  booleanCodec,
  bytesArrayCodec,
  bytesCodec,
  numberCodec,
  stringCodec,
} from '../encoding/codecs'
import { decodeMsgpack, encodeMsgpack } from '../encoding/msgpack'
import {
  AssetParamsDto,
  HeartbeatParamsDto,
  HeartbeatProofDto,
  MerkleArrayProofDto,
  ResourceReferenceDto,
  RevealDto,
  StateSchemaDto,
  TransactionDto,
} from '../encoding/transaction-dto'
import { AppCallTransactionFields, OnApplicationComplete, ResourceReference, StateSchema, validateAppCallTransaction } from './app-call'
import { AssetConfigTransactionFields, validateAssetConfigTransaction } from './asset-config'
import { AssetFreezeTransactionFields, validateAssetFreezeTransaction } from './asset-freeze'
import { AssetTransferTransactionFields, validateAssetTransferTransaction } from './asset-transfer'
import { TransactionValidationError, getValidationErrorMessage } from './common'
import { HeartbeatTransactionFields } from './heartbeat'
import { KeyRegistrationTransactionFields, validateKeyRegistrationTransaction } from './key-registration'
import { PaymentTransactionFields } from './payment'
import { MerkleArrayProof, Reveal, StateProofTransactionFields } from './state-proof'

/**
 * Represents a complete Algorand transaction.
 *
 * This structure contains the fields that are present in every transaction,
 * regardless of transaction type, plus transaction-type-specific fields.
 */
export type Transaction = {
  /**
   * The type of transaction
   */
  type: TransactionType

  /**
   * The account that authorized the transaction.
   *
   * Fees are deducted from this account.
   */
  sender: string

  /**
   * Optional transaction fee in microALGO.
   *
   * When not set, the fee will be interpreted as 0 by the network.
   */
  fee?: bigint

  /**
   * First round for when the transaction is valid.
   */
  firstValid: bigint

  /**
   * Last round for when the transaction is valid.
   *
   * After this round, the transaction will be expired.
   */
  lastValid: bigint

  /**
   * Hash of the genesis block of the network.
   *
   * Used to identify which network the transaction is for.
   */
  genesisHash?: Uint8Array

  /**
   * Genesis ID of the network.
   *
   * A human-readable string used alongside genesis hash to identify the network.
   */
  genesisId?: string

  /**
   * Optional user-defined note field.
   *
   * Can contain arbitrary data up to 1KB in size.
   */
  note?: Uint8Array

  /**
   * Optional authorized account for future transactions.
   *
   * If set, only this account will be used for transaction authorization going forward.
   * Reverting back control to the original address must be done by setting this field to
   * the original address.
   */
  rekeyTo?: string

  /**
   * Optional lease value to enforce mutual transaction exclusion.
   *
   * When a transaction with a non-empty lease field is confirmed, the lease is acquired.
   * A lease X is acquired by the sender, generating the (sender, X) lease.
   * The lease is kept active until the last_valid round of the transaction has elapsed.
   * No other transaction sent by the same sender can be confirmed until the lease expires.
   */
  lease?: Uint8Array

  /**
   * Optional group ID for atomic transaction grouping.
   *
   * Transactions with the same group ID must execute together or not at all.
   */
  group?: Uint8Array

  /**
   * Payment specific fields
   */
  payment?: PaymentTransactionFields

  /**
   * Asset transfer specific fields
   */
  assetTransfer?: AssetTransferTransactionFields

  /**
   * Asset config specific fields
   */
  assetConfig?: AssetConfigTransactionFields

  /**
   * App call specific fields
   */
  applicationCall?: AppCallTransactionFields

  /**
   * Key registration specific fields
   */
  keyRegistration?: KeyRegistrationTransactionFields

  /**
   * Asset freeze specific fields
   */
  assetFreeze?: AssetFreezeTransactionFields

  /**
   * Heartbeat specific fields
   */
  heartbeat?: HeartbeatTransactionFields

  /**
   * State proof specific fields
   */
  stateProof?: StateProofTransactionFields
}

/**
 * Supported transaction types
 */
export enum TransactionType {
  /**
   * Payment transaction
   */
  pay = 'pay',
  /**
   * Key registration transaction
   */
  keyreg = 'keyreg',
  /**
   * Asset configuration transaction
   */
  acfg = 'acfg',
  /**
   * Asset transfer transaction
   */
  axfer = 'axfer',
  /**
   * Asset freeze transaction
   */
  afrz = 'afrz',
  /**
   * Application transaction
   */
  appl = 'appl',
  /**
   * State proof transaction
   */
  stpf = 'stpf',
  /**
   * Heartbeat transaction
   */
  hb = 'hb',
}

export type FeeParams = {
  feePerByte: bigint
  minFee: bigint
  extraFee?: bigint
  maxFee?: bigint
}

/**
 * Get the transaction type from the encoded transaction.
 * This is particularly useful when decoding a transaction that has an unknown type
 */
export function getEncodedTransactionType(encoded_transaction: Uint8Array): TransactionType {
  const decoded = decodeTransaction(encoded_transaction)
  return decoded.type
}

/**
 * Encode the transaction with the domain separation (e.g. "TX") prefix
 *
 * @param transaction - The transaction to encode
 * @returns The MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeTransaction(transaction: Transaction): Uint8Array {
  const rawBytes = encodeTransactionRaw(transaction)

  // Add domain separation prefix
  const prefixBytes = new TextEncoder().encode(TRANSACTION_DOMAIN_SEPARATOR)
  return concatArrays(prefixBytes, rawBytes)
}

/**
 * Encode transactions with the domain separation (e.g. "TX") prefix
 *
 * @param transactions - A collection of transactions to encode
 * @returns A collection of MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeTransactions(transactions: Transaction[]): Uint8Array[] {
  return transactions.map((tx) => encodeTransaction(tx))
}

/**
 * Validate a transaction
 */
export function validateTransaction(transaction: Transaction): void {
  if (!transaction.sender) {
    throw new Error('Transaction sender is required')
  }

  // Validate that only one transaction type specific field is set
  const typeFields = [
    transaction.payment,
    transaction.assetTransfer,
    transaction.assetConfig,
    transaction.applicationCall,
    transaction.keyRegistration,
    transaction.assetFreeze,
    transaction.heartbeat,
    transaction.stateProof,
  ]

  const setFieldsCount = typeFields.filter((field) => field !== undefined).length

  if (setFieldsCount === 0) {
    throw new Error('No transaction type specific field is set')
  }

  if (setFieldsCount > 1) {
    throw new Error('Multiple transaction type specific fields set')
  }

  // Perform type-specific validation where applicable
  let typeName = 'Transaction'
  const errors = new Array<TransactionValidationError>()
  if (transaction.assetTransfer) {
    typeName = 'Asset transfer'
    errors.push(...validateAssetTransferTransaction(transaction.assetTransfer))
  } else if (transaction.assetConfig) {
    typeName = 'Asset config'
    errors.push(...validateAssetConfigTransaction(transaction.assetConfig))
  } else if (transaction.applicationCall) {
    typeName = 'App call'
    errors.push(...validateAppCallTransaction(transaction.applicationCall))
  } else if (transaction.keyRegistration) {
    typeName = 'Key registration'
    errors.push(...validateKeyRegistrationTransaction(transaction.keyRegistration))
  } else if (transaction.assetFreeze) {
    typeName = 'Asset freeze'
    errors.push(...validateAssetFreezeTransaction(transaction.assetFreeze))
  }

  if (errors.length > 0) {
    const errorMessages = errors.map((e) => getValidationErrorMessage(e))
    throw new Error(`${typeName} validation failed: ${errorMessages.join('\n')}`)
  }
}

/**
 * Encode the transaction without the domain separation (e.g. "TX") prefix
 * This is useful for encoding the transaction for signing with tools that automatically add "TX" prefix to the transaction bytes.
 */
export function encodeTransactionRaw(transaction: Transaction): Uint8Array {
  validateTransaction(transaction)
  const encodingData = toTransactionDto(transaction)
  return encodeMsgpack(encodingData)
}

/**
 * Decodes MsgPack bytes into a transaction.
 *
 * # Parameters
 * * `encoded_transaction` - MsgPack encoded bytes representing a transaction.
 *
 * # Returns
 * A decoded transaction or an error if decoding fails.
 */
export function decodeTransaction(encoded_transaction: Uint8Array): Transaction {
  if (encoded_transaction.length === 0) {
    throw new Error('attempted to decode 0 bytes')
  }

  const prefixBytes = new TextEncoder().encode(TRANSACTION_DOMAIN_SEPARATOR)
  // Check if the transaction has the domain separation prefix
  let hasPrefix = true
  if (encoded_transaction.length < prefixBytes.length) {
    hasPrefix = false
  } else {
    for (let i = 0; i < prefixBytes.length; i++) {
      if (encoded_transaction[i] !== prefixBytes[i]) {
        hasPrefix = false
        break
      }
    }
  }

  const decodedData = decodeMsgpack<TransactionDto>(hasPrefix ? encoded_transaction.slice(prefixBytes.length) : encoded_transaction)
  return fromTransactionDto(decodedData)
}

/**
 * Decodes a collection of MsgPack bytes into a transaction collection.
 *
 * # Parameters
 * * `encoded_transaction` - A collection of MsgPack encoded bytes, each representing a transaction.
 *
 * # Returns
 * A collection of decoded transactions or an error if decoding fails.
 */
export function decodeTransactions(encoded_transactions: Uint8Array[]): Transaction[] {
  return encoded_transactions.map((et) => decodeTransaction(et))
}

/**
 * Return the size of the transaction in bytes as if it was already signed and encoded.
 * This is useful for estimating the fee for the transaction.
 */
export function estimateTransactionSize(transaction: Transaction): bigint {
  const encoded = encodeTransactionRaw(transaction)
  return BigInt(encoded.length + SIGNATURE_ENCODING_INCR)
}

/**
 * Get the raw 32-byte transaction ID for a transaction.
 */
export function getTransactionIdRaw(transaction: Transaction): Uint8Array {
  const encodedBytes = encodeTransaction(transaction)
  return hash(encodedBytes)
}

/**
 * Get the base32 transaction ID string for a transaction.
 */
export function getTransactionId(transaction: Transaction): string {
  const hash = getTransactionIdRaw(transaction)
  return base32.encode(hash).slice(0, TRANSACTION_ID_LENGTH)
}

/**
 * Groups a collection of transactions by calculating and assigning the group to each transaction.
 */
export function groupTransactions(transactions: Transaction[]): Transaction[] {
  const group = computeGroup(transactions)
  return transactions.map((tx) => ({
    ...tx,
    group,
  }))
}

export function assignFee(transaction: Transaction, feeParams: FeeParams): Transaction {
  const fee = calculateFee(transaction, feeParams)
  return {
    ...transaction,
    fee,
  }
}

function computeGroup(transactions: Transaction[]): Uint8Array {
  if (transactions.length === 0) {
    throw new Error('Transaction group size cannot be 0')
  }

  if (transactions.length > MAX_TX_GROUP_SIZE) {
    throw new Error(`Transaction group size exceeds the max limit of ${MAX_TX_GROUP_SIZE}`)
  }

  const txHashes = transactions.map((tx) => {
    if (tx.group) {
      throw new Error('Transactions must not already be grouped')
    }
    return getTransactionIdRaw(tx)
  })

  const prefixBytes = new TextEncoder().encode(TRANSACTION_GROUP_DOMAIN_SEPARATOR)
  const encodedBytes = encodeMsgpack({
    txlist: txHashes,
  })

  const prefixedBytes = concatArrays(prefixBytes, encodedBytes)
  return hash(prefixedBytes)
}

export function calculateFee(transaction: Transaction, feeParams: FeeParams): bigint {
  let calculatedFee = 0n

  if (feeParams.feePerByte > 0n) {
    const estimatedSize = estimateTransactionSize(transaction)
    calculatedFee = feeParams.feePerByte * BigInt(estimatedSize)
  }

  if (calculatedFee < feeParams.minFee) {
    calculatedFee = feeParams.minFee
  }

  if (feeParams.extraFee) {
    calculatedFee += feeParams.extraFee
  }

  if (feeParams.maxFee && calculatedFee > feeParams.maxFee) {
    throw new Error(`Transaction fee ${calculatedFee} µALGO is greater than maxFee ${feeParams.maxFee} µALGO`)
  }

  return calculatedFee
}

/**
 * Get transaction type string for MessagePack
 */
function toTransactionTypeDto(type: TransactionType): TransactionDto['type'] {
  switch (type) {
    case TransactionType.pay:
      return 'pay'
    case TransactionType.axfer:
      return 'axfer'
    case TransactionType.afrz:
      return 'afrz'
    case TransactionType.acfg:
      return 'acfg'
    case TransactionType.keyreg:
      return 'keyreg'
    case TransactionType.appl:
      return 'appl'
    case TransactionType.stpf:
      return 'stpf'
    case TransactionType.hb:
      return 'hb'
    default:
      throw new Error(`Unknown transaction type: ${type}`)
  }
}

/**
 * Get transaction type from MsgPack string
 */
function fromTransactionTypeDto(type: TransactionDto['type']): TransactionType {
  switch (type) {
    case 'pay':
      return TransactionType.pay
    case 'axfer':
      return TransactionType.axfer
    case 'afrz':
      return TransactionType.afrz
    case 'acfg':
      return TransactionType.acfg
    case 'keyreg':
      return TransactionType.keyreg
    case 'appl':
      return TransactionType.appl
    case 'stpf':
      return TransactionType.stpf
    case 'hb':
      return TransactionType.hb
    default:
      throw new Error(`Unknown transaction type string: ${type}`)
  }
}

/**
 * Get on OnApplicationComplete number for MsgPack
 */
function toOnApplicationCompleteDto(onComplete: OnApplicationComplete): Exclude<TransactionDto['apan'], undefined> {
  switch (onComplete) {
    case OnApplicationComplete.NoOp:
      return 0
    case OnApplicationComplete.OptIn:
      return 1
    case OnApplicationComplete.CloseOut:
      return 2
    case OnApplicationComplete.ClearState:
      return 3
    case OnApplicationComplete.UpdateApplication:
      return 4
    case OnApplicationComplete.DeleteApplication:
      return 5
    default:
      throw new Error(`Unknown OnApplicationComplete: ${onComplete}`)
  }
}

/**
 * Get OnApplicationComplete from MsgPack number
 */
function fromOnApplicationCompleteDto(onComplete: TransactionDto['apan']): OnApplicationComplete {
  switch (onComplete ?? 0) {
    case 0:
      return OnApplicationComplete.NoOp
    case 1:
      return OnApplicationComplete.OptIn
    case 2:
      return OnApplicationComplete.CloseOut
    case 3:
      return OnApplicationComplete.ClearState
    case 4:
      return OnApplicationComplete.UpdateApplication
    case 5:
      return OnApplicationComplete.DeleteApplication
    default:
      throw new Error(`Unknown OnApplicationComplete number: ${onComplete}`)
  }
}

const stateSchemaCodec = new OmitEmptyObjectCodec<StateSchema>()
const stateSchemaDtoCodec = new OmitEmptyObjectCodec<StateSchemaDto>()
const assetParamsDtoCodec = new OmitEmptyObjectCodec<AssetParamsDto>()
const heartbeatParamsDtoCodec = new OmitEmptyObjectCodec<HeartbeatParamsDto>()
const heartbeatProofDtoCodec = new OmitEmptyObjectCodec<HeartbeatProofDto>()

export function toTransactionDto(transaction: Transaction): TransactionDto {
  const txDto: TransactionDto = {
    type: toTransactionTypeDto(transaction.type),
    fv: bigIntCodec.encode(transaction.firstValid),
    lv: bigIntCodec.encode(transaction.lastValid),
    snd: addressCodec.encode(transaction.sender),
    gen: stringCodec.encode(transaction.genesisId),
    gh: bytesCodec.encode(transaction.genesisHash),
    fee: bigIntCodec.encode(transaction.fee),
    note: bytesCodec.encode(transaction.note),
    lx: bytesCodec.encode(transaction.lease),
    rekey: addressCodec.encode(transaction.rekeyTo),
    grp: bytesCodec.encode(transaction.group),
  }

  // Add transaction type specific fields
  if (transaction.payment) {
    txDto.amt = bigIntCodec.encode(transaction.payment.amount)
    txDto.rcv = addressCodec.encode(transaction.payment.receiver)
    txDto.close = addressCodec.encode(transaction.payment.closeRemainderTo)
  }

  if (transaction.assetTransfer) {
    txDto.xaid = bigIntCodec.encode(transaction.assetTransfer.assetId)
    txDto.aamt = bigIntCodec.encode(transaction.assetTransfer.amount)
    txDto.arcv = addressCodec.encode(transaction.assetTransfer.receiver)
    txDto.aclose = addressCodec.encode(transaction.assetTransfer.closeRemainderTo)
    txDto.asnd = addressCodec.encode(transaction.assetTransfer.assetSender)
  }

  if (transaction.assetConfig) {
    txDto.caid = bigIntCodec.encode(transaction.assetConfig.assetId)
    // Asset config field
    txDto.apar = assetParamsDtoCodec.encode({
      t: bigIntCodec.encode(transaction.assetConfig.total),
      dc: numberCodec.encode(transaction.assetConfig.decimals),
      df: booleanCodec.encode(transaction.assetConfig.defaultFrozen),
      un: stringCodec.encode(transaction.assetConfig.unitName),
      an: stringCodec.encode(transaction.assetConfig.assetName),
      au: stringCodec.encode(transaction.assetConfig.url),
      am: bytesCodec.encode(transaction.assetConfig.metadataHash),
      m: addressCodec.encode(transaction.assetConfig.manager),
      f: addressCodec.encode(transaction.assetConfig.freeze),
      c: addressCodec.encode(transaction.assetConfig.clawback),
      r: addressCodec.encode(transaction.assetConfig.reserve),
    })
  }

  if (transaction.assetFreeze) {
    txDto.faid = bigIntCodec.encode(transaction.assetFreeze.assetId)
    txDto.fadd = addressCodec.encode(transaction.assetFreeze.freezeTarget)
    txDto.afrz = booleanCodec.encode(transaction.assetFreeze.frozen)
  }

  if (transaction.applicationCall) {
    txDto.apid = bigIntCodec.encode(transaction.applicationCall.appId)
    txDto.apan = numberCodec.encode(toOnApplicationCompleteDto(transaction.applicationCall.onComplete))
    txDto.apap = bytesCodec.encode(transaction.applicationCall.approvalProgram)
    txDto.apsu = bytesCodec.encode(transaction.applicationCall.clearStateProgram)
    if (transaction.applicationCall.globalStateSchema) {
      txDto.apgs = stateSchemaDtoCodec.encode({
        nui: numberCodec.encode(transaction.applicationCall.globalStateSchema.numUints),
        nbs: numberCodec.encode(transaction.applicationCall.globalStateSchema.numByteSlices),
      })
    }
    if (transaction.applicationCall.localStateSchema) {
      txDto.apls = stateSchemaDtoCodec.encode({
        nui: numberCodec.encode(transaction.applicationCall.localStateSchema.numUints),
        nbs: numberCodec.encode(transaction.applicationCall.localStateSchema.numByteSlices),
      })
    }
    txDto.apaa = bytesArrayCodec.encode(transaction.applicationCall.args ?? [])
    txDto.apat = addressArrayCodec.encode(transaction.applicationCall.accounts ?? [])
    txDto.apfa = bigIntArrayCodec.encode(transaction.applicationCall.foreignApps ?? [])
    txDto.apas = bigIntArrayCodec.encode(transaction.applicationCall.foreignAssets ?? [])
    // Encode box references
    if (transaction.applicationCall.boxes && transaction.applicationCall.boxes.length > 0) {
      // TODO: PD same fix for account, app
      txDto.apbx = transaction.applicationCall.boxes.map((box) => {
        const isCurrentApp = box.appIndex === 0n || box.appIndex === transaction.applicationCall?.appId
        const foreignAppsIndex = (transaction.applicationCall?.foreignApps ?? []).indexOf(box.appIndex) + 1
        if (foreignAppsIndex === 0 && !isCurrentApp) {
          throw new Error(`Box ref with appId ${box.appIndex} not in foreign-apps`)
        }

        return {
          i: numberCodec.encode(foreignAppsIndex),
          n: bytesCodec.encode(box.name),
        }
      })
    }
    // Encode access references
    if (transaction.applicationCall.access && transaction.applicationCall.access.length > 0) {
      const accessList: ResourceReferenceDto[] = []
      const appId = transaction.applicationCall.appId

      // Helper function to compare two addresses
      function addressesEqual(a?: Uint8Array, b?: string): boolean {
        if (!a && !b) return true
        if (!a || !b) return false
        const encodedB = addressCodec.encode(b)!

        if (a.length !== encodedB.length) return false
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== encodedB[i]) return false
        }

        return true
      }

      // Helper function to ensure a reference exists and return its 1-based index
      function ensure(target: ResourceReference): number {
        for (let idx = 0; idx < accessList.length; idx++) {
          const a = accessList[idx]
          if (
            addressesEqual(a.d, target.address) &&
            a.s === bigIntCodec.encode(target.assetId) &&
            a.p === bigIntCodec.encode(target.appId)
          ) {
            return idx + 1 // 1-based index
          }
        }
        if (target.address) {
          accessList.push({ d: addressCodec.encode(target.address) })
        }
        if (target.assetId !== undefined) {
          accessList.push({ s: bigIntCodec.encode(target.assetId) })
        }
        if (target.appId !== undefined) {
          accessList.push({ p: bigIntCodec.encode(target.appId) })
        }
        return accessList.length // length is 1-based position of new element
      }

      for (const resourceReference of transaction.applicationCall.access) {
        if (resourceReference.address || resourceReference.assetId || resourceReference.appId) {
          ensure(resourceReference)
          continue
        }

        if (resourceReference.holding) {
          const holding = resourceReference.holding
          let addressIndex = 0
          if (holding.address && holding.address !== ZERO_ADDRESS) {
            addressIndex = ensure({ address: holding.address })
          }
          const assetIndex = ensure({ assetId: holding.assetId })
          accessList.push({
            h: {
              d: numberCodec.encode(addressIndex),
              s: numberCodec.encode(assetIndex),
            },
          })
          continue
        }

        if (resourceReference.locals) {
          const locals = resourceReference.locals
          let addressIndex = 0
          if (locals.address && locals.address !== ZERO_ADDRESS) {
            addressIndex = ensure({ address: locals.address })
          }
          let appIndex = 0
          if (locals.appId && locals.appId !== appId) {
            appIndex = ensure({ appId: locals.appId })
          }
          // TODO: PD - confirm what happens if both are 0
          accessList.push({
            l: {
              d: numberCodec.encode(addressIndex),
              p: numberCodec.encode(appIndex),
            },
          })
          continue
        }

        if (resourceReference.box) {
          const b = resourceReference.box
          let appIdx = 0
          if (b.appIndex && b.appIndex !== appId) {
            appIdx = ensure({ appId: b.appIndex })
          }
          accessList.push({
            b: {
              i: numberCodec.encode(appIdx),
              n: bytesCodec.encode(b.name),
            },
          })
        }
      }

      txDto.al = accessList
    }
    txDto.apep = numberCodec.encode(transaction.applicationCall.extraProgramPages)
  }

  if (transaction.keyRegistration) {
    txDto.votekey = bytesCodec.encode(transaction.keyRegistration.voteKey)
    txDto.selkey = bytesCodec.encode(transaction.keyRegistration.selectionKey)
    txDto.votefst = bigIntCodec.encode(transaction.keyRegistration.voteFirst)
    txDto.votelst = bigIntCodec.encode(transaction.keyRegistration.voteLast)
    txDto.votekd = bigIntCodec.encode(transaction.keyRegistration.voteKeyDilution)
    txDto.sprfkey = bytesCodec.encode(transaction.keyRegistration.stateProofKey)
    txDto.nonpart = booleanCodec.encode(transaction.keyRegistration.nonParticipation)
  }

  if (transaction.heartbeat) {
    txDto.hb = heartbeatParamsDtoCodec.encode({
      a: addressCodec.encode(transaction.heartbeat.address),
      prf: heartbeatProofDtoCodec.encode({
        s: bytesCodec.encode(transaction.heartbeat.proof.sig),
        p: bytesCodec.encode(transaction.heartbeat.proof.pk),
        p2: bytesCodec.encode(transaction.heartbeat.proof.pk2),
        p1s: bytesCodec.encode(transaction.heartbeat.proof.pk1Sig),
        p2s: bytesCodec.encode(transaction.heartbeat.proof.pk2Sig),
      }),
      sd: bytesCodec.encode(transaction.heartbeat.seed),
      vid: bytesCodec.encode(transaction.heartbeat.voteId),
      kd: bigIntCodec.encode(transaction.heartbeat.keyDilution),
    })
  }

  if (transaction.stateProof) {
    txDto.sptype = numberCodec.encode(transaction.stateProof.stateProofType)

    if (transaction.stateProof.stateProof) {
      const sp = transaction.stateProof.stateProof

      txDto.sp = {
        c: bytesCodec.encode(sp.sigCommit),
        w: bigIntCodec.encode(sp.signedWeight),
        S: toMerkleArrayProofDto(sp.sigProofs),
        P: toMerkleArrayProofDto(sp.partProofs),
        v: numberCodec.encode(sp.merkleSignatureSaltVersion),
        r: new Map(
          sp.reveals.map((reveal) => [
            reveal.position,
            {
              s: {
                s: {
                  sig: bytesCodec.encode(reveal.sigslot.sig.signature),
                  idx: bigIntCodec.encode(reveal.sigslot.sig.vectorCommitmentIndex),
                  prf: toMerkleArrayProofDto(reveal.sigslot.sig.proof),
                  vkey: {
                    k: bytesCodec.encode(reveal.sigslot.sig.verifyingKey.publicKey),
                  },
                },
                l: bigIntCodec.encode(reveal.sigslot.lowerSigWeight),
              },
              p: {
                p: {
                  cmt: bytesCodec.encode(reveal.participant.verifier.commitment),
                  lf: bigIntCodec.encode(reveal.participant.verifier.keyLifetime),
                },
                w: bigIntCodec.encode(reveal.participant.weight),
              },
            } satisfies RevealDto,
          ]),
        ),
        pr: sp.positionsToReveal, // Map directly because positionsToReveal array can contain zeros,
      }
    }

    if (transaction.stateProof.message) {
      txDto.spmsg = {
        b: bytesCodec.encode(transaction.stateProof.message.blockHeadersCommitment),
        v: bytesCodec.encode(transaction.stateProof.message.votersCommitment),
        P: bigIntCodec.encode(transaction.stateProof.message.lnProvenWeight),
        f: bigIntCodec.encode(transaction.stateProof.message.firstAttestedRound),
        l: bigIntCodec.encode(transaction.stateProof.message.lastAttestedRound),
      }
    }
  }

  return txDto
}

// TODO: PD - fix bug https://github.com/algorand/js-algorand-sdk/issues/1013
export function fromTransactionDto(transactionDto: TransactionDto): Transaction {
  const transactionType = fromTransactionTypeDto(transactionDto.type)

  const tx: Transaction = {
    type: transactionType,
    sender: addressCodec.decode(transactionDto.snd),
    firstValid: bigIntCodec.decode(transactionDto.fv),
    lastValid: bigIntCodec.decode(transactionDto.lv),
    fee: bigIntCodec.decodeOptional(transactionDto.fee),
    genesisId: stringCodec.decodeOptional(transactionDto.gen),
    genesisHash: bytesCodec.decodeOptional(transactionDto.gh),
    note: bytesCodec.decodeOptional(transactionDto.note),
    lease: bytesCodec.decodeOptional(transactionDto.lx),
    rekeyTo: addressCodec.decodeOptional(transactionDto.rekey),
    group: bytesCodec.decodeOptional(transactionDto.grp),
  }

  // Add transaction type specific fields
  switch (transactionType) {
    case TransactionType.pay:
      tx.payment = {
        amount: bigIntCodec.decode(transactionDto.amt),
        receiver: addressCodec.decode(transactionDto.rcv),
        closeRemainderTo: addressCodec.decodeOptional(transactionDto.close),
      }
      break
    case TransactionType.axfer:
      tx.assetTransfer = {
        assetId: bigIntCodec.decode(transactionDto.xaid),
        amount: bigIntCodec.decode(transactionDto.aamt),
        receiver: addressCodec.decode(transactionDto.arcv),
        closeRemainderTo: addressCodec.decodeOptional(transactionDto.aclose),
        assetSender: addressCodec.decodeOptional(transactionDto.asnd),
      }
      break
    case TransactionType.acfg:
      tx.assetConfig = {
        assetId: bigIntCodec.decode(transactionDto.caid),
        ...(transactionDto.apar !== undefined
          ? {
              total: bigIntCodec.decodeOptional(transactionDto.apar.t),
              decimals: numberCodec.decodeOptional(transactionDto.apar.dc),
              defaultFrozen: booleanCodec.decodeOptional(transactionDto.apar.df),
              unitName: stringCodec.decodeOptional(transactionDto.apar.un),
              assetName: stringCodec.decodeOptional(transactionDto.apar.an),
              url: stringCodec.decodeOptional(transactionDto.apar.au),
              metadataHash: bytesCodec.decodeOptional(transactionDto.apar.am),
              manager: addressCodec.decodeOptional(transactionDto.apar.m),
              reserve: addressCodec.decodeOptional(transactionDto.apar.r),
              freeze: addressCodec.decodeOptional(transactionDto.apar.f),
              clawback: addressCodec.decodeOptional(transactionDto.apar.c),
            }
          : undefined),
      }
      break
    case TransactionType.afrz:
      tx.assetFreeze = {
        assetId: bigIntCodec.decode(transactionDto.faid),
        freezeTarget: addressCodec.decode(transactionDto.fadd),
        frozen: booleanCodec.decode(transactionDto.afrz),
      }
      break
    case TransactionType.appl:
      tx.applicationCall = {
        appId: bigIntCodec.decode(transactionDto.apid),
        onComplete: fromOnApplicationCompleteDto(transactionDto.apan),
        approvalProgram: bytesCodec.decodeOptional(transactionDto.apap),
        clearStateProgram: bytesCodec.decodeOptional(transactionDto.apsu),
        args: transactionDto.apaa?.map((arg) => bytesCodec.decode(arg)),
        accounts: transactionDto.apat?.map((addr) => addressCodec.decode(addr)),
        foreignApps: transactionDto.apfa?.map((id) => bigIntCodec.decode(id)),
        foreignAssets: transactionDto.apas?.map((id) => bigIntCodec.decode(id)),
        boxes: transactionDto.apbx?.map((box) => {
          const index = typeof box.i === 'bigint' ? Number(box.i) : (box.i ?? 0)
          let appId: bigint
          if (index === 0) {
            // 0 means current app
            appId = 0n
          } else {
            // 1-based index into foreignApps array
            const foreignAppId = transactionDto.apfa?.[index - 1]
            if (foreignAppId === undefined) {
              throw new Error(`Failed to find the foreign app at index ${index - 1}`)
            }
            appId = bigIntCodec.decode(foreignAppId)
          }
          return {
            appIndex: appId,
            name: bytesCodec.decode(box.n),
          }
        }),
        access: transactionDto.al
          ? (() => {
              const accessList = transactionDto.al!
              const result: ResourceReference[] = []

              for (const ref of accessList) {
                if (ref.d) {
                  result.push({ address: addressCodec.decode(ref.d) })
                  continue
                }
                if (ref.s !== undefined) {
                  result.push({ assetId: bigIntCodec.decode(ref.s) })
                  continue
                }
                if (ref.p !== undefined) {
                  result.push({ appId: bigIntCodec.decode(ref.p) })
                  continue
                }
                if (ref.h) {
                  const addrIdx = ref.h.d ?? 0
                  const assetIdx = ref.h.s

                  if (assetIdx === undefined) {
                    throw new Error(`Holding missing asset index: ${JSON.stringify(ref.h)}`)
                  }

                  const holdingAddress = addrIdx === 0 ? ZERO_ADDRESS : result[addrIdx - 1].address!
                  const holdingAssetId = result[assetIdx - 1].assetId!

                  result.push({
                    holding: {
                      address: holdingAddress,
                      assetId: holdingAssetId,
                    },
                  })
                  continue
                }

                if (ref.l) {
                  const addrIdx = ref.l.d ?? 0
                  const appIdx = ref.l.p ?? 0

                  const localsAddress = addrIdx === 0 ? ZERO_ADDRESS : result[addrIdx - 1].address!
                  const localsAppId = appIdx === 0 ? BigInt(0) : result[appIdx - 1].appId!

                  result.push({
                    locals: {
                      address: localsAddress,
                      appId: localsAppId,
                    },
                  })
                  continue
                }
                if (ref.b) {
                  const boxAppIdx = ref.b.i ?? 0
                  const name = ref.b.n

                  if (!name) {
                    throw new Error(`Box missing name: ${JSON.stringify(ref.b)}`)
                  }

                  const boxAppId = boxAppIdx === 0 ? BigInt(0) : result[boxAppIdx - 1].appId!

                  result.push({
                    box: {
                      appIndex: boxAppId,
                      name: bytesCodec.decode(name),
                    },
                  })
                }
              }

              return result
            })()
          : undefined,
        extraProgramPages: numberCodec.decodeOptional(transactionDto.apep),
        ...(transactionDto.apgs !== undefined
          ? {
              globalStateSchema: stateSchemaCodec.decodeOptional({
                numUints: numberCodec.decode(transactionDto.apgs.nui),
                numByteSlices: numberCodec.decode(transactionDto.apgs.nbs),
              }),
            }
          : undefined),
        ...(transactionDto.apls !== undefined
          ? {
              localStateSchema: stateSchemaCodec.decodeOptional({
                numUints: numberCodec.decode(transactionDto.apls.nui),
                numByteSlices: numberCodec.decode(transactionDto.apls.nbs),
              }),
            }
          : undefined),
      }
      break
    case TransactionType.keyreg:
      tx.keyRegistration = {
        voteKey: bytesCodec.decodeOptional(transactionDto.votekey),
        selectionKey: bytesCodec.decodeOptional(transactionDto.selkey),
        voteFirst: bigIntCodec.decodeOptional(transactionDto.votefst),
        voteLast: bigIntCodec.decodeOptional(transactionDto.votelst),
        voteKeyDilution: bigIntCodec.decodeOptional(transactionDto.votekd),
        stateProofKey: bytesCodec.decodeOptional(transactionDto.sprfkey),
        nonParticipation: booleanCodec.decodeOptional(transactionDto.nonpart),
      }
      break
    case TransactionType.hb:
      if (transactionDto.hb) {
        tx.heartbeat = {
          address: addressCodec.decode(transactionDto.hb.a),
          proof: {
            sig: bytesCodec.decode(transactionDto.hb.prf?.s),
            pk: bytesCodec.decode(transactionDto.hb.prf?.p),
            pk2: bytesCodec.decode(transactionDto.hb.prf?.p2),
            pk1Sig: bytesCodec.decode(transactionDto.hb.prf?.p1s),
            pk2Sig: bytesCodec.decode(transactionDto.hb.prf?.p2s),
          },
          seed: bytesCodec.decode(transactionDto.hb.sd),
          voteId: bytesCodec.decode(transactionDto.hb.vid),
          keyDilution: bigIntCodec.decode(transactionDto.hb.kd),
        }
      }
      break
    case TransactionType.stpf:
      tx.stateProof = {
        stateProofType: transactionDto.sptype ?? 0,
        stateProof: transactionDto.sp
          ? {
              sigCommit: bytesCodec.decode(transactionDto.sp.c),
              signedWeight: bigIntCodec.decode(transactionDto.sp.w),
              sigProofs: fromMerkleArrayProofDto(transactionDto.sp.S),
              partProofs: fromMerkleArrayProofDto(transactionDto.sp.P),
              merkleSignatureSaltVersion: numberCodec.decode(transactionDto.sp.v),
              reveals: Array.from(transactionDto.sp.r?.entries() ?? []).map(
                ([key, reveal]) =>
                  ({
                    position: bigIntCodec.decode(key),
                    sigslot: {
                      sig: {
                        signature: bytesCodec.decode(reveal.s?.s?.sig),
                        vectorCommitmentIndex: bigIntCodec.decode(reveal.s?.s?.idx),
                        proof: fromMerkleArrayProofDto(reveal.s?.s?.prf),
                        verifyingKey: {
                          publicKey: bytesCodec.decode(reveal.s?.s?.vkey?.k),
                        },
                      },
                      lowerSigWeight: bigIntCodec.decode(reveal.s?.l),
                    },
                    participant: {
                      verifier: {
                        commitment: bytesCodec.decode(reveal.p?.p?.cmt),
                        keyLifetime: bigIntCodec.decode(reveal.p?.p?.lf),
                      },
                      weight: bigIntCodec.decode(reveal.p?.w),
                    },
                  }) satisfies Reveal,
              ),
              positionsToReveal: transactionDto.sp.pr?.map((p) => bigIntCodec.decode(p)) ?? [],
            }
          : undefined,
        message: transactionDto.spmsg
          ? {
              blockHeadersCommitment: bytesCodec.decode(transactionDto.spmsg.b),
              votersCommitment: bytesCodec.decode(transactionDto.spmsg.v),
              lnProvenWeight: bigIntCodec.decode(transactionDto.spmsg.P),
              firstAttestedRound: bigIntCodec.decode(transactionDto.spmsg.f),
              lastAttestedRound: bigIntCodec.decode(transactionDto.spmsg.l),
            }
          : undefined,
      }
      break
  }

  return tx
}

function toMerkleArrayProofDto(model: MerkleArrayProof): MerkleArrayProofDto {
  return {
    pth: model.path.map((p) => bytesCodec.encode(p)).filter((p): p is Uint8Array => p !== undefined),
    hsh: {
      t: numberCodec.encode(model.hashFactory.hashType),
    },
    td: numberCodec.encode(model.treeDepth),
  }
}

function fromMerkleArrayProofDto(dto?: MerkleArrayProofDto): MerkleArrayProof {
  if (!dto) {
    return {
      path: [],
      hashFactory: {
        hashType: 0,
      },
      treeDepth: 0,
    }
  }

  return {
    path: dto.pth?.map((p) => bytesCodec.decode(p)).filter((p): p is Uint8Array => p !== undefined) ?? [],
    hashFactory: {
      hashType: numberCodec.decode(dto.hsh?.t),
    },
    treeDepth: numberCodec.decode(dto.td ?? 0),
  }
}
