/**
 * Auto-generated Zod schemas from OpenAPI specification.
 * Do not edit manually.
 *
 * Generated: 2025-12-13T16:21:01.173Z
 */

import { z } from 'zod'

// Forward declarations for recursive schemas
export type PendingTransactionResponseType = z.infer<typeof PendingTransactionResponse>
export type SimulationTransactionExecTraceType = z.infer<typeof SimulationTransactionExecTrace>

export const GenesisAllocation = z.object({
  addr: z.string(),
  comment: z.string(),
  state: z.object({
  algo: z.bigint(),
  onl: z.number().int(),
  sel: z.string().optional(),
  stprf: z.string().optional(),
  vote: z.string().optional(),
  voteKD: z.bigint().optional(),
  voteFst: z.bigint().optional(),
  voteLst: z.bigint().optional()
})
})

export const Genesis = z.object({
  alloc: z.array(GenesisAllocation),
  comment: z.string().optional(),
  devmode: z.boolean().optional(),
  fees: z.string(),
  id: z.string(),
  network: z.string(),
  proto: z.string(),
  rwd: z.string(),
  timestamp: z.number().int().optional()
})

export const LedgerStateDelta = z.record(z.string(), z.any())

export const LedgerStateDeltaForTransactionGroup = z.object({
  Delta: LedgerStateDelta,
  Ids: z.array(z.string())
})

export const ApplicationStateSchema = z.object({
  'num-uint': z.number().int().gte(0).lte(64),
  'num-byte-slice': z.number().int().gte(0).lte(64)
})

export const TealValue = z.object({
  type: z.number().int(),
  bytes: z.string(),
  uint: z.bigint()
})

export const TealKeyValue = z.object({
  key: z.string(),
  value: TealValue
})

export const TealKeyValueStore = z.array(TealKeyValue)

export const ApplicationLocalState = z.object({
  id: z.bigint(),
  schema: ApplicationStateSchema,
  'key-value': TealKeyValueStore.optional()
})

export const AssetHolding = z.object({
  amount: z.bigint(),
  'asset-id': z.bigint(),
  'is-frozen': z.boolean()
})

export const ApplicationParams = z.object({
  creator: z.string(),
  'approval-program': z.string(),
  'clear-state-program': z.string(),
  'extra-program-pages': z.number().int().gte(0).lte(3).optional(),
  'local-state-schema': ApplicationStateSchema.optional(),
  'global-state-schema': ApplicationStateSchema.optional(),
  'global-state': TealKeyValueStore.optional(),
  version: z.number().int().optional()
})

export const Application = z.object({
  id: z.bigint(),
  params: ApplicationParams
})

export const AssetParams = z.object({
  clawback: z.string().optional(),
  creator: z.string(),
  decimals: z.number().int().gte(0).lte(19),
  'default-frozen': z.boolean().optional(),
  freeze: z.string().optional(),
  manager: z.string().optional(),
  'metadata-hash': z.string().optional(),
  name: z.string().optional(),
  'name-b64': z.string().optional(),
  reserve: z.string().optional(),
  total: z.bigint(),
  'unit-name': z.string().optional(),
  'unit-name-b64': z.string().optional(),
  url: z.string().optional(),
  'url-b64': z.string().optional()
})

export const Asset = z.object({
  index: z.bigint(),
  params: AssetParams
})

export const AccountParticipation = z.object({
  'selection-participation-key': z.string(),
  'vote-first-valid': z.bigint(),
  'vote-key-dilution': z.bigint(),
  'vote-last-valid': z.bigint(),
  'vote-participation-key': z.string(),
  'state-proof-key': z.string().optional()
})

export const Account = z.object({
  address: z.string(),
  amount: z.bigint(),
  'min-balance': z.bigint(),
  'amount-without-pending-rewards': z.bigint(),
  'apps-local-state': z.array(ApplicationLocalState).optional(),
  'total-apps-opted-in': z.number().int(),
  'apps-total-schema': ApplicationStateSchema.optional(),
  'apps-total-extra-pages': z.number().int().optional(),
  assets: z.array(AssetHolding).optional(),
  'total-assets-opted-in': z.number().int(),
  'created-apps': z.array(Application).optional(),
  'total-created-apps': z.number().int(),
  'created-assets': z.array(Asset).optional(),
  'total-created-assets': z.number().int(),
  'total-boxes': z.number().int().optional(),
  'total-box-bytes': z.number().int().optional(),
  participation: AccountParticipation.optional(),
  'incentive-eligible': z.boolean().optional(),
  'pending-rewards': z.bigint(),
  'reward-base': z.bigint().optional(),
  rewards: z.bigint(),
  round: z.bigint(),
  status: z.string(),
  'sig-type': z.enum(['sig', 'msig', 'lsig']).optional(),
  'auth-addr': z.string().optional(),
  'last-proposed': z.bigint().optional(),
  'last-heartbeat': z.bigint().optional()
})

export const AccountAssetHolding = z.object({
  'asset-holding': AssetHolding,
  'asset-params': AssetParams.optional()
})

export const AssetHoldingReference = z.object({
  account: z.string(),
  asset: z.bigint()
})

export const ApplicationLocalReference = z.object({
  account: z.string(),
  app: z.bigint()
})

export const ParticipationKey = z.object({
  id: z.string(),
  address: z.string(),
  'effective-first-valid': z.bigint().optional(),
  'effective-last-valid': z.bigint().optional(),
  'last-vote': z.bigint().optional(),
  'last-block-proposal': z.bigint().optional(),
  'last-state-proof': z.bigint().optional(),
  key: AccountParticipation
})

export const AvmValue = z.object({
  type: z.number().int(),
  bytes: z.string().optional(),
  uint: z.bigint().optional()
})

export const AvmKeyValue = z.object({
  key: z.string(),
  value: AvmValue
})

export const EvalDelta = z.object({
  action: z.number().int(),
  bytes: z.string().optional(),
  uint: z.bigint().optional()
})

export const EvalDeltaKeyValue = z.object({
  key: z.string(),
  value: EvalDelta
})

export const StateDelta = z.array(EvalDeltaKeyValue)

export const AccountStateDelta = z.object({
  address: z.string(),
  delta: StateDelta
})

export const DryrunState = z.object({
  line: z.number().int(),
  pc: z.number().int(),
  stack: z.array(TealValue),
  scratch: z.array(TealValue).optional(),
  error: z.string().optional()
})

export const DryrunTxnResult = z.object({
  disassembly: z.array(z.string()),
  'logic-sig-disassembly': z.array(z.string()).optional(),
  'logic-sig-trace': z.array(DryrunState).optional(),
  'logic-sig-messages': z.array(z.string()).optional(),
  'app-call-trace': z.array(DryrunState).optional(),
  'app-call-messages': z.array(z.string()).optional(),
  'global-delta': StateDelta.optional(),
  'local-deltas': z.array(AccountStateDelta).optional(),
  logs: z.array(z.string()).optional(),
  'budget-added': z.number().int().optional(),
  'budget-consumed': z.number().int().optional()
})

export const ErrorResponse = z.object({
  data: z.object({

}).optional(),
  message: z.string()
})

export const DryrunSource = z.object({
  'field-name': z.string(),
  source: z.string(),
  'txn-index': z.number().int(),
  'app-index': z.bigint()
})

export const DryrunRequest = z.object({
  txns: z.array(z.string()),
  accounts: z.array(Account),
  apps: z.array(Application),
  'protocol-version': z.string(),
  round: z.bigint(),
  'latest-timestamp': z.number().int().gte(0),
  sources: z.array(DryrunSource)
})

export const SimulateRequestTransactionGroup = z.object({
  txns: z.array(z.string())
})

export const SimulateTraceConfig = z.object({
  enable: z.boolean().optional(),
  'stack-change': z.boolean().optional(),
  'scratch-change': z.boolean().optional(),
  'state-change': z.boolean().optional()
})

export const SimulateRequest = z.object({
  'txn-groups': z.array(SimulateRequestTransactionGroup),
  round: z.bigint().optional(),
  'allow-empty-signatures': z.boolean().optional(),
  'allow-more-logging': z.boolean().optional(),
  'allow-unnamed-resources': z.boolean().optional(),
  'extra-opcode-budget': z.number().int().optional(),
  'exec-trace-config': SimulateTraceConfig.optional(),
  'fix-signers': z.boolean().optional()
})

export const Box = z.object({
  round: z.bigint(),
  name: z.string(),
  value: z.string()
})

export const BoxDescriptor = z.object({
  name: z.string()
})

export const BoxReference = z.object({
  app: z.bigint(),
  name: z.string()
})

export const BuildVersion = z.object({
  branch: z.string(),
  build_number: z.number().int(),
  channel: z.string(),
  commit_hash: z.string(),
  major: z.number().int(),
  minor: z.number().int()
})

export const Version = z.object({
  build: BuildVersion,
  genesis_hash_b64: z.string(),
  genesis_id: z.string(),
  versions: z.array(z.string())
})

export const DebugSettingsProf = z.object({
  'block-rate': z.bigint().optional(),
  'mutex-rate': z.bigint().optional()
})

export const PendingTransactionResponse: z.ZodType<any> = z.lazy(() => z.object({
  'asset-index': z.bigint().optional(),
  'application-index': z.bigint().optional(),
  'close-rewards': z.bigint().optional(),
  'closing-amount': z.bigint().optional(),
  'asset-closing-amount': z.bigint().optional(),
  'confirmed-round': z.bigint().optional(),
  'pool-error': z.string(),
  'receiver-rewards': z.bigint().optional(),
  'sender-rewards': z.bigint().optional(),
  'local-state-delta': z.array(AccountStateDelta).optional(),
  'global-state-delta': StateDelta.optional(),
  logs: z.array(z.string()).optional(),
  'inner-txns': z.array(PendingTransactionResponse).optional(),
  txn: z.object({

})
}))

export const ScratchChange = z.object({
  slot: z.number().int(),
  'new-value': AvmValue
})

export const ApplicationStateOperation = z.object({
  operation: z.string(),
  'app-state-type': z.string(),
  key: z.string(),
  'new-value': AvmValue.optional(),
  account: z.string().optional()
})

export const SimulationOpcodeTraceUnit = z.object({
  pc: z.number().int(),
  'scratch-changes': z.array(ScratchChange).optional(),
  'state-changes': z.array(ApplicationStateOperation).optional(),
  'spawned-inners': z.array(z.number().int()).optional(),
  'stack-pop-count': z.number().int().optional(),
  'stack-additions': z.array(AvmValue).optional()
})

export const SimulationTransactionExecTrace: z.ZodType<any> = z.lazy(() => z.object({
  'approval-program-trace': z.array(SimulationOpcodeTraceUnit).optional(),
  'approval-program-hash': z.string().optional(),
  'clear-state-program-trace': z.array(SimulationOpcodeTraceUnit).optional(),
  'clear-state-program-hash': z.string().optional(),
  'clear-state-rollback': z.boolean().optional(),
  'clear-state-rollback-error': z.string().optional(),
  'logic-sig-trace': z.array(SimulationOpcodeTraceUnit).optional(),
  'logic-sig-hash': z.string().optional(),
  'inner-trace': z.array(SimulationTransactionExecTrace).optional()
}))

export const SimulateUnnamedResourcesAccessed = z.object({
  accounts: z.array(z.string()).optional(),
  assets: z.array(z.bigint()).optional(),
  apps: z.array(z.bigint()).optional(),
  boxes: z.array(BoxReference).optional(),
  'extra-box-refs': z.number().int().optional(),
  'asset-holdings': z.array(AssetHoldingReference).optional(),
  'app-locals': z.array(ApplicationLocalReference).optional()
})

export const SimulateTransactionResult = z.object({
  'txn-result': PendingTransactionResponse,
  'app-budget-consumed': z.number().int().optional(),
  'logic-sig-budget-consumed': z.number().int().optional(),
  'exec-trace': SimulationTransactionExecTrace.optional(),
  'unnamed-resources-accessed': SimulateUnnamedResourcesAccessed.optional(),
  'fixed-signer': z.string().optional()
})

export const SimulateTransactionGroupResult = z.object({
  'txn-results': z.array(SimulateTransactionResult),
  'failure-message': z.string().optional(),
  'failed-at': z.array(z.number().int()).optional(),
  'app-budget-added': z.number().int().optional(),
  'app-budget-consumed': z.number().int().optional(),
  'unnamed-resources-accessed': SimulateUnnamedResourcesAccessed.optional()
})

export const StateProofMessage = z.object({
  BlockHeadersCommitment: z.string(),
  VotersCommitment: z.string(),
  LnProvenWeight: z.bigint(),
  FirstAttestedRound: z.bigint(),
  LastAttestedRound: z.bigint()
})

export const StateProof = z.object({
  Message: StateProofMessage,
  StateProof: z.string()
})

export const LightBlockHeaderProof = z.object({
  index: z.number().int(),
  treedepth: z.number().int(),
  proof: z.string()
})

export const SimulationEvalOverrides = z.object({
  'allow-empty-signatures': z.boolean().optional(),
  'allow-unnamed-resources': z.boolean().optional(),
  'max-log-calls': z.number().int().optional(),
  'max-log-size': z.number().int().optional(),
  'extra-opcode-budget': z.number().int().optional(),
  'fix-signers': z.boolean().optional()
})

export const ApplicationKVStorage = z.object({
  kvs: z.array(AvmKeyValue),
  account: z.string().optional()
})

export const ApplicationInitialStates = z.object({
  id: z.bigint(),
  'app-locals': z.array(ApplicationKVStorage).optional(),
  'app-globals': ApplicationKVStorage.optional(),
  'app-boxes': ApplicationKVStorage.optional()
})

export const SimulateInitialStates = z.object({
  'app-initial-states': z.array(ApplicationInitialStates).optional()
})

export const AppCallLogs = z.object({
  logs: z.array(z.string()),
  'application-index': z.bigint(),
  txId: z.string()
})

export const TransactionProof = z.object({
  proof: z.string(),
  stibhash: z.string(),
  treedepth: z.number().int(),
  idx: z.number().int(),
  hashtype: z.enum(['sha512_256', 'sha256'])
})

export const GetBlockTimeStampOffsetResponse = z.object({
  offset: z.number().int()
})

export const GetSyncRoundResponse = z.object({
  round: z.bigint()
})

export const TransactionGroupLedgerStateDeltasForRoundResponse = z.object({
  Deltas: z.array(LedgerStateDeltaForTransactionGroup)
})

export const AccountAssetResponse = z.object({
  round: z.bigint(),
  'asset-holding': AssetHolding.optional(),
  'created-asset': AssetParams.optional()
})

export const AccountAssetsInformationResponse = z.object({
  round: z.bigint(),
  'next-token': z.string().optional(),
  'asset-holdings': z.array(AccountAssetHolding).optional()
})

export const AccountApplicationResponse = z.object({
  round: z.bigint(),
  'app-local-state': ApplicationLocalState.optional(),
  'created-app': ApplicationParams.optional()
})

export const BlockResponse = z.object({
  block: z.object({

}),
  cert: z.object({

}).optional()
})

export const BlockTxidsResponse = z.object({
  blockTxids: z.array(z.string())
})

export const BlockHashResponse = z.object({
  blockHash: z.string()
})

export const CatchpointStartResponse = z.object({
  'catchup-message': z.string()
})

export const CatchpointAbortResponse = z.object({
  'catchup-message': z.string()
})

export const NodeStatusResponse = z.object({
  'catchup-time': z.bigint(),
  'last-round': z.bigint(),
  'last-version': z.string(),
  'next-version': z.string(),
  'next-version-round': z.bigint(),
  'next-version-supported': z.boolean(),
  'stopped-at-unsupported-round': z.boolean(),
  'time-since-last-round': z.bigint(),
  'last-catchpoint': z.string().optional(),
  catchpoint: z.string().optional(),
  'catchpoint-total-accounts': z.number().int().optional(),
  'catchpoint-processed-accounts': z.number().int().optional(),
  'catchpoint-verified-accounts': z.number().int().optional(),
  'catchpoint-total-kvs': z.number().int().optional(),
  'catchpoint-processed-kvs': z.number().int().optional(),
  'catchpoint-verified-kvs': z.number().int().optional(),
  'catchpoint-total-blocks': z.number().int().optional(),
  'catchpoint-acquired-blocks': z.number().int().optional(),
  'upgrade-delay': z.bigint().optional(),
  'upgrade-node-vote': z.boolean().optional(),
  'upgrade-votes-required': z.number().int().optional(),
  'upgrade-votes': z.number().int().optional(),
  'upgrade-yes-votes': z.number().int().optional(),
  'upgrade-no-votes': z.number().int().optional(),
  'upgrade-next-protocol-vote-before': z.bigint().optional(),
  'upgrade-vote-rounds': z.number().int().optional()
})

export const PendingTransactionsResponse = z.object({
  'top-transactions': z.array(z.object({

})),
  'total-transactions': z.number().int()
})

export const ParticipationKeysResponse = z.array(ParticipationKey)

export const PostParticipationResponse = z.object({
  partId: z.string()
})

export const PostTransactionsResponse = z.object({
  txId: z.string()
})

export const SimulateResponse = z.object({
  version: z.number().int(),
  'last-round': z.bigint(),
  'txn-groups': z.array(SimulateTransactionGroupResult),
  'eval-overrides': SimulationEvalOverrides.optional(),
  'exec-trace-config': SimulateTraceConfig.optional(),
  'initial-states': SimulateInitialStates.optional()
})

export const BlockLogsResponse = z.object({
  logs: z.array(AppCallLogs)
})

export const SupplyResponse = z.object({
  current_round: z.bigint(),
  'online-money': z.bigint(),
  'total-money': z.bigint()
})

export const TransactionParametersResponse = z.object({
  'consensus-version': z.string(),
  fee: z.bigint(),
  'genesis-hash': z.string(),
  'genesis-id': z.string(),
  'last-round': z.bigint(),
  'min-fee': z.bigint()
})

export const BoxesResponse = z.object({
  boxes: z.array(BoxDescriptor)
})

export const SourceMap = z.object({
  version: z.number().int(),
  sources: z.array(z.string()),
  names: z.array(z.string()),
  mappings: z.string()
})

export const CompileResponse = z.object({
  hash: z.string(),
  result: z.string(),
  sourcemap: SourceMap.optional()
})

export const DisassembleResponse = z.object({
  result: z.string()
})

export const DryrunResponse = z.object({
  txns: z.array(DryrunTxnResult),
  error: z.string(),
  'protocol-version': z.string()
})
