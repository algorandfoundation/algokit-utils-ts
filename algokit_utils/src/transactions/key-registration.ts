import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { CommonTransactionParams, ComposerTransactionType, TransactionHeader } from './common'

export type OnlineKeyRegistrationComposerTransaction = {
  type: ComposerTransactionType.OnlineKeyRegistration
  data: OnlineKeyRegistrationParams
}
export type OfflineKeyRegistrationComposerTransaction = {
  type: ComposerTransactionType.OfflineKeyRegistration
  data: OfflineKeyRegistrationParams
}
export type NonParticipationKeyRegistrationComposerTransaction = {
  type: ComposerTransactionType.NonParticipationKeyRegistration
  data: NonParticipationKeyRegistrationParams
}

/** Parameters for creating an online key registration transaction. */
export type OnlineKeyRegistrationParams = CommonTransactionParams & {
  /** The root participation public key */
  voteKey: Uint8Array
  /** The VRF public key */
  selectionKey: Uint8Array
  /** The first round that the participation key is valid. Not to be confused with the `firstValid` round of the keyreg transaction */
  voteFirst: bigint
  /** The last round that the participation key is valid. Not to be confused with the `lastValid` round of the keyreg transaction */
  voteLast: bigint
  /** This is the dilution for the 2-level participation key. It determines the interval (number of rounds) for generating new ephemeral keys */
  voteKeyDilution: bigint
  /** The 64 byte state proof public key commitment */
  stateProofKey?: Uint8Array
}

/** Parameters for creating an offline key registration transaction. */
export type OfflineKeyRegistrationParams = CommonTransactionParams

/** Parameters for creating an non participation key registration transaction.
 *
 * **Warning:** This will prevent the sender account from ever participating again. The account will also no longer earn rewards.
 */
export type NonParticipationKeyRegistrationParams = CommonTransactionParams

export const buildOnlineKeyRegistration = (params: OnlineKeyRegistrationParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.KeyRegistration,
    keyRegistration: {
      voteKey: params.voteKey,
      selectionKey: params.selectionKey,
      voteFirst: params.voteFirst,
      voteLast: params.voteLast,
      voteKeyDilution: params.voteKeyDilution,
      stateProofKey: params.stateProofKey,
      nonParticipation: false,
    },
  }
}

export const buildOfflineKeyRegistration = (_params: OfflineKeyRegistrationParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.KeyRegistration,
    keyRegistration: {
      // All fields undefined/empty for offline key registration
      nonParticipation: false,
    },
  }
}

export const buildNonParticipationKeyRegistration = (
  _params: NonParticipationKeyRegistrationParams,
  header: TransactionHeader,
): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.KeyRegistration,
    keyRegistration: {
      nonParticipation: true,
    },
  }
}
