import type { ModelMetadata } from '../core/model-runtime'
import type { BoxReference } from './box-reference'
import { BoxReferenceMeta } from './box-reference'
import type { OnCompletion } from './on-completion'
import { OnCompletionMeta } from './on-completion'
import type { ResourceRef } from './resource-ref'
import { ResourceRefMeta } from './resource-ref'
import type { StateSchema } from './state-schema'
import { StateSchemaMeta } from './state-schema'

/**
 * Fields for application transactions.
 *
 * Definition:
 * data/transactions/application.go : ApplicationCallTxnFields
 */
export type TransactionApplication = {
  /**
   * \[apid\] ID of the application being configured or empty if creating.
   */
  applicationId: bigint
  onCompletion: OnCompletion

  /**
   * \[apaa\] transaction specific arguments accessed from the application's approval-program and clear-state-program.
   */
  applicationArgs?: string[]

  /**
   * \[al\] Access unifies `accounts`, `foreign-apps`, `foreign-assets`, and `box-references` under a single list. If access is non-empty, these lists must be empty. If access is empty, those lists may be non-empty.
   */
  access?: ResourceRef[]

  /**
   * \[apat\] List of accounts in addition to the sender that may be accessed from the application's approval-program and clear-state-program.
   */
  accounts?: string[]

  /**
   * \[apbx\] the boxes that can be accessed by this transaction (and others in the same group).
   */
  boxReferences?: BoxReference[]

  /**
   * \[apfa\] Lists the applications in addition to the application-id whose global states may be accessed by this application's approval-program and clear-state-program. The access is read-only.
   */
  foreignApps?: bigint[]

  /**
   * \[apas\] lists the assets whose parameters may be accessed by this application's ApprovalProgram and ClearStateProgram. The access is read-only.
   */
  foreignAssets?: bigint[]
  localStateSchema?: StateSchema
  globalStateSchema?: StateSchema

  /**
   * \[apap\] Logic executed for every application transaction, except when on-completion is set to "clear". It can read and write global state for the application, as well as account-specific local state. Approval programs may reject the transaction.
   */
  approvalProgram?: Uint8Array

  /**
   * \[apsu\] Logic executed for application transactions with on-completion set to "clear". It can read and write global state for the application, as well as account-specific local state. Clear state programs cannot reject the transaction.
   */
  clearStateProgram?: Uint8Array

  /**
   * \[epp\] specifies the additional app program len requested in pages.
   */
  extraProgramPages?: number

  /**
   * \[aprv\] the lowest application version for which this transaction should immediately fail. 0 indicates that no version check should be performed.
   */
  rejectVersion?: bigint
}

export const TransactionApplicationMeta: ModelMetadata = {
  name: 'TransactionApplication',
  kind: 'object',
  fields: [
    {
      name: 'applicationId',
      wireKey: 'application-id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'onCompletion',
      wireKey: 'on-completion',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => OnCompletionMeta },
    },
    {
      name: 'applicationArgs',
      wireKey: 'application-args',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'access',
      wireKey: 'access',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => ResourceRefMeta } },
    },
    {
      name: 'accounts',
      wireKey: 'accounts',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'boxReferences',
      wireKey: 'box-references',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => BoxReferenceMeta } },
    },
    {
      name: 'foreignApps',
      wireKey: 'foreign-apps',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'foreignAssets',
      wireKey: 'foreign-assets',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'localStateSchema',
      wireKey: 'local-state-schema',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => StateSchemaMeta },
    },
    {
      name: 'globalStateSchema',
      wireKey: 'global-state-schema',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => StateSchemaMeta },
    },
    {
      name: 'approvalProgram',
      wireKey: 'approval-program',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'clearStateProgram',
      wireKey: 'clear-state-program',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'extraProgramPages',
      wireKey: 'extra-program-pages',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'rejectVersion',
      wireKey: 'reject-version',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
