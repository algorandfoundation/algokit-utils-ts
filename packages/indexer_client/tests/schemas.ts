/**
 * Auto-generated Zod schemas from OpenAPI specification.
 * Do not edit manually.
 *
 * Generated: 2025-12-19T11:38:22.460Z
 */

import { z } from 'zod'
import { Address } from '@algorandfoundation/algokit-common'

// Forward declarations for recursive schemas
export type TransactionType = z.infer<typeof Transaction>

export const Hashtype = z.enum(['sha512_256', 'sha256'])

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
  deleted: z.boolean().optional(),
  optedInAtRound: z.bigint().optional(),
  closedOutAtRound: z.bigint().optional(),
  schema: ApplicationStateSchema,
  keyValue: TealKeyValueStore.optional()
})

export const AssetHolding = z.object({
  amount: z.bigint(),
  assetId: z.bigint(),
  isFrozen: z.boolean(),
  deleted: z.boolean().optional(),
  optedInAtRound: z.bigint().optional(),
  optedOutAtRound: z.bigint().optional()
})

export const ApplicationParams = z.object({
  creator: z.instanceof(Address).optional(),
  approvalProgram: z.instanceof(Uint8Array).optional(),
  clearStateProgram: z.instanceof(Uint8Array).optional(),
  extraProgramPages: z.number().int().gte(0).lte(3).optional(),
  localStateSchema: ApplicationStateSchema.optional(),
  globalStateSchema: ApplicationStateSchema.optional(),
  globalState: TealKeyValueStore.optional(),
  version: z.number().int().optional()
})

export const Application = z.object({
  id: z.bigint(),
  deleted: z.boolean().optional(),
  createdAtRound: z.bigint().optional(),
  deletedAtRound: z.bigint().optional(),
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
  deleted: z.boolean().optional(),
  createdAtRound: z.bigint().optional(),
  destroyedAtRound: z.bigint().optional(),
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
  address: z.string(),
  amount: z.bigint(),
  minBalance: z.bigint(),
  amountWithoutPendingRewards: z.bigint(),
  appsLocalState: z.array(ApplicationLocalState).optional(),
  appsTotalSchema: ApplicationStateSchema.optional(),
  appsTotalExtraPages: z.number().int().optional(),
  assets: z.array(AssetHolding).optional(),
  createdApps: z.array(Application).optional(),
  createdAssets: z.array(Asset).optional(),
  participation: AccountParticipation.optional(),
  incentiveEligible: z.boolean().optional(),
  pendingRewards: z.bigint(),
  rewardBase: z.bigint().optional(),
  rewards: z.bigint(),
  round: z.bigint(),
  status: z.string(),
  sigType: z.enum(['sig', 'msig', 'lsig']).optional(),
  totalAppsOptedIn: z.number().int(),
  totalAssetsOptedIn: z.number().int(),
  totalBoxBytes: z.number().int(),
  totalBoxes: z.number().int(),
  totalCreatedApps: z.number().int(),
  totalCreatedAssets: z.number().int(),
  authAddr: z.instanceof(Address).optional(),
  lastProposed: z.bigint().optional(),
  lastHeartbeat: z.bigint().optional(),
  deleted: z.boolean().optional(),
  createdAtRound: z.bigint().optional(),
  closedAtRound: z.bigint().optional()
})

export const ApplicationLogData = z.object({
  txId: z.string(),
  logs: z.array(z.instanceof(Uint8Array))
})

export const BlockRewards = z.object({
  feeSink: z.string(),
  rewardsCalculationRound: z.bigint(),
  rewardsLevel: z.bigint(),
  rewardsPool: z.string(),
  rewardsRate: z.bigint(),
  rewardsResidue: z.bigint()
})

export const StateProofTracking = z.object({
  type: z.bigint().optional(),
  votersCommitment: z.instanceof(Uint8Array).optional(),
  onlineTotalWeight: z.bigint().optional(),
  nextRound: z.number().int().optional()
})

export const OnCompletion = z.enum(['noop', 'optin', 'closeout', 'clear', 'update', 'delete'])

export const BoxReference = z.object({
  app: z.bigint(),
  name: z.instanceof(Uint8Array)
})

export const HoldingRef = z.object({
  address: z.instanceof(Address),
  asset: z.bigint()
})

export const LocalsRef = z.object({
  address: z.instanceof(Address),
  app: z.bigint()
})

export const ResourceRef = z.object({
  address: z.instanceof(Address).optional(),
  applicationId: z.bigint().optional(),
  assetId: z.bigint().optional(),
  box: BoxReference.optional(),
  holding: HoldingRef.optional(),
  local: LocalsRef.optional()
})

export const StateSchema = z.object({
  numUints: z.number().int().gte(0).lte(64),
  numByteSlices: z.number().int().gte(0).lte(64)
})

export const TransactionApplication = z.object({
  applicationId: z.bigint(),
  onCompletion: OnCompletion,
  applicationArgs: z.array(z.instanceof(Uint8Array)).optional(),
  access: z.array(ResourceRef).optional(),
  accounts: z.array(z.instanceof(Address)).optional(),
  boxReferences: z.array(BoxReference).optional(),
  foreignApps: z.array(z.bigint()).optional(),
  foreignAssets: z.array(z.bigint()).optional(),
  localStateSchema: StateSchema.optional(),
  globalStateSchema: StateSchema.optional(),
  approvalProgram: z.instanceof(Uint8Array).optional(),
  clearStateProgram: z.instanceof(Uint8Array).optional(),
  extraProgramPages: z.number().int().gte(0).lte(3).optional(),
  rejectVersion: z.number().int().optional()
})

export const TransactionAssetConfig = z.object({
  assetId: z.bigint().optional(),
  params: AssetParams.optional()
})

export const TransactionAssetFreeze = z.object({
  address: z.string(),
  assetId: z.bigint(),
  newFreezeStatus: z.boolean()
})

export const TransactionAssetTransfer = z.object({
  amount: z.bigint(),
  assetId: z.bigint(),
  closeAmount: z.bigint().optional(),
  closeTo: z.string().optional(),
  receiver: z.string(),
  sender: z.string().optional()
})

export const HashFactory = z.object({
  hashType: z.number().int().optional()
})

export const MerkleArrayProof = z.object({
  path: z.array(z.instanceof(Uint8Array)).optional(),
  hashFactory: HashFactory.optional(),
  treeDepth: z.number().int().optional()
})

export const StateProofSignature = z.object({
  falconSignature: z.instanceof(Uint8Array).optional(),
  merkleArrayIndex: z.number().int().optional(),
  proof: MerkleArrayProof.optional(),
  verifyingKey: z.instanceof(Uint8Array).optional()
})

export const StateProofSigSlot = z.object({
  signature: StateProofSignature.optional(),
  lowerSigWeight: z.bigint().optional()
})

export const StateProofVerifier = z.object({
  commitment: z.instanceof(Uint8Array).optional(),
  keyLifetime: z.bigint().optional()
})

export const StateProofParticipant = z.object({
  verifier: StateProofVerifier.optional(),
  weight: z.bigint().optional()
})

export const StateProofReveal = z.object({
  position: z.bigint().optional(),
  sigSlot: StateProofSigSlot.optional(),
  participant: StateProofParticipant.optional()
})

export const StateProofFields = z.object({
  sigCommit: z.instanceof(Uint8Array).optional(),
  signedWeight: z.bigint().optional(),
  sigProofs: MerkleArrayProof.optional(),
  partProofs: MerkleArrayProof.optional(),
  saltVersion: z.number().int().optional(),
  reveals: z.array(StateProofReveal).optional(),
  positionsToReveal: z.array(z.bigint()).optional()
})

export const IndexerStateProofMessage = z.object({
  blockHeadersCommitment: z.instanceof(Uint8Array).optional(),
  votersCommitment: z.instanceof(Uint8Array).optional(),
  lnProvenWeight: z.bigint().optional(),
  firstAttestedRound: z.bigint().optional(),
  latestAttestedRound: z.bigint().optional()
})

export const TransactionStateProof = z.object({
  stateProofType: z.bigint().optional(),
  stateProof: StateProofFields.optional(),
  message: IndexerStateProofMessage.optional()
})

export const HbProofFields = z.object({
  hbSig: z.instanceof(Uint8Array).optional(),
  hbPk: z.instanceof(Uint8Array).optional(),
  hbPk2: z.instanceof(Uint8Array).optional(),
  hbPk1sig: z.instanceof(Uint8Array).optional(),
  hbPk2sig: z.instanceof(Uint8Array).optional()
})

export const TransactionHeartbeat = z.object({
  hbAddress: z.string(),
  hbProof: HbProofFields,
  hbSeed: z.instanceof(Uint8Array),
  hbVoteId: z.instanceof(Uint8Array),
  hbKeyDilution: z.bigint()
})

export const TransactionKeyreg = z.object({
  nonParticipation: z.boolean().optional(),
  selectionParticipationKey: z.instanceof(Uint8Array).optional(),
  voteFirstValid: z.bigint().optional(),
  voteKeyDilution: z.bigint().optional(),
  voteLastValid: z.bigint().optional(),
  voteParticipationKey: z.instanceof(Uint8Array).optional(),
  stateProofKey: z.instanceof(Uint8Array).optional()
})

export const TransactionPayment = z.object({
  amount: z.bigint(),
  closeAmount: z.bigint().optional(),
  closeRemainderTo: z.string().optional(),
  receiver: z.string()
})

export const TransactionSignatureMultisigSubsignature = z.object({
  publicKey: z.instanceof(Uint8Array).optional(),
  signature: z.instanceof(Uint8Array).optional()
})

export const TransactionSignatureMultisig = z.object({
  subsignature: z.array(TransactionSignatureMultisigSubsignature).optional(),
  threshold: z.number().int().optional(),
  version: z.number().int().optional()
})

export const TransactionSignatureLogicsig = z.object({
  args: z.array(z.instanceof(Uint8Array)).optional(),
  logic: z.instanceof(Uint8Array),
  multisigSignature: TransactionSignatureMultisig.optional(),
  logicMultisigSignature: TransactionSignatureMultisig.optional(),
  signature: z.instanceof(Uint8Array).optional()
})

export const TransactionSignature = z.object({
  logicsig: TransactionSignatureLogicsig.optional(),
  multisig: TransactionSignatureMultisig.optional(),
  sig: z.instanceof(Uint8Array).optional()
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
  address: z.string(),
  delta: StateDelta
})

export const Transaction: z.ZodType<any> = z.lazy(() => z.object({
  applicationTransaction: TransactionApplication.optional(),
  assetConfigTransaction: TransactionAssetConfig.optional(),
  assetFreezeTransaction: TransactionAssetFreeze.optional(),
  assetTransferTransaction: TransactionAssetTransfer.optional(),
  stateProofTransaction: TransactionStateProof.optional(),
  heartbeatTransaction: TransactionHeartbeat.optional(),
  authAddr: z.instanceof(Address).optional(),
  closeRewards: z.bigint().optional(),
  closingAmount: z.bigint().optional(),
  confirmedRound: z.bigint().optional(),
  createdAppId: z.bigint().optional(),
  createdAssetId: z.bigint().optional(),
  fee: z.bigint(),
  firstValid: z.bigint(),
  genesisHash: z.instanceof(Uint8Array).optional(),
  genesisId: z.string().optional(),
  group: z.instanceof(Uint8Array).optional(),
  id: z.string().optional(),
  intraRoundOffset: z.number().int().optional(),
  keyregTransaction: TransactionKeyreg.optional(),
  lastValid: z.bigint(),
  lease: z.instanceof(Uint8Array).optional(),
  note: z.instanceof(Uint8Array).optional(),
  paymentTransaction: TransactionPayment.optional(),
  receiverRewards: z.bigint().optional(),
  rekeyTo: z.instanceof(Address).optional(),
  roundTime: z.number().int().optional(),
  sender: z.string(),
  senderRewards: z.bigint().optional(),
  signature: TransactionSignature.optional(),
  txType: z.enum(['pay', 'keyreg', 'acfg', 'axfer', 'afrz', 'appl', 'stpf', 'hb']),
  localStateDelta: z.array(AccountStateDelta).optional(),
  globalStateDelta: StateDelta.optional(),
  logs: z.array(z.instanceof(Uint8Array)).optional(),
  innerTxns: z.array(Transaction).optional()
}))

export const BlockUpgradeState = z.object({
  currentProtocol: z.string(),
  nextProtocol: z.string().optional(),
  nextProtocolApprovals: z.number().int().optional(),
  nextProtocolSwitchOn: z.bigint().optional(),
  nextProtocolVoteBefore: z.bigint().optional()
})

export const BlockUpgradeVote = z.object({
  upgradeApprove: z.boolean().optional(),
  upgradeDelay: z.bigint().optional(),
  upgradePropose: z.string().optional()
})

export const ParticipationUpdates = z.object({
  expiredParticipationAccounts: z.array(z.string()),
  absentParticipationAccounts: z.array(z.string())
})

export const Block = z.object({
  proposer: z.instanceof(Address).optional(),
  feesCollected: z.number().int().optional(),
  bonus: z.number().int().optional(),
  proposerPayout: z.number().int().optional(),
  genesisHash: z.instanceof(Uint8Array),
  genesisId: z.string(),
  previousBlockHash: z.instanceof(Uint8Array),
  previousBlockHash512: z.instanceof(Uint8Array).optional(),
  rewards: BlockRewards,
  round: z.bigint(),
  seed: z.instanceof(Uint8Array),
  stateProofTracking: z.array(StateProofTracking).optional(),
  timestamp: z.number().int(),
  transactions: z.array(Transaction),
  transactionsRoot: z.instanceof(Uint8Array),
  transactionsRootSha256: z.instanceof(Uint8Array).optional(),
  transactionsRootSha512: z.instanceof(Uint8Array).optional(),
  txnCounter: z.number().int().optional(),
  upgradeState: BlockUpgradeState,
  upgradeVote: BlockUpgradeVote.optional(),
  participationUpdates: ParticipationUpdates
})

export const Box = z.object({
  round: z.bigint(),
  name: z.instanceof(Uint8Array),
  value: z.instanceof(Uint8Array)
})

export const BoxDescriptor = z.object({
  name: z.instanceof(Uint8Array)
})

export const HealthCheck = z.object({
  version: z.string(),
  data: z.record(z.string(), z.any()).optional(),
  round: z.bigint(),
  isMigrating: z.boolean(),
  dbAvailable: z.boolean(),
  message: z.string(),
  errors: z.array(z.string()).optional()
})

export const MiniAssetHolding = z.object({
  address: z.string(),
  amount: z.bigint(),
  isFrozen: z.boolean(),
  deleted: z.boolean().optional(),
  optedInAtRound: z.bigint().optional(),
  optedOutAtRound: z.bigint().optional()
})

export const AccountResponse = z.object({
  account: Account,
  currentRound: z.bigint()
})

export const AssetHoldingsResponse = z.object({
  currentRound: z.bigint(),
  nextToken: z.string().optional(),
  assets: z.array(AssetHolding)
})

export const AccountsResponse = z.object({
  accounts: z.array(Account),
  currentRound: z.bigint(),
  nextToken: z.string().optional()
})

export const AssetBalancesResponse = z.object({
  balances: z.array(MiniAssetHolding),
  currentRound: z.bigint(),
  nextToken: z.string().optional()
})

export const ApplicationResponse = z.object({
  application: Application.optional(),
  currentRound: z.bigint()
})

export const ApplicationsResponse = z.object({
  applications: z.array(Application),
  currentRound: z.bigint(),
  nextToken: z.string().optional()
})

export const ApplicationLogsResponse = z.object({
  applicationId: z.bigint(),
  currentRound: z.bigint(),
  nextToken: z.string().optional(),
  logData: z.array(ApplicationLogData).optional()
})

export const ApplicationLocalStatesResponse = z.object({
  appsLocalStates: z.array(ApplicationLocalState),
  currentRound: z.bigint(),
  nextToken: z.string().optional()
})

export const AssetResponse = z.object({
  asset: Asset,
  currentRound: z.bigint()
})

export const BoxesResponse = z.object({
  applicationId: z.bigint(),
  boxes: z.array(BoxDescriptor),
  nextToken: z.string().optional()
})

export const ErrorResponse = z.object({
  data: z.record(z.string(), z.any()).optional(),
  message: z.string()
})

export const AssetsResponse = z.object({
  assets: z.array(Asset),
  currentRound: z.bigint(),
  nextToken: z.string().optional()
})

export const BlockHeadersResponse = z.object({
  currentRound: z.bigint(),
  nextToken: z.string().optional(),
  blocks: z.array(Block)
})

export const TransactionResponse = z.object({
  transaction: Transaction,
  currentRound: z.bigint()
})

export const TransactionsResponse = z.object({
  currentRound: z.bigint(),
  nextToken: z.string().optional(),
  transactions: z.array(Transaction)
})
