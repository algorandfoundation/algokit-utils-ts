import { TransactionValidationError, TransactionValidationErrorType } from './common'

/**
 * Represents a key registration transaction that registers an account online or offline
 * for participation in Algorand consensus.
 */
export type KeyRegistrationTransactionFields = {
  /**
   * Root participation public key (32 bytes).
   */
  voteKey?: Uint8Array

  /**
   * VRF public key (32 bytes).
   */
  selectionKey?: Uint8Array

  /**
   * State proof key (64 bytes).
   */
  stateProofKey?: Uint8Array

  /**
   * First round for which the participation key is valid.
   */
  voteFirst?: bigint

  /**
   * Last round for which the participation key is valid.
   */
  voteLast?: bigint

  /**
   * Key dilution for the 2-level participation key.
   */
  voteKeyDilution?: bigint

  /**
   * Mark account as non-reward earning.
   */
  nonParticipation?: boolean
}

/**
 * Validate key registration transaction fields
 */
export function validateKeyRegistrationTransaction(keyReg: KeyRegistrationTransactionFields): TransactionValidationError[] {
  const errors = new Array<TransactionValidationError>()

  const hasAnyParticipationFields =
    keyReg.voteKey !== undefined ||
    keyReg.selectionKey !== undefined ||
    keyReg.stateProofKey !== undefined ||
    keyReg.voteFirst !== undefined ||
    keyReg.voteLast !== undefined ||
    keyReg.voteKeyDilution !== undefined

  if (hasAnyParticipationFields) {
    // Online key registration
    errors.push(...validateOnlineKeyRegistration(keyReg))
  }
  // Offline key registration has no specific validation requirements
  return errors
}

/**
 * Validate online key registration fields
 */
function validateOnlineKeyRegistration(keyReg: KeyRegistrationTransactionFields): TransactionValidationError[] {
  const errors = new Array<TransactionValidationError>()

  if (!keyReg.voteKey) {
    errors.push({
      type: TransactionValidationErrorType.RequiredField,
      data: 'Vote key',
    })
  }
  if (!keyReg.selectionKey) {
    errors.push({
      type: TransactionValidationErrorType.RequiredField,
      data: 'Selection key',
    })
  }
  if (!keyReg.stateProofKey) {
    errors.push({
      type: TransactionValidationErrorType.RequiredField,
      data: 'State proof key',
    })
  }
  if (keyReg.voteFirst === undefined) {
    errors.push({
      type: TransactionValidationErrorType.RequiredField,
      data: 'Vote first',
    })
  }
  if (keyReg.voteLast === undefined) {
    errors.push({
      type: TransactionValidationErrorType.RequiredField,
      data: 'Vote last',
    })
  }
  if (keyReg.voteFirst !== undefined && keyReg.voteLast !== undefined && keyReg.voteFirst >= keyReg.voteLast) {
    errors.push({
      type: TransactionValidationErrorType.ArbitraryConstraint,
      data: 'Vote first must be less than vote last',
    })
  }
  if (keyReg.voteKeyDilution === undefined) {
    errors.push({
      type: TransactionValidationErrorType.RequiredField,
      data: 'Vote key dilution',
    })
  }
  if (keyReg.nonParticipation === true) {
    errors.push({
      type: TransactionValidationErrorType.ArbitraryConstraint,
      data: 'Online key registration cannot have non participation flag set',
    })
  }

  return errors
}
