/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address } from '@algorandfoundation/algokit-common'
import * as fs from 'fs'
import * as path from 'path'
import { OnApplicationComplete, Transaction, TransactionParams, TransactionType } from '../src'

const dataDir = path.join(__dirname, 'polytest_resources/data-factory/data')

export type SignerInfo = {
  singleSigner?: { SK: string; SignatureVerifier: string }
  msigSigners?: Array<{ SK: string; SignatureVerifier: string }>
  lsig?: string
}

type RawTestData = {
  id: string
  signer: SignerInfo
  stxn: { txn: Record<string, unknown> }
  txnBlob: string
  stxnBlob: string
}

// Helper to read individual test data file
const readTestDataFile = (filename: string): RawTestData => {
  const filePath = path.join(dataDir, `${filename}.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RawTestData
}

// Helper to decode base64 to Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

// Transaction type mapping
const txnTypeMap: Record<string, TransactionType> = {
  pay: TransactionType.Payment,
  axfer: TransactionType.AssetTransfer,
  acfg: TransactionType.AssetConfig,
  afrz: TransactionType.AssetFreeze,
  appl: TransactionType.AppCall,
  keyreg: TransactionType.KeyRegistration,
  stpf: TransactionType.StateProof,
  hb: TransactionType.Heartbeat,
}

// OnApplicationComplete mapping
const onCompleteMap: Record<number, OnApplicationComplete> = {
  0: OnApplicationComplete.NoOp,
  1: OnApplicationComplete.OptIn,
  2: OnApplicationComplete.CloseOut,
  3: OnApplicationComplete.ClearState,
  4: OnApplicationComplete.UpdateApplication,
  5: OnApplicationComplete.DeleteApplication,
}

// Transform msgpack transaction format to TransactionParams
const transformTransaction = (txn: any): TransactionParams => {
  const params: any = {}

  // Common fields
  if (txn.snd) params.sender = Address.fromString(txn.snd)
  if (txn.fee !== undefined) params.fee = BigInt(txn.fee)
  if (txn.fv !== undefined) params.firstValid = BigInt(txn.fv)
  if (txn.lv !== undefined) params.lastValid = BigInt(txn.lv)
  if (txn.gh) params.genesisHash = base64ToUint8Array(txn.gh)
  if (txn.gen) params.genesisId = txn.gen
  if (txn.note) params.note = base64ToUint8Array(txn.note)
  if (txn.rekey) params.rekeyTo = Address.fromString(txn.rekey)
  if (txn.lx) params.lease = base64ToUint8Array(txn.lx)
  if (txn.grp) params.group = base64ToUint8Array(txn.grp)
  if (txn.type) params.type = txnTypeMap[txn.type]

  // Payment
  // Note: For payment transactions, receiver and amount default to zero address and 0n
  // when not provided, which matches how the decoder handles them
  if (txn.type === 'pay') {
    params.payment = {
      receiver: txn.rcv ? Address.fromString(txn.rcv) : Address.zeroAddress(),
      amount: txn.amt !== undefined ? BigInt(txn.amt) : 0n,
    }
    if (txn.close) params.payment.closeRemainderTo = Address.fromString(txn.close)
  }

  // Asset transfer
  // Note: assetId, amount, receiver default to 0n, 0n, zeroAddress when not provided
  if (txn.type === 'axfer') {
    params.assetTransfer = {
      assetId: txn.xaid !== undefined ? BigInt(txn.xaid) : 0n,
      amount: txn.aamt !== undefined ? BigInt(txn.aamt) : 0n,
      receiver: txn.arcv ? Address.fromString(txn.arcv) : Address.zeroAddress(),
    }
    if (txn.asnd) params.assetTransfer.assetSender = Address.fromString(txn.asnd)
    if (txn.aclose) params.assetTransfer.closeRemainderTo = Address.fromString(txn.aclose)
  }

  // Asset config
  // Note: assetId defaults to 0n for asset creation (when caid is not present)
  if (txn.type === 'acfg') {
    params.assetConfig = {
      assetId: txn.caid !== undefined ? BigInt(txn.caid) : 0n,
    }
    if (txn.apar) {
      if (txn.apar.t !== undefined) params.assetConfig.total = BigInt(txn.apar.t)
      if (txn.apar.dc !== undefined) params.assetConfig.decimals = txn.apar.dc
      if (txn.apar.df !== undefined) params.assetConfig.defaultFrozen = txn.apar.df
      if (txn.apar.un) params.assetConfig.unitName = txn.apar.un
      if (txn.apar.an) params.assetConfig.assetName = txn.apar.an
      if (txn.apar.au) params.assetConfig.url = txn.apar.au
      if (txn.apar.am) params.assetConfig.metadataHash = base64ToUint8Array(txn.apar.am)
      if (txn.apar.m) params.assetConfig.manager = Address.fromString(txn.apar.m)
      if (txn.apar.r) params.assetConfig.reserve = Address.fromString(txn.apar.r)
      if (txn.apar.f) params.assetConfig.freeze = Address.fromString(txn.apar.f)
      if (txn.apar.c) params.assetConfig.clawback = Address.fromString(txn.apar.c)
    }
  }

  // Asset freeze
  if (txn.type === 'afrz') {
    params.assetFreeze = {}
    if (txn.faid !== undefined) params.assetFreeze.assetId = BigInt(txn.faid)
    if (txn.fadd) params.assetFreeze.freezeTarget = Address.fromString(txn.fadd)
    params.assetFreeze.frozen = txn.afrz === true
  }

  // App call
  // Note: appId defaults to 0n for app creation (when apid is not present)
  if (txn.type === 'appl') {
    params.appCall = {
      appId: txn.apid !== undefined ? BigInt(txn.apid) : 0n,
      onComplete: onCompleteMap[txn.apan ?? 0] ?? OnApplicationComplete.NoOp,
    }
    if (txn.apap) params.appCall.approvalProgram = base64ToUint8Array(txn.apap)
    if (txn.apsu) params.appCall.clearStateProgram = base64ToUint8Array(txn.apsu)
    if (txn.apep !== undefined) params.appCall.extraProgramPages = txn.apep
    if (txn.apgs) {
      params.appCall.globalStateSchema = {
        numByteSlices: txn.apgs.nbs ?? 0,
        numUints: txn.apgs.nui ?? 0,
      }
    }
    if (txn.apls) {
      params.appCall.localStateSchema = {
        numByteSlices: txn.apls.nbs ?? 0,
        numUints: txn.apls.nui ?? 0,
      }
    }
    if (txn.apaa) params.appCall.args = txn.apaa.map((arg: string) => base64ToUint8Array(arg))
    if (txn.apat) params.appCall.accountReferences = txn.apat.map((addr: string) => Address.fromString(addr))
    if (txn.apfa) params.appCall.appReferences = txn.apfa.map((id: number) => BigInt(id))
    if (txn.apas) params.appCall.assetReferences = txn.apas.map((id: number) => BigInt(id))
    if (txn.apbx) {
      params.appCall.boxReferences = txn.apbx.map((box: any) => ({
        appId: BigInt(box.i ?? 0),
        name: box.n ? base64ToUint8Array(box.n) : new Uint8Array(),
      }))
    }
  }

  // Key registration
  // Only set keyRegistration if there are actual keyreg fields
  // An offline keyreg has no fields and should have keyRegistration: undefined
  if (txn.type === 'keyreg') {
    const hasKeyRegFields =
      txn.votekey ||
      txn.selkey ||
      txn.sprfkey ||
      txn.votefst !== undefined ||
      txn.votelst !== undefined ||
      txn.votekd !== undefined ||
      txn.nonpart !== undefined

    if (hasKeyRegFields) {
      params.keyRegistration = {}
      if (txn.votekey) params.keyRegistration.voteKey = base64ToUint8Array(txn.votekey)
      if (txn.selkey) params.keyRegistration.selectionKey = base64ToUint8Array(txn.selkey)
      if (txn.sprfkey) params.keyRegistration.stateProofKey = base64ToUint8Array(txn.sprfkey)
      if (txn.votefst !== undefined) params.keyRegistration.voteFirst = BigInt(txn.votefst)
      if (txn.votelst !== undefined) params.keyRegistration.voteLast = BigInt(txn.votelst)
      if (txn.votekd !== undefined) params.keyRegistration.voteKeyDilution = BigInt(txn.votekd)
      if (txn.nonpart !== undefined) params.keyRegistration.nonParticipation = txn.nonpart
    }
  }

  // Heartbeat
  // Note: All fields are required for heartbeat transactions
  if (txn.type === 'hb' && txn.hb) {
    params.heartbeat = {
      address: Address.fromString(txn.hb.a),
      voteId: base64ToUint8Array(txn.hb.vid),
      keyDilution: BigInt(txn.hb.kd),
      seed: base64ToUint8Array(txn.hb.sd),
      proof: {
        // JSON fields: p=pk, p1s=pk1Sig, p2=pk2, p2s=pk2Sig, s=sig
        pk: base64ToUint8Array(txn.hb.prf.p),
        pk1Sig: base64ToUint8Array(txn.hb.prf.p1s),
        pk2: base64ToUint8Array(txn.hb.prf.p2),
        pk2Sig: base64ToUint8Array(txn.hb.prf.p2s),
        sig: base64ToUint8Array(txn.hb.prf.s),
      },
    }
  }

  // State proof
  if (txn.type === 'stpf') {
    params.stateProof = {
      stateProofType: txn.sptype ?? 0,
      stateProof: txn.sp ? transformStateProof(txn.sp) : undefined,
      message: txn.spmsg ? transformStateProofMessage(txn.spmsg) : undefined,
    }
  }

  return params as TransactionParams
}

const transformStateProof = (sp: any): any => {
  if (!sp) return undefined
  const result: any = {}
  if (sp.P) result.partProofs = transformMerkleArrayProof(sp.P)
  if (sp.S) result.sigProofs = transformMerkleArrayProof(sp.S)
  if (sp.c) result.sigCommit = base64ToUint8Array(sp.c)
  if (sp.pr) result.positionsToReveal = sp.pr.map((p: number) => BigInt(p))
  if (sp.r) result.reveals = transformReveals(sp.r)
  if (sp.w !== undefined) result.signedWeight = BigInt(sp.w)
  result.merkleSignatureSaltVersion = sp.v ?? 0
  return result
}

const transformMerkleArrayProof = (proof: any): any => {
  if (!proof) return undefined
  const result: any = {}
  if (proof.hsh) result.hashFactory = { hashType: proof.hsh.t }
  if (proof.pth) result.path = proof.pth.map((p: string) => base64ToUint8Array(p))
  if (proof.td !== undefined) result.treeDepth = proof.td
  return result
}

const transformReveals = (reveals: any): Map<bigint, any> => {
  const revealsMap = new Map<bigint, any>()
  if (!reveals) return revealsMap
  for (const [position, reveal] of Object.entries(reveals)) {
    revealsMap.set(BigInt(position), transformReveal(reveal as any))
  }
  return revealsMap
}

const transformReveal = (reveal: any): any => {
  const result: any = {}
  if (reveal.p) {
    result.participant = {
      verifier: reveal.p.p
        ? {
            commitment: reveal.p.p.cmt ? base64ToUint8Array(reveal.p.p.cmt) : undefined,
            keyLifetime: reveal.p.p.lf !== undefined ? BigInt(reveal.p.p.lf) : undefined,
          }
        : undefined,
      weight: reveal.p.w !== undefined ? BigInt(reveal.p.w) : undefined,
    }
  }
  if (reveal.s) {
    result.sigslot = {
      lowerSigWeight: reveal.s.l !== undefined ? BigInt(reveal.s.l) : 0n,
      sig: reveal.s.s
        ? {
            vectorCommitmentIndex: reveal.s.s.idx !== undefined ? BigInt(reveal.s.s.idx) : undefined,
            proof: reveal.s.s.prf ? transformMerkleArrayProof(reveal.s.s.prf) : undefined,
            signature: reveal.s.s.sig ? base64ToUint8Array(reveal.s.s.sig) : undefined,
            verifyingKey: reveal.s.s.vkey?.k ? { publicKey: base64ToUint8Array(reveal.s.s.vkey.k) } : undefined,
          }
        : undefined,
    }
  }
  return result
}

const transformStateProofMessage = (msg: any): any => {
  if (!msg) return undefined
  return {
    blockHeadersCommitment: msg.b ? base64ToUint8Array(msg.b) : undefined,
    votersCommitment: msg.v ? base64ToUint8Array(msg.v) : undefined,
    lnProvenWeight: msg.P !== undefined ? BigInt(msg.P) : undefined,
    firstAttestedRound: msg.f !== undefined ? BigInt(msg.f) : undefined,
    lastAttestedRound: msg.l !== undefined ? BigInt(msg.l) : undefined,
  }
}

export type TransactionTestData = {
  id: string
  transaction: Transaction
  unsignedBytes: Uint8Array
  signedBytes: Uint8Array
  signer: SignerInfo
}

type TestDataKeys =
  | 'simplePayment'
  | 'optInAssetTransfer'
  | 'simpleAssetTransfer'
  | 'assetCreate'
  | 'assetDestroy'
  | 'assetConfig'
  | 'appCall'
  | 'appCreate'
  | 'appUpdate'
  | 'appDelete'
  | 'onlineKeyRegistration'
  | 'offlineKeyRegistration'
  | 'nonParticipationKeyRegistration'
  | 'assetFreeze'
  | 'assetUnfreeze'
  | 'heartbeat'
  | 'stateProof'
  | 'lsigPayment'
  | 'msigPayment'
  | 'msigDelegatedPayment'
  | 'singleDelegatedPayment'

const testDataKeys: TestDataKeys[] = [
  'simplePayment',
  'optInAssetTransfer',
  'simpleAssetTransfer',
  'assetCreate',
  'assetDestroy',
  'assetConfig',
  'appCall',
  'appCreate',
  'appUpdate',
  'appDelete',
  'onlineKeyRegistration',
  'offlineKeyRegistration',
  'nonParticipationKeyRegistration',
  'assetFreeze',
  'assetUnfreeze',
  'heartbeat',
  'stateProof',
  'lsigPayment',
  'msigPayment',
  'msigDelegatedPayment',
  'singleDelegatedPayment',
]

export const testData: Record<TestDataKeys, TransactionTestData> = Object.fromEntries(
  testDataKeys.map((key) => {
    const value = readTestDataFile(key)
    return [
      key,
      {
        id: value.id,
        transaction: new Transaction(transformTransaction(value.stxn.txn)),
        unsignedBytes: base64ToUint8Array(value.txnBlob),
        signedBytes: base64ToUint8Array(value.stxnBlob),
        signer: value.signer,
      },
    ]
  }),
) as Record<TestDataKeys, TransactionTestData>
