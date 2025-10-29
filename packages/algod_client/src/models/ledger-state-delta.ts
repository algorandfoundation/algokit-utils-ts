import type { ModelMetadata } from '../core/model-runtime'

/**
 * Ledger StateDelta object
 */
export type LedgerStateDelta = Record<string, unknown>

export const LedgerStateDeltaMeta: ModelMetadata = {
  name: 'LedgerStateDelta',
  kind: 'object',
  fields: [],
}
