/**
 * Auto-generated Zod schemas from OpenAPI specification.
 * Do not edit manually.
 *
 * Generated: 2025-12-28T18:23:43.020Z
 */

import { Address } from '@algorandfoundation/algokit-common'
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
  delta: LedgerStateDelta,
  ids: z.array(z.string())
})

export const ApplicationStateSchema = z.object({
  numUints: z.number().int().gte(0).lte(64),
  numByteSlices: z.number().int().gte(0).lte(64)
})

export const TealValue = z.object({
  type: z.number().int(),
  bytes: z.instanceof(Uint8Array),
  uint: z.bigint()
})

export const TealKeyValue = z.object({
  key: z.instanceof(Uint8Array),
  value: TealValue
})

export const TealKeyValueStore = z.array(TealKeyValue)

export const ApplicationLocalState = z.object({
  id: z.bigint(),
  schema: ApplicationStateSchema,
  keyValue: TealKeyValueStore.optional()
})

export const AssetHolding = z.object({
  amount: z.bigint(),
  assetId: z.bigint(),
  isFrozen: z.boolean()
})

export const ApplicationParams = z.object({
  creator: z.instanceof(Address),
  approvalProgram: z.instanceof(Uint8Array),
  clearStateProgram: z.instanceof(Uint8Array),
  extraProgramPages: z.number().int().gte(0).lte(3).optional(),
  localStateSchema: ApplicationStateSchema.optional(),
  globalStateSchema: ApplicationStateSchema.optional(),
  globalState: TealKeyValueStore.optional(),
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
  defaultFrozen: z.boolean().optional(),
  freeze: z.string().optional(),
  manager: z.string().optional(),
  metadataHash: z.instanceof(Uint8Array).optional(),
  name: z.string().optional(),
  nameB64: z.instanceof(Uint8Array).optional(),
  reserve: z.string().optional(),
  total: z.bigint(),
  unitName: z.string().optional(),
  unitNameB64: z.instanceof(Uint8Array).optional(),
  url: z.string().optional(),
  urlB64: z.instanceof(Uint8Array).optional()
})

export const Asset = z.object({
  id: z.bigint(),
  params: AssetParams
})

export const AccountParticipation = z.object({
  selectionParticipationKey: z.instanceof(Uint8Array),
  voteFirstValid: z.bigint(),
  voteKeyDilution: z.bigint(),
  voteLastValid: z.bigint(),
  voteParticipationKey: z.instanceof(Uint8Array),
  stateProofKey: z.instanceof(Uint8Array).optional()
})

export const Account = z.object({
  address: z.instanceof(Address),
  amount: z.bigint(),
  minBalance: z.bigint(),
  amountWithoutPendingRewards: z.bigint(),
  appsLocalState: z.array(ApplicationLocalState).optional(),
  totalAppsOptedIn: z.number().int(),
  appsTotalSchema: ApplicationStateSchema.optional(),
  appsTotalExtraPages: z.number().int().optional(),
  assets: z.array(AssetHolding).optional(),
  totalAssetsOptedIn: z.number().int(),
  createdApps: z.array(Application).optional(),
  totalCreatedApps: z.number().int(),
  createdAssets: z.array(Asset).optional(),
  totalCreatedAssets: z.number().int(),
  totalBoxes: z.number().int().optional(),
  totalBoxBytes: z.number().int().optional(),
  participation: AccountParticipation.optional(),
  incentiveEligible: z.boolean().optional(),
  pendingRewards: z.bigint(),
  rewardBase: z.bigint().optional(),
  rewards: z.bigint(),
  round: z.bigint(),
  status: z.string(),
  sigType: z.enum(['sig', 'msig', 'lsig']).optional(),
  authAddr: z.instanceof(Address).optional(),
  lastProposed: z.bigint().optional(),
  lastHeartbeat: z.bigint().optional()
})

export const AccountAssetHolding = z.object({
  assetHolding: AssetHolding,
  assetParams: AssetParams.optional()
})

export const AssetHoldingReference = z.object({
  account: z.instanceof(Address),
  asset: z.bigint()
})

export const ApplicationLocalReference = z.object({
  account: z.instanceof(Address),
  app: z.bigint()
})

export const ParticipationKey = z.object({
  id: z.string(),
  address: z.instanceof(Address),
  effectiveFirstValid: z.bigint().optional(),
  effectiveLastValid: z.bigint().optional(),
  lastVote: z.bigint().optional(),
  lastBlockProposal: z.bigint().optional(),
  lastStateProof: z.bigint().optional(),
  key: AccountParticipation
})

export const AvmValue = z.object({
  type: z.number().int(),
  bytes: z.instanceof(Uint8Array).optional(),
  uint: z.bigint().optional()
})

export const AvmKeyValue = z.object({
  key: z.instanceof(Uint8Array),
  value: AvmValue
})

export const EvalDelta = z.object({
  action: z.number().int(),
  bytes: z.instanceof(Uint8Array).optional(),
  uint: z.bigint().optional()
})

export const EvalDeltaKeyValue = z.object({
  key: z.instanceof(Uint8Array),
  value: EvalDelta
})

export const StateDelta = z.array(EvalDeltaKeyValue)

export const AccountStateDelta = z.object({
  address: z.instanceof(Address),
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
  logicSigDisassembly: z.array(z.string()).optional(),
  logicSigTrace: z.array(DryrunState).optional(),
  logicSigMessages: z.array(z.string()).optional(),
  appCallTrace: z.array(DryrunState).optional(),
  appCallMessages: z.array(z.string()).optional(),
  globalDelta: StateDelta.optional(),
  localDeltas: z.array(AccountStateDelta).optional(),
  logs: z.array(z.instanceof(Uint8Array)).optional(),
  budgetAdded: z.number().int().optional(),
  budgetConsumed: z.number().int().optional()
})

export const ErrorResponse = z.object({
  data: z.record(z.string(), z.any()).optional(),
  message: z.string()
})

export const DryrunSource = z.object({
  fieldName: z.string(),
  source: z.string(),
  txnIndex: z.number().int(),
  appId: z.bigint()
})

export const DryrunRequest = z.object({
  txns: z.array(z.string()),
  accounts: z.array(Account),
  apps: z.array(Application),
  protocolVersion: z.string(),
  round: z.bigint(),
  latestTimestamp: z.number().int().gte(0),
  sources: z.array(DryrunSource)
})

export const SimulateRequestTransactionGroup = z.object({
  txns: z.array(z.string())
})

export const SimulateTraceConfig = z.object({
  enable: z.boolean().optional(),
  stackChange: z.boolean().optional(),
  scratchChange: z.boolean().optional(),
  stateChange: z.boolean().optional()
})

export const SimulateRequest = z.object({
  txnGroups: z.array(SimulateRequestTransactionGroup),
  round: z.bigint().optional(),
  allowEmptySignatures: z.boolean().optional(),
  allowMoreLogging: z.boolean().optional(),
  allowUnnamedResources: z.boolean().optional(),
  extraOpcodeBudget: z.number().int().optional(),
  execTraceConfig: SimulateTraceConfig.optional(),
  fixSigners: z.boolean().optional()
})

export const Box = z.object({
  round: z.bigint(),
  name: z.instanceof(Uint8Array),
  value: z.instanceof(Uint8Array)
})

export const BoxDescriptor = z.object({
  name: z.instanceof(Uint8Array)
})

export const BoxReference = z.object({
  app: z.bigint(),
  name: z.instanceof(Uint8Array)
})

export const BuildVersion = z.object({
  branch: z.string(),
  buildNumber: z.number().int(),
  channel: z.string(),
  commitHash: z.string(),
  major: z.number().int(),
  minor: z.number().int()
})

export const Version = z.object({
  build: BuildVersion,
  genesisHashB64: z.instanceof(Uint8Array),
  genesisId: z.string(),
  versions: z.array(z.string())
})

export const DebugSettingsProf = z.object({
  blockRate: z.bigint().optional(),
  mutexRate: z.bigint().optional()
})

export const PendingTransactionResponse: z.ZodType<any> = z.lazy(() => z.object({
  assetId: z.bigint().optional(),
  appId: z.bigint().optional(),
  closeRewards: z.bigint().optional(),
  closingAmount: z.bigint().optional(),
  assetClosingAmount: z.bigint().optional(),
  confirmedRound: z.bigint().optional(),
  poolError: z.string(),
  receiverRewards: z.bigint().optional(),
  senderRewards: z.bigint().optional(),
  localStateDelta: z.array(AccountStateDelta).optional(),
  globalStateDelta: StateDelta.optional(),
  logs: z.array(z.instanceof(Uint8Array)).optional(),
  innerTxns: z.array(PendingTransactionResponse).optional(),
  txn: z.record(z.string(), z.any())
}))

export const ScratchChange = z.object({
  slot: z.number().int(),
  newValue: AvmValue
})

export const ApplicationStateOperation = z.object({
  operation: z.string(),
  appStateType: z.string(),
  key: z.instanceof(Uint8Array),
  newValue: AvmValue.optional(),
  account: z.instanceof(Address).optional()
})

export const SimulationOpcodeTraceUnit = z.object({
  pc: z.number().int(),
  scratchChanges: z.array(ScratchChange).optional(),
  stateChanges: z.array(ApplicationStateOperation).optional(),
  spawnedInners: z.array(z.number().int()).optional(),
  stackPopCount: z.number().int().optional(),
  stackAdditions: z.array(AvmValue).optional()
})

export const SimulationTransactionExecTrace: z.ZodType<any> = z.lazy(() => z.object({
  approvalProgramTrace: z.array(SimulationOpcodeTraceUnit).optional(),
  approvalProgramHash: z.instanceof(Uint8Array).optional(),
  clearStateProgramTrace: z.array(SimulationOpcodeTraceUnit).optional(),
  clearStateProgramHash: z.instanceof(Uint8Array).optional(),
  clearStateRollback: z.boolean().optional(),
  clearStateRollbackError: z.string().optional(),
  logicSigTrace: z.array(SimulationOpcodeTraceUnit).optional(),
  logicSigHash: z.instanceof(Uint8Array).optional(),
  innerTrace: z.array(SimulationTransactionExecTrace).optional()
}))

export const SimulateUnnamedResourcesAccessed = z.object({
  accounts: z.array(z.instanceof(Address)).optional(),
  assets: z.array(z.bigint()).optional(),
  apps: z.array(z.bigint()).optional(),
  boxes: z.array(BoxReference).optional(),
  extraBoxRefs: z.number().int().optional(),
  assetHoldings: z.array(AssetHoldingReference).optional(),
  appLocals: z.array(ApplicationLocalReference).optional()
})

export const SimulateTransactionResult = z.object({
  txnResult: PendingTransactionResponse,
  appBudgetConsumed: z.number().int().optional(),
  logicSigBudgetConsumed: z.number().int().optional(),
  execTrace: SimulationTransactionExecTrace.optional(),
  unnamedResourcesAccessed: SimulateUnnamedResourcesAccessed.optional(),
  fixedSigner: z.instanceof(Address).optional()
})

export const SimulateTransactionGroupResult = z.object({
  txnResults: z.array(SimulateTransactionResult),
  failureMessage: z.string().optional(),
  failedAt: z.array(z.number().int()).optional(),
  appBudgetAdded: z.number().int().optional(),
  appBudgetConsumed: z.number().int().optional(),
  unnamedResourcesAccessed: SimulateUnnamedResourcesAccessed.optional()
})

export const StateProofMessage = z.object({
  blockHeadersCommitment: z.instanceof(Uint8Array),
  votersCommitment: z.instanceof(Uint8Array),
  lnProvenWeight: z.bigint(),
  firstAttestedRound: z.bigint(),
  lastAttestedRound: z.bigint()
})

export const StateProof = z.object({
  message: StateProofMessage,
  stateProof: z.instanceof(Uint8Array)
})

export const LightBlockHeaderProof = z.object({
  index: z.number().int(),
  treedepth: z.number().int(),
  proof: z.instanceof(Uint8Array)
})

export const SimulationEvalOverrides = z.object({
  allowEmptySignatures: z.boolean().optional(),
  allowUnnamedResources: z.boolean().optional(),
  maxLogCalls: z.number().int().optional(),
  maxLogSize: z.number().int().optional(),
  extraOpcodeBudget: z.number().int().optional(),
  fixSigners: z.boolean().optional()
})

export const ApplicationKVStorage = z.object({
  kvs: z.array(AvmKeyValue),
  account: z.instanceof(Address).optional()
})

export const ApplicationInitialStates = z.object({
  id: z.bigint(),
  appLocals: z.array(ApplicationKVStorage).optional(),
  appGlobals: ApplicationKVStorage.optional(),
  appBoxes: ApplicationKVStorage.optional()
})

export const SimulateInitialStates = z.object({
  appInitialStates: z.array(ApplicationInitialStates).optional()
})

export const AppCallLogs = z.object({
  logs: z.array(z.instanceof(Uint8Array)),
  appId: z.bigint(),
  txId: z.string()
})

export const TransactionProof = z.object({
  proof: z.instanceof(Uint8Array),
  stibhash: z.instanceof(Uint8Array),
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
  deltas: z.array(LedgerStateDeltaForTransactionGroup)
})

export const AccountAssetResponse = z.object({
  round: z.bigint(),
  assetHolding: AssetHolding.optional(),
  createdAsset: AssetParams.optional()
})

export const AccountAssetsInformationResponse = z.object({
  round: z.bigint(),
  nextToken: z.string().optional(),
  assetHoldings: z.array(AccountAssetHolding).optional()
})

export const AccountApplicationResponse = z.object({
  round: z.bigint(),
  appLocalState: ApplicationLocalState.optional(),
  createdApp: ApplicationParams.optional()
})

export const BlockResponse = z.object({
  block: z.record(z.string(), z.any()),
  cert: z.record(z.string(), z.any()).optional()
})

export const BlockTxidsResponse = z.object({
  blockTxIds: z.array(z.string())
})

export const BlockHashResponse = z.object({
  blockHash: z.string()
})

export const CatchpointStartResponse = z.object({
  catchupMessage: z.string()
})

export const CatchpointAbortResponse = z.object({
  catchupMessage: z.string()
})

export const NodeStatusResponse = z.object({
  catchupTime: z.bigint(),
  lastRound: z.bigint(),
  lastVersion: z.string(),
  nextVersion: z.string(),
  nextVersionRound: z.bigint(),
  nextVersionSupported: z.boolean(),
  stoppedAtUnsupportedRound: z.boolean(),
  timeSinceLastRound: z.bigint(),
  lastCatchpoint: z.string().optional(),
  catchpoint: z.string().optional(),
  catchpointTotalAccounts: z.number().int().optional(),
  catchpointProcessedAccounts: z.number().int().optional(),
  catchpointVerifiedAccounts: z.number().int().optional(),
  catchpointTotalKvs: z.number().int().optional(),
  catchpointProcessedKvs: z.number().int().optional(),
  catchpointVerifiedKvs: z.number().int().optional(),
  catchpointTotalBlocks: z.number().int().optional(),
  catchpointAcquiredBlocks: z.number().int().optional(),
  upgradeDelay: z.bigint().optional(),
  upgradeNodeVote: z.boolean().optional(),
  upgradeVotesRequired: z.number().int().optional(),
  upgradeVotes: z.number().int().optional(),
  upgradeYesVotes: z.number().int().optional(),
  upgradeNoVotes: z.number().int().optional(),
  upgradeNextProtocolVoteBefore: z.bigint().optional(),
  upgradeVoteRounds: z.number().int().optional()
})

export const PendingTransactionsResponse = z.object({
  topTransactions: z.array(z.record(z.string(), z.any())),
  totalTransactions: z.number().int()
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
  lastRound: z.bigint(),
  txnGroups: z.array(SimulateTransactionGroupResult),
  evalOverrides: SimulationEvalOverrides.optional(),
  execTraceConfig: SimulateTraceConfig.optional(),
  initialStates: SimulateInitialStates.optional()
})

export const BlockLogsResponse = z.object({
  logs: z.array(AppCallLogs)
})

export const SupplyResponse = z.object({
  currentRound: z.bigint(),
  onlineMoney: z.bigint(),
  totalMoney: z.bigint()
})

export const TransactionParametersResponse = z.object({
  consensusVersion: z.string(),
  fee: z.bigint(),
  genesisHash: z.instanceof(Uint8Array),
  genesisId: z.string(),
  lastRound: z.bigint(),
  minFee: z.bigint()
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
  protocolVersion: z.string()
})

// =============================================================================
// Algod-specific extensions
// =============================================================================

/**
 * Contains parameters relevant to the creation of a new transaction in a specific network at a specific time.
 * This extends TransactionParametersResponse by removing lastRound and adding transaction validity fields.
 */
export const SuggestedParams = TransactionParametersResponse.omit({ lastRound: true }).extend({
  flatFee: z.boolean(),
  firstValid: z.bigint(),
  lastValid: z.bigint()
})
