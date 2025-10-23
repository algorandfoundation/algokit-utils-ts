import {
  MAX_ACCOUNT_REFERENCES,
  MAX_APP_ARGS,
  MAX_APP_REFERENCES,
  MAX_ARGS_SIZE,
  MAX_ASSET_REFERENCES,
  MAX_BOX_REFERENCES,
  MAX_EXTRA_PROGRAM_PAGES,
  MAX_GLOBAL_STATE_KEYS,
  MAX_LOCAL_STATE_KEYS,
  MAX_OVERALL_REFERENCES,
  PROGRAM_PAGE_SIZE,
} from '@algorandfoundation/algokit-common'
import { TransactionValidationError, TransactionValidationErrorType } from './common'

/**
 * Represents an app call transaction that interacts with Algorand Smart Contracts.
 *
 * App call transactions are used to create, update, delete, opt-in to,
 * close out of, or clear state from Algorand apps (smart contracts).
 */
export type AppCallTransactionFields = {
  /**
   * ID of the app being called.
   *
   * Set this to 0 to indicate an app creation call.
   */
  appId: bigint

  /**
   * Defines what additional actions occur with the transaction.
   */
  onComplete: OnApplicationComplete

  /**
   * Logic executed for every app call transaction, except when
   * on-completion is set to "clear".
   *
   * Approval programs may reject the transaction.
   * Only required for app creation and update transactions.
   */
  approvalProgram?: Uint8Array

  /**
   * Logic executed for app call transactions with on-completion set to "clear".
   *
   * Clear state programs cannot reject the transaction.
   * Only required for app creation and update transactions.
   */
  clearStateProgram?: Uint8Array

  /**
   * Holds the maximum number of global state values.
   *
   * Only required for app creation transactions.
   * This cannot be changed after creation.
   */
  globalStateSchema?: StateSchema

  /**
   * Holds the maximum number of local state values.
   *
   * Only required for app creation transactions.
   * This cannot be changed after creation.
   */
  localStateSchema?: StateSchema

  /**
   * Number of additional pages allocated to the app's approval
   * and clear state programs.
   *
   * Each extra program page is 2048 bytes. The sum of approval program
   * and clear state program may not exceed 2048*(1+extra_program_pages) bytes.
   * Currently, the maximum value is 3.
   * This cannot be changed after creation.
   */
  extraProgramPages?: number

  /**
   * Transaction specific arguments available in the app's
   * approval program and clear state program.
   */
  args?: Uint8Array[]

  /**
   * List of accounts in addition to the sender that may be accessed
   * from the app's approval program and clear state program.
   */
  accountReferences?: string[]

  /**
   * List of apps in addition to the current app that may be called
   * from the app's approval program and clear state program.
   */
  appReferences?: bigint[]

  /**
   * Lists the assets whose parameters may be accessed by this app's
   * approval program and clear state program.
   *
   * The access is read-only.
   */
  assetReferences?: bigint[]

  /**
   * The boxes that should be made available for the runtime of the program.
   */
  boxReferences?: BoxReference[]
}

/**
 * On-completion actions for application transactions.
 *
 * These values define what additional actions occur with the transaction.
 */
export enum OnApplicationComplete {
  /**
   * NoOp indicates that an app transaction will simply call its
   * approval program without any additional action.
   */
  NoOp,
  /**
   * OptIn indicates that an app transaction will allocate some
   * local state for the app in the sender's account.
   */
  OptIn,
  /**
   * CloseOut indicates that an app transaction will deallocate
   * some local state for the app from the user's account.
   */
  CloseOut,
  /**
   * ClearState is similar to CloseOut, but may never fail. This
   * allows users to reclaim their minimum balance from an app
   * they no longer wish to opt in to.
   */
  ClearState,
  /**
   * UpdateApplication indicates that an app transaction will
   * update the approval program and clear state program for the app.
   */
  UpdateApplication,
  /**
   * DeleteApplication indicates that an app transaction will
   * delete the app parameters for the app from the creator's
   * balance record.
   */
  DeleteApplication,
}

/**
 * Schema for app state storage.
 *
 * Defines the maximum number of values that may be stored in app
 * key/value storage for both global and local state.
 */
export type StateSchema = {
  /**
   * Maximum number of integer values that may be stored.
   */
  numUints: number

  /**
   * Maximum number of byte slice values that may be stored.
   */
  numByteSlices: number
}

/**
 * Box reference for app call transactions.
 *
 * References a specific box that should be made available for the runtime
 * of the program.
 */
export type BoxReference = {
  /**
   * App ID that owns the box.
   * A value of 0 indicates the current app.
   */
  appId: bigint

  /**
   * Name of the box.
   */
  name: Uint8Array
}

const FIELD_ARGS = 'Args'
const FIELD_APPROVAL_PROGRAM = 'Approval program'
const FIELD_CLEAR_STATE_PROGRAM = 'Clear state program'
const FIELD_GLOBAL_STATE_SCHEMA = 'Global state schema'
const FIELD_LOCAL_STATE_SCHEMA = 'Local state schema'
const FIELD_EXTRA_PROGRAM_PAGES = 'Extra program pages'

/**
 * Validate app call transaction fields
 */
export function validateAppCallTransaction(appCall: AppCallTransactionFields): TransactionValidationError[] {
  const errors = new Array<TransactionValidationError>()

  if (appCall.appId === 0n) {
    // App creation
    errors.push(...validateAppCreation(appCall))
  } else {
    // App call, update, or delete
    errors.push(...validateAppOperation(appCall))
  }

  // Common validations for all app operations
  errors.push(...validateAppCommonFields(appCall))

  return errors
}

/**
 * Validate app creation fields
 */
function validateAppCreation(appCall: AppCallTransactionFields): TransactionValidationError[] {
  const errors = new Array<TransactionValidationError>()

  if (!appCall.approvalProgram || appCall.approvalProgram.length === 0) {
    errors.push({
      type: TransactionValidationErrorType.RequiredField,
      data: FIELD_APPROVAL_PROGRAM,
    })
  }

  if (!appCall.clearStateProgram || appCall.clearStateProgram.length === 0) {
    errors.push({
      type: TransactionValidationErrorType.RequiredField,
      data: FIELD_CLEAR_STATE_PROGRAM,
    })
  }

  const extraPages = appCall.extraProgramPages ?? 0
  if (extraPages > MAX_EXTRA_PROGRAM_PAGES) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: FIELD_EXTRA_PROGRAM_PAGES,
        actual: extraPages,
        max: MAX_EXTRA_PROGRAM_PAGES,
        unit: 'pages',
      },
    })
  }

  const maxProgramSize = PROGRAM_PAGE_SIZE + extraPages * PROGRAM_PAGE_SIZE

  if (appCall.approvalProgram && appCall.approvalProgram.length > maxProgramSize) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: FIELD_APPROVAL_PROGRAM,
        actual: appCall.approvalProgram.length,
        max: maxProgramSize,
        unit: 'bytes',
      },
    })
  }

  if (appCall.clearStateProgram && appCall.clearStateProgram.length > maxProgramSize) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: FIELD_CLEAR_STATE_PROGRAM,
        actual: appCall.clearStateProgram.length,
        max: maxProgramSize,
        unit: 'bytes',
      },
    })
  }

  const totalProgramSize = (appCall.approvalProgram?.length ?? 0) + (appCall.clearStateProgram?.length ?? 0)
  if (totalProgramSize > maxProgramSize) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: 'Combined approval and clear state programs',
        actual: totalProgramSize,
        max: maxProgramSize,
        unit: 'bytes',
      },
    })
  }

  if (appCall.globalStateSchema) {
    const totalKeys = appCall.globalStateSchema.numUints + appCall.globalStateSchema.numByteSlices
    if (totalKeys > MAX_GLOBAL_STATE_KEYS) {
      errors.push({
        type: TransactionValidationErrorType.FieldTooLong,
        data: {
          field: FIELD_GLOBAL_STATE_SCHEMA,
          actual: appCall.globalStateSchema.numUints + appCall.globalStateSchema.numByteSlices,
          max: MAX_GLOBAL_STATE_KEYS,
          unit: 'keys',
        },
      })
    }
  }

  if (appCall.localStateSchema) {
    const totalKeys = appCall.localStateSchema.numUints + appCall.localStateSchema.numByteSlices
    if (totalKeys > MAX_LOCAL_STATE_KEYS) {
      errors.push({
        type: TransactionValidationErrorType.FieldTooLong,
        data: {
          field: FIELD_LOCAL_STATE_SCHEMA,
          actual: appCall.localStateSchema.numUints + appCall.localStateSchema.numByteSlices,
          max: MAX_LOCAL_STATE_KEYS,
          unit: 'keys',
        },
      })
    }
  }

  return errors
}

/**
 * Validate app operation (update, delete, call) fields
 */
function validateAppOperation(appCall: AppCallTransactionFields): TransactionValidationError[] {
  const errors = new Array<TransactionValidationError>()

  if (appCall.onComplete === OnApplicationComplete.UpdateApplication) {
    if (!appCall.approvalProgram || appCall.approvalProgram.length === 0) {
      errors.push({
        type: TransactionValidationErrorType.RequiredField,
        data: FIELD_APPROVAL_PROGRAM,
      })
    }
    if (!appCall.clearStateProgram || appCall.clearStateProgram.length === 0) {
      errors.push({
        type: TransactionValidationErrorType.RequiredField,
        data: FIELD_CLEAR_STATE_PROGRAM,
      })
    }
  }

  // These fields are immutable and cannot be set for existing apps
  if (appCall.globalStateSchema !== undefined) {
    errors.push({
      type: TransactionValidationErrorType.ImmutableField,
      data: FIELD_GLOBAL_STATE_SCHEMA,
    })
  }
  if (appCall.localStateSchema !== undefined) {
    errors.push({
      type: TransactionValidationErrorType.ImmutableField,
      data: FIELD_LOCAL_STATE_SCHEMA,
    })
  }
  if (appCall.extraProgramPages !== undefined) {
    errors.push({
      type: TransactionValidationErrorType.ImmutableField,
      data: FIELD_EXTRA_PROGRAM_PAGES,
    })
  }

  return errors
}

/**
 * Validate common app call fields
 */
function validateAppCommonFields(appCall: AppCallTransactionFields): TransactionValidationError[] {
  const errors = new Array<TransactionValidationError>()

  if (appCall.args) {
    if (appCall.args.length > MAX_APP_ARGS) {
      errors.push({
        type: TransactionValidationErrorType.FieldTooLong,
        data: {
          field: FIELD_ARGS,
          actual: appCall.args.length,
          max: MAX_APP_ARGS,
          unit: 'arguments',
        },
      })
    }

    const totalArgsSize = appCall.args.reduce((sum, arg) => sum + arg.length, 0)
    if (totalArgsSize > MAX_ARGS_SIZE) {
      errors.push({
        type: TransactionValidationErrorType.FieldTooLong,
        data: {
          field: 'Args total size',
          actual: totalArgsSize,
          max: MAX_ARGS_SIZE,
          unit: 'bytes',
        },
      })
    }
  }

  if (appCall.accountReferences && appCall.accountReferences.length > MAX_ACCOUNT_REFERENCES) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: 'Account references',
        actual: appCall.accountReferences.length,
        max: MAX_ACCOUNT_REFERENCES,
        unit: 'refs',
      },
    })
  }

  if (appCall.appReferences && appCall.appReferences.length > MAX_APP_REFERENCES) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: 'App references',
        actual: appCall.appReferences.length,
        max: MAX_APP_REFERENCES,
        unit: 'refs',
      },
    })
  }

  if (appCall.assetReferences && appCall.assetReferences.length > MAX_ASSET_REFERENCES) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: 'Asset references',
        actual: appCall.assetReferences.length,
        max: MAX_ASSET_REFERENCES,
        unit: 'refs',
      },
    })
  }

  // Validate box references
  if (appCall.boxReferences) {
    if (appCall.boxReferences.length > MAX_BOX_REFERENCES) {
      errors.push({
        type: TransactionValidationErrorType.FieldTooLong,
        data: {
          field: 'Box references',
          actual: appCall.boxReferences.length,
          max: MAX_BOX_REFERENCES,
          unit: 'refs',
        },
      })
    }

    // Validate that box reference app IDs are in app references
    const appRefs = appCall.appReferences || []
    for (const boxRef of appCall.boxReferences) {
      if (boxRef.appId !== 0n && boxRef.appId !== appCall.appId && !appRefs.includes(boxRef.appId)) {
        errors.push({
          type: TransactionValidationErrorType.ArbitraryConstraint,
          data: `Box reference for app ID ${boxRef.appId} must be in app references`,
        })
      }
    }
  }

  // Validate overall reference count
  const totalReferences =
    (appCall.accountReferences?.length || 0) +
    (appCall.appReferences?.length || 0) +
    (appCall.assetReferences?.length || 0) +
    (appCall.boxReferences?.length || 0)

  if (totalReferences > MAX_OVERALL_REFERENCES) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: 'Total references',
        actual: totalReferences,
        max: MAX_OVERALL_REFERENCES,
        unit: 'refs',
      },
    })
  }

  return errors
}
