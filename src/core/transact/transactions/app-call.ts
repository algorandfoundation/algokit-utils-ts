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
