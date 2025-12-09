import { SuggestedParams } from '@algorandfoundation/algokit-algod-client'
import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { CommonTransactionParams, buildTransactionCommonData } from './common'

/** Parameters to define an online key registration transaction. */
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

/** Parameters to define an offline key registration transaction. */
export type OfflineKeyRegistrationParams = CommonTransactionParams & {
  /** Prevent this account from ever participating again. The account will also no longer earn rewards */
  preventAccountFromEverParticipatingAgain?: boolean
}

export const buildKeyReg = (
  params: OnlineKeyRegistrationParams | OfflineKeyRegistrationParams,
  suggestedParams: SuggestedParams,
  defaultValidityWindow: bigint,
): Transaction => {
  const commonData = buildTransactionCommonData(params, suggestedParams, defaultValidityWindow)
  if ('voteKey' in params) {
    return new Transaction({
      ...commonData,
      type: TransactionType.KeyRegistration,
      keyRegistration: {
        voteKey: params.voteKey,
        selectionKey: params.selectionKey,
        voteFirst: params.voteFirst,
        voteLast: params.voteLast,
        voteKeyDilution: params.voteKeyDilution,
        nonParticipation: false,
        stateProofKey: params.stateProofKey,
      },
    })
  } else {
    return new Transaction({
      ...commonData,
      type: TransactionType.KeyRegistration,
      keyRegistration: {
        nonParticipation: params.preventAccountFromEverParticipatingAgain,
      },
    })
  }
}
