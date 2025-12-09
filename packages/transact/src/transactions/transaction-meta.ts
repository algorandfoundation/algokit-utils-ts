import type { EncodingFormat, ObjectModelMetadata, WireBigInt, WireObject, WireString } from '@algorandfoundation/algokit-common'
import {
  Address,
  Codec,
  MapCodec,
  ObjectModelCodec,
  addressArrayCodec,
  addressCodec,
  bigIntArrayCodec,
  bigIntCodec,
  booleanCodec,
  bytesArrayCodec,
  bytesCodec,
  fixedBytes1793Codec,
  fixedBytes32Codec,
  fixedBytes64Codec,
  normalizeWireObject,
  normalizeWireString,
  numberCodec,
  stringCodec,
} from '@algorandfoundation/algokit-common'
import { AccessReference, AppCallTransactionFields, BoxReference, StateSchema } from './app-call'
import { AssetConfigTransactionFields } from './asset-config'
import { AssetFreezeTransactionFields } from './asset-freeze'
import { AssetTransferTransactionFields } from './asset-transfer'
import { HeartbeatProof, HeartbeatTransactionFields } from './heartbeat'
import { KeyRegistrationTransactionFields } from './key-registration'
import { PaymentTransactionFields } from './payment'
import {
  FalconSignatureStruct,
  FalconVerifier,
  HashFactory,
  MerkleArrayProof,
  MerkleSignatureVerifier,
  Participant,
  Reveal,
  SigslotCommit,
  StateProof,
  StateProofMessage,
  StateProofTransactionFields,
} from './state-proof'
import type { TransactionParams } from './transaction'
import { TransactionType } from './transaction-type'

type WireBoxReference = {
  /** App index (0 or index into access list) */
  i?: number
  /** Box name */
  n?: WireString
}

type WireAccessReference = {
  /** Account address */
  d?: WireString

  /** App index */
  p?: WireBigInt

  /** Asset index */
  s?: WireBigInt

  /** Box reference */
  b?: WireBoxReference

  /** Holding reference (1-based indices into access list) */
  h?: {
    /** Address index */
    d?: number
    /** Asset index (1-based index into access list) */
    s?: number
  }

  /** Local state reference (1-based indices into access list) */
  l?: {
    /** Address index */
    d?: number
    /** App index (0 means current app, or 1-based index into access list) */
    p?: number
  }
}

class TransactionTypeCodec extends Codec<TransactionType, string, WireString> {
  public defaultValue(): TransactionType {
    // This ensure that we never omit the transaction type, as a transaction should never be created with this value
    return TransactionType.Unknown
  }

  protected toEncoded(value: TransactionType, _format: EncodingFormat): string {
    switch (value) {
      case TransactionType.Payment:
        return 'pay'
      case TransactionType.AssetTransfer:
        return 'axfer'
      case TransactionType.AssetFreeze:
        return 'afrz'
      case TransactionType.AssetConfig:
        return 'acfg'
      case TransactionType.KeyRegistration:
        return 'keyreg'
      case TransactionType.AppCall:
        return 'appl'
      case TransactionType.StateProof:
        return 'stpf'
      case TransactionType.Heartbeat:
        return 'hb'
      default:
        return 'unknown'
    }
  }

  protected fromEncoded(value: WireString, _format: EncodingFormat): TransactionType {
    // Convert Uint8Array to string if needed (msgpack may return transaction type as bytes)
    const typeString = normalizeWireString(value)

    switch (typeString) {
      case 'pay':
        return TransactionType.Payment
      case 'axfer':
        return TransactionType.AssetTransfer
      case 'afrz':
        return TransactionType.AssetFreeze
      case 'acfg':
        return TransactionType.AssetConfig
      case 'keyreg':
        return TransactionType.KeyRegistration
      case 'appl':
        return TransactionType.AppCall
      case 'stpf':
        return TransactionType.StateProof
      case 'hb':
        return TransactionType.Heartbeat
      default:
        return TransactionType.Unknown
    }
  }
}

class TransactionDataCodec<
  T extends
    | PaymentTransactionFields
    | AssetTransferTransactionFields
    | AssetFreezeTransactionFields
    | KeyRegistrationTransactionFields
    | StateProofTransactionFields,
> extends Codec<T | undefined, Record<string, unknown>> {
  private transactionDataCodec: ObjectModelCodec<T>

  constructor(
    private readonly transactionType: TransactionType,
    transactionTypeDataMetadata: ObjectModelMetadata<T>,
  ) {
    super()
    this.transactionDataCodec = new ObjectModelCodec<T>(transactionTypeDataMetadata)
  }

  public defaultValue(): T | undefined {
    return undefined
  }

  protected toEncoded(value: T | undefined, format: EncodingFormat): Record<string, unknown> {
    if (!value) {
      throw new Error('Transaction data is missing')
    }
    return this.transactionDataCodec.encode(value, format)
  }

  protected fromEncoded(value: Record<string, unknown>, format: EncodingFormat): T | undefined {
    if (value.type === undefined) {
      throw new Error('Transaction is missing type field')
    }
    const type = normalizeWireString(value.type as WireString)
    if (type === this.transactionType.toString()) {
      return this.transactionDataCodec.decode(value, format)
    }

    return undefined
  }
}

class AssetConfigDataCodec extends Codec<AssetConfigTransactionFields | undefined, Record<string, unknown>> {
  private assetParamsCodec = new ObjectModelCodec<Omit<AssetConfigTransactionFields, 'assetId'>>(AssetParamsMeta)

  public defaultValue(): AssetConfigTransactionFields | undefined {
    return undefined
  }

  protected toEncoded(value: AssetConfigTransactionFields | undefined, format: EncodingFormat): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    if (!value) {
      throw new Error('Transaction is not an asset config')
    }

    const { assetId, ...assetParams } = value

    const encodedAssetId = bigIntCodec.encodeOptional(assetId, format)
    if (encodedAssetId !== undefined) {
      result.caid = encodedAssetId
    }

    const encodedParams = this.assetParamsCodec.encodeOptional(assetParams, format)
    if (encodedParams && Object.keys(encodedParams).length > 0) {
      result.apar = encodedParams
    }

    return result
  }

  protected fromEncoded(value: Record<string, unknown>, format: EncodingFormat): AssetConfigTransactionFields | undefined {
    if (value.type === undefined) {
      throw new Error('Transaction is missing type field')
    }
    const type = normalizeWireString(value.type as WireString)
    const caid = value.caid as WireBigInt | undefined
    const apar = value.apar as WireObject | undefined

    if (type !== TransactionType.AssetConfig || (caid === undefined && !apar)) {
      return undefined
    }

    return {
      assetId: bigIntCodec.decode(caid, format),
      ...this.assetParamsCodec.decode(apar, format),
    } satisfies AssetConfigTransactionFields
  }

  public isDefaultValue(value: AssetConfigTransactionFields | undefined): boolean {
    return value === undefined
  }
}

class AppCallDataCodec extends Codec<AppCallTransactionFields | undefined, Record<string, unknown>> {
  private appCallFieldsCodec = new ObjectModelCodec<Omit<AppCallTransactionFields, 'accessReferences' | 'boxReferences'>>(
    AppCallTransactionFieldsMeta,
  )

  public defaultValue(): AppCallTransactionFields | undefined {
    return undefined
  }

  private encodeAccessReferences(
    appId: bigint,
    accessReferences: AccessReference[] | undefined,
    format: EncodingFormat,
  ): WireAccessReference[] | undefined {
    if (!accessReferences || accessReferences.length === 0) return undefined

    const accessList: WireAccessReference[] = []

    // Helper to find or add a simple reference and return its 1-based index
    const ensure = (target: Pick<AccessReference, 'address' | 'assetId' | 'appId'>): number => {
      // Search for existing entry
      for (let idx = 0; idx < accessList.length; idx++) {
        const entry = accessList[idx]
        const matchesAddress =
          (!entry.d && !target.address) || (entry.d && target.address && addressCodec.decode(entry.d, format).equals(target.address))
        const matchesAssetId =
          (entry.s === undefined && target.assetId === undefined) ||
          (entry.s !== undefined && target.assetId !== undefined && bigIntCodec.decode(entry.s, format) === target.assetId)
        const matchesAppId =
          (entry.p === undefined && target.appId === undefined) ||
          (entry.p !== undefined && target.appId !== undefined && bigIntCodec.decode(entry.p, format) === target.appId)

        if (matchesAddress && matchesAssetId && matchesAppId) {
          return idx + 1 // Return 1-based index
        }
      }

      // Add new entries for each field
      if (target.address && !target.address.equals(Address.zeroAddress())) {
        accessList.push({ d: addressCodec.encodeOptional(target.address, format)! })
      }
      if (target.assetId !== undefined) {
        accessList.push({ s: bigIntCodec.encodeOptional(target.assetId, format)! })
      }
      if (target.appId !== undefined) {
        accessList.push({ p: bigIntCodec.encodeOptional(target.appId, format)! })
      }

      return accessList.length // Return 1-based index of last added
    }

    // Process each access reference
    for (const accessRef of accessReferences) {
      // Simple references (address, assetId, or appId)
      if (accessRef.address || accessRef.assetId !== undefined || accessRef.appId !== undefined) {
        ensure(accessRef)
        continue
      }

      // Holding reference
      if (accessRef.holding) {
        const holding = accessRef.holding
        let addressIndex = 0
        if (holding.address && !holding.address.equals(Address.zeroAddress())) {
          addressIndex = ensure({ address: holding.address })
        }
        const assetIndex = ensure({ assetId: holding.assetId })
        accessList.push({
          h: {
            d: numberCodec.encodeOptional(addressIndex, format),
            s: numberCodec.encodeOptional(assetIndex, format),
          },
        })
        continue
      }

      // Locals reference
      if (accessRef.locals) {
        const locals = accessRef.locals
        let addressIndex = 0
        if (locals.address && !locals.address.equals(Address.zeroAddress())) {
          addressIndex = ensure({ address: locals.address })
        }

        let appIndex = 0
        if (locals.appId && locals.appId !== appId) {
          appIndex = ensure({ appId: locals.appId })
        }
        if (addressIndex !== 0 || appIndex !== 0) {
          accessList.push({
            l: {
              d: numberCodec.encodeOptional(addressIndex, format),
              p: numberCodec.encodeOptional(appIndex, format),
            },
          })
        }
        continue
      }

      // Box reference
      if (accessRef.box) {
        const box = accessRef.box
        // Only add appId to access list if it's different from the calling app's ID
        // Use appIndex = 0 when box is for the current app
        let appIndex = 0
        if (box.appId && box.appId !== appId) {
          appIndex = ensure({ appId: box.appId })
        }
        accessList.push({
          b: {
            i: numberCodec.encodeOptional(appIndex, format),
            n: bytesCodec.encodeOptional(box.name, format),
          },
        })
        continue
      }
    }

    return accessList.length > 0 ? accessList : undefined
  }

  private decodeAccessReferences(_wireAccessReferences: WireAccessReference[] | undefined, format: EncodingFormat): AccessReference[] {
    if (!_wireAccessReferences || _wireAccessReferences.length === 0) return []

    const result: AccessReference[] = []

    // Process each entry in the access list

    const wireAccessReferences = _wireAccessReferences.map((ref) => normalizeWireObject(ref))
    for (const ref of wireAccessReferences) {
      const d = ref.d as WireString | undefined
      const s = ref.s as WireBigInt | undefined
      const p = ref.p as WireBigInt | undefined
      const _h = ref.h as WireObject | undefined
      const h = _h ? normalizeWireObject(_h) : undefined
      const _l = ref.l as WireObject | undefined
      const l = _l ? normalizeWireObject(_l) : undefined
      const _b = ref.b as WireObject | undefined
      const b = _b ? normalizeWireObject(_b) : undefined

      // Simple address reference
      if (d) {
        result.push({ address: addressCodec.decode(d, format) })
        continue
      }

      // Simple asset ID reference
      if (s !== undefined) {
        result.push({ assetId: bigIntCodec.decode(s, format) })
        continue
      }

      // Simple app ID reference
      if (p !== undefined) {
        result.push({ appId: bigIntCodec.decode(p, format) })
        continue
      }

      // Holding reference (h)
      if (h) {
        const addrIdx = (h.d ?? 0) as number
        const assetIdx = h.s as number | undefined

        if (assetIdx === undefined) {
          throw new Error('Access list holding reference is missing asset index')
        }

        const holdingAddress =
          addrIdx === 0 ? Address.zeroAddress() : addressCodec.decode(wireAccessReferences[addrIdx - 1].d! as WireString, format)
        const holdingAssetId = wireAccessReferences[assetIdx - 1].s! as WireBigInt

        result.push({
          holding: {
            assetId: bigIntCodec.decode(holdingAssetId, format),
            address: holdingAddress,
          },
        })
        continue
      }

      // Locals reference (l)
      if (l) {
        const addrIdx = (l.d ?? 0) as number
        const appIdx = (l.p ?? 0) as number

        const localsAddress =
          addrIdx === 0 ? Address.zeroAddress() : addressCodec.decode(wireAccessReferences[addrIdx - 1].d! as WireString, format)
        const localsAppId = appIdx === 0 ? 0n : (wireAccessReferences[appIdx - 1].p! as WireBigInt)

        result.push({
          locals: {
            appId: bigIntCodec.decode(localsAppId, format),
            address: localsAddress,
          },
        })
        continue
      }

      // Box reference (b)
      if (b) {
        const boxAppIdx = (b.i ?? 0) as number
        const name = b.n as WireString | undefined

        if (!name) {
          throw new Error('Access list box reference is missing name')
        }

        const boxAppId = boxAppIdx === 0 ? 0n : (wireAccessReferences[boxAppIdx - 1].p! as WireBigInt)

        result.push({
          box: {
            appId: bigIntCodec.decode(boxAppId, format),
            name: bytesCodec.decode(name, format),
          },
        })
        continue
      }
    }

    return result
  }

  private encodeBoxReferences(
    appId: bigint,
    appReferences: bigint[] | undefined,
    boxReferences: BoxReference[] | undefined,
    format: EncodingFormat,
  ): WireBoxReference[] | undefined {
    if (!boxReferences || boxReferences.length === 0) return undefined

    const appRefs = appReferences ?? []

    return boxReferences.map((box) => {
      const isCurrentApp = box.appId === 0n || box.appId === appId
      // Index 0 means current app, index > 0 references foreign apps array (1-indexed)
      const index = isCurrentApp ? 0 : appRefs.indexOf(box.appId) + 1

      if (index === 0 && !isCurrentApp) {
        throw new Error(`Box ref with appId ${box.appId} not in appReferences`)
      }

      return {
        i: numberCodec.encodeOptional(index, format), // This returns undefined when index is 0, which omits the field
        n: bytesCodec.encodeOptional(box.name, format),
      }
    })
  }

  private decodeBoxReferences(
    appReferences: bigint[] | undefined,
    wireBoxReferences: WireBoxReference[] | undefined,
    format: EncodingFormat,
  ): BoxReference[] {
    if (!wireBoxReferences || wireBoxReferences.length === 0) return []

    return wireBoxReferences.map((_box) => {
      const box = normalizeWireObject(_box)
      const boxIndex = box.i as number | undefined
      const boxName = box.n as WireString | undefined

      const index = boxIndex ?? 0

      let appId: bigint
      if (index === 0) {
        // 0 means current app
        appId = 0n
      } else {
        // 1-based index into foreignApps array
        const foreignAppId = appReferences?.[index - 1]
        if (foreignAppId === undefined) {
          throw new Error(`Failed to find the app reference at index ${index - 1}`)
        }
        appId = bigIntCodec.decode(foreignAppId, format)
      }

      return {
        appId,
        name: bytesCodec.decode(boxName, format),
      }
    })
  }

  protected toEncoded(value: AppCallTransactionFields | undefined, format: EncodingFormat): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    if (!value) {
      throw new Error('Transaction is not an app call')
    }

    const encodedParams = this.appCallFieldsCodec.encodeOptional(value, format)
    if (encodedParams && Object.keys(encodedParams).length > 0) {
      Object.assign(result, encodedParams)
    }

    const wireBoxReferences = this.encodeBoxReferences(value.appId, value.appReferences, value.boxReferences, format)
    if (wireBoxReferences) {
      result.apbx = wireBoxReferences
    }

    const wireAccessReferences = this.encodeAccessReferences(value.appId, value.accessReferences, format)
    if (wireAccessReferences) {
      result.al = wireAccessReferences
    }

    return result
  }

  protected fromEncoded(value: Record<string, unknown>, format: EncodingFormat): AppCallTransactionFields | undefined {
    if (value.type === undefined) {
      throw new Error('Transaction is missing type field')
    }
    const type = normalizeWireString(value.type as WireString)
    if (type !== TransactionType.AppCall) {
      return undefined
    }

    const appReferences = value.apfa as WireBigInt[] | undefined
    const wireBoxReferences = value.apbx as WireBoxReference[] | undefined
    const wireAccessReferences = value.al as WireAccessReference[] | undefined
    const boxReferences = this.decodeBoxReferences(
      appReferences?.map((ar) => bigIntCodec.decode(ar, format)),
      wireBoxReferences,
      format,
    )
    const accessReferences = this.decodeAccessReferences(wireAccessReferences, format)

    return {
      ...this.appCallFieldsCodec.decode(value, format),
      ...(accessReferences.length > 0 && { accessReferences }),
      ...(boxReferences.length > 0 && { boxReferences }),
    } satisfies AppCallTransactionFields
  }

  public isDefaultValue(value: AppCallTransactionFields | undefined): boolean {
    return value === undefined
  }
}

const PaymentTransactionFieldsMeta: ObjectModelMetadata<PaymentTransactionFields> = {
  name: 'PaymentTransactionFields',
  kind: 'object',
  fields: [
    { name: 'amount', wireKey: 'amt', optional: false, codec: bigIntCodec },
    { name: 'receiver', wireKey: 'rcv', optional: false, codec: addressCodec },
    { name: 'closeRemainderTo', wireKey: 'close', optional: true, codec: addressCodec },
  ],
}

const AssetTransferTransactionFieldsMeta: ObjectModelMetadata<AssetTransferTransactionFields> = {
  name: 'AssetTransferTransactionFields',
  kind: 'object',
  fields: [
    { name: 'assetId', wireKey: 'xaid', optional: false, codec: bigIntCodec },
    { name: 'amount', wireKey: 'aamt', optional: false, codec: bigIntCodec },
    { name: 'receiver', wireKey: 'arcv', optional: false, codec: addressCodec },
    { name: 'assetSender', wireKey: 'asnd', optional: true, codec: addressCodec },
    { name: 'closeRemainderTo', wireKey: 'aclose', optional: true, codec: addressCodec },
  ],
}

const AssetFreezeTransactionFieldsMeta: ObjectModelMetadata<AssetFreezeTransactionFields> = {
  name: 'AssetFreezeTransactionFields',
  kind: 'object',
  fields: [
    { name: 'assetId', wireKey: 'faid', optional: false, codec: bigIntCodec },
    { name: 'freezeTarget', wireKey: 'fadd', optional: false, codec: addressCodec },
    { name: 'frozen', wireKey: 'afrz', optional: false, codec: booleanCodec },
  ],
}

const KeyRegistrationTransactionFieldsMeta: ObjectModelMetadata<KeyRegistrationTransactionFields> = {
  name: 'KeyRegistrationTransactionFields',
  kind: 'object',
  fields: [
    { name: 'voteKey', wireKey: 'votekey', optional: true, codec: fixedBytes32Codec },
    { name: 'selectionKey', wireKey: 'selkey', optional: true, codec: fixedBytes32Codec },
    { name: 'stateProofKey', wireKey: 'sprfkey', optional: true, codec: fixedBytes64Codec },
    { name: 'voteFirst', wireKey: 'votefst', optional: true, codec: bigIntCodec },
    { name: 'voteLast', wireKey: 'votelst', optional: true, codec: bigIntCodec },
    { name: 'voteKeyDilution', wireKey: 'votekd', optional: true, codec: bigIntCodec },
    { name: 'nonParticipation', wireKey: 'nonpart', optional: true, codec: booleanCodec },
  ],
}

const AssetParamsMeta: ObjectModelMetadata<Omit<AssetConfigTransactionFields, 'assetId'>> = {
  name: 'AssetParams',
  kind: 'object',
  fields: [
    { name: 'total', wireKey: 't', optional: true, codec: bigIntCodec },
    { name: 'decimals', wireKey: 'dc', optional: true, codec: numberCodec },
    { name: 'defaultFrozen', wireKey: 'df', optional: true, codec: booleanCodec },
    { name: 'unitName', wireKey: 'un', optional: true, codec: stringCodec },
    { name: 'assetName', wireKey: 'an', optional: true, codec: stringCodec },
    { name: 'url', wireKey: 'au', optional: true, codec: stringCodec },
    { name: 'metadataHash', wireKey: 'am', optional: true, codec: fixedBytes32Codec },
    { name: 'manager', wireKey: 'm', optional: true, codec: addressCodec },
    { name: 'reserve', wireKey: 'r', optional: true, codec: addressCodec },
    { name: 'freeze', wireKey: 'f', optional: true, codec: addressCodec },
    { name: 'clawback', wireKey: 'c', optional: true, codec: addressCodec },
  ],
}

const StateSchemaMeta: ObjectModelMetadata<StateSchema> = {
  name: 'StateSchema',
  kind: 'object',
  fields: [
    { name: 'numUints', wireKey: 'nui', optional: false, codec: numberCodec },
    { name: 'numByteSlices', wireKey: 'nbs', optional: false, codec: numberCodec },
  ],
}

const AppCallTransactionFieldsMeta: ObjectModelMetadata<AppCallTransactionFields> = {
  name: 'AppCallTransactionFields',
  kind: 'object',
  fields: [
    { name: 'appId', wireKey: 'apid', optional: false, codec: bigIntCodec },
    { name: 'onComplete', wireKey: 'apan', optional: false, codec: numberCodec },
    { name: 'approvalProgram', wireKey: 'apap', optional: true, codec: bytesCodec },
    { name: 'clearStateProgram', wireKey: 'apsu', optional: true, codec: bytesCodec },
    {
      name: 'globalStateSchema',
      wireKey: 'apgs',
      optional: true,
      codec: new ObjectModelCodec(StateSchemaMeta),
    },
    {
      name: 'localStateSchema',
      wireKey: 'apls',
      optional: true,
      codec: new ObjectModelCodec(StateSchemaMeta),
    },
    { name: 'extraProgramPages', wireKey: 'apep', optional: true, codec: numberCodec },
    { name: 'args', wireKey: 'apaa', optional: true, codec: bytesArrayCodec },
    { name: 'accountReferences', wireKey: 'apat', optional: true, codec: addressArrayCodec },
    { name: 'appReferences', wireKey: 'apfa', optional: true, codec: bigIntArrayCodec },
    { name: 'assetReferences', wireKey: 'apas', optional: true, codec: bigIntArrayCodec },
    // boxReferences and accessReferences are handled by the parent codec, as they require more complex mappings
  ],
}

const HashFactoryMeta: ObjectModelMetadata<HashFactory> = {
  name: 'HashFactory',
  kind: 'object',
  fields: [{ name: 'hashType', wireKey: 't', optional: false, codec: numberCodec }],
}

const MerkleArrayProofMeta: ObjectModelMetadata<MerkleArrayProof> = {
  name: 'MerkleArrayProof',
  kind: 'object',
  fields: [
    { name: 'path', wireKey: 'pth', optional: false, codec: bytesArrayCodec },
    { name: 'hashFactory', wireKey: 'hsh', optional: false, codec: new ObjectModelCodec(HashFactoryMeta) },
    { name: 'treeDepth', wireKey: 'td', optional: false, codec: numberCodec },
  ],
}

const FalconVerifierMeta: ObjectModelMetadata<FalconVerifier> = {
  name: 'FalconVerifier',
  kind: 'object',
  fields: [{ name: 'publicKey', wireKey: 'k', optional: false, codec: fixedBytes1793Codec }],
}

const FalconSignatureStructMeta: ObjectModelMetadata<FalconSignatureStruct> = {
  name: 'FalconSignatureStruct',
  kind: 'object',
  fields: [
    { name: 'signature', wireKey: 'sig', optional: false, codec: bytesCodec },
    { name: 'vectorCommitmentIndex', wireKey: 'idx', optional: false, codec: bigIntCodec },
    { name: 'proof', wireKey: 'prf', optional: false, codec: new ObjectModelCodec(MerkleArrayProofMeta) },
    { name: 'verifyingKey', wireKey: 'vkey', optional: false, codec: new ObjectModelCodec(FalconVerifierMeta) },
  ],
}

const SigslotCommitMeta: ObjectModelMetadata<SigslotCommit> = {
  name: 'SigslotCommit',
  kind: 'object',
  fields: [
    { name: 'sig', wireKey: 's', optional: false, codec: new ObjectModelCodec(FalconSignatureStructMeta) },
    { name: 'lowerSigWeight', wireKey: 'l', optional: false, codec: bigIntCodec },
  ],
}

const MerkleSignatureVerifierMeta: ObjectModelMetadata<MerkleSignatureVerifier> = {
  name: 'MerkleSignatureVerifier',
  kind: 'object',
  fields: [
    { name: 'commitment', wireKey: 'cmt', optional: false, codec: fixedBytes64Codec },
    { name: 'keyLifetime', wireKey: 'lf', optional: false, codec: bigIntCodec },
  ],
}

const ParticipantMeta: ObjectModelMetadata<Participant> = {
  name: 'Participant',
  kind: 'object',
  fields: [
    { name: 'verifier', wireKey: 'p', optional: false, codec: new ObjectModelCodec(MerkleSignatureVerifierMeta) },
    { name: 'weight', wireKey: 'w', optional: false, codec: bigIntCodec },
  ],
}

const RevealMeta: ObjectModelMetadata<Reveal> = {
  name: 'Reveal',
  kind: 'object',
  fields: [
    { name: 'sigslot', wireKey: 's', optional: false, codec: new ObjectModelCodec(SigslotCommitMeta) },
    { name: 'participant', wireKey: 'p', optional: false, codec: new ObjectModelCodec(ParticipantMeta) },
  ],
}

const StateProofMeta: ObjectModelMetadata<StateProof> = {
  name: 'StateProof',
  kind: 'object',
  fields: [
    { name: 'sigCommit', wireKey: 'c', optional: false, codec: bytesCodec },
    { name: 'signedWeight', wireKey: 'w', optional: false, codec: bigIntCodec },
    { name: 'sigProofs', wireKey: 'S', optional: false, codec: new ObjectModelCodec(MerkleArrayProofMeta) },
    { name: 'partProofs', wireKey: 'P', optional: false, codec: new ObjectModelCodec(MerkleArrayProofMeta) },
    { name: 'merkleSignatureSaltVersion', wireKey: 'v', optional: false, codec: numberCodec },
    {
      name: 'reveals',
      wireKey: 'r',
      optional: false,
      codec: new MapCodec(bigIntCodec, new ObjectModelCodec(RevealMeta)),
    },
    { name: 'positionsToReveal', wireKey: 'pr', optional: false, codec: bigIntArrayCodec },
  ],
}

const StateProofMessageMeta: ObjectModelMetadata<StateProofMessage> = {
  name: 'StateProofMessage',
  kind: 'object',
  fields: [
    { name: 'blockHeadersCommitment', wireKey: 'b', optional: false, codec: bytesCodec },
    { name: 'votersCommitment', wireKey: 'v', optional: false, codec: bytesCodec },
    { name: 'lnProvenWeight', wireKey: 'P', optional: false, codec: bigIntCodec },
    { name: 'firstAttestedRound', wireKey: 'f', optional: false, codec: bigIntCodec },
    { name: 'lastAttestedRound', wireKey: 'l', optional: false, codec: bigIntCodec },
  ],
}

const StateProofTransactionFieldsMeta: ObjectModelMetadata<StateProofTransactionFields> = {
  name: 'StateProofTransactionFields',
  kind: 'object',
  fields: [
    { name: 'stateProofType', wireKey: 'sptype', optional: false, codec: numberCodec },
    { name: 'stateProof', wireKey: 'sp', optional: true, codec: new ObjectModelCodec(StateProofMeta) },
    { name: 'message', wireKey: 'spmsg', optional: true, codec: new ObjectModelCodec(StateProofMessageMeta) },
  ],
}

const HeartbeatProofMeta: ObjectModelMetadata<HeartbeatProof> = {
  name: 'HeartbeatProof',
  kind: 'object',
  fields: [
    { name: 'sig', wireKey: 's', optional: false, codec: fixedBytes64Codec },
    { name: 'pk', wireKey: 'p', optional: false, codec: fixedBytes32Codec },
    { name: 'pk2', wireKey: 'p2', optional: false, codec: fixedBytes32Codec },
    { name: 'pk1Sig', wireKey: 'p1s', optional: false, codec: fixedBytes64Codec },
    { name: 'pk2Sig', wireKey: 'p2s', optional: false, codec: fixedBytes64Codec },
  ],
}

const HeartbeatTransactionFieldsMeta: ObjectModelMetadata<HeartbeatTransactionFields> = {
  name: 'HeartbeatTransactionFields',
  kind: 'object',
  fields: [
    { name: 'address', wireKey: 'a', optional: false, codec: addressCodec },
    { name: 'proof', wireKey: 'prf', optional: false, codec: new ObjectModelCodec(HeartbeatProofMeta) },
    { name: 'seed', wireKey: 'sd', optional: false, codec: bytesCodec },
    { name: 'voteId', wireKey: 'vid', optional: false, codec: fixedBytes32Codec },
    { name: 'keyDilution', wireKey: 'kd', optional: false, codec: bigIntCodec },
  ],
}

/**
 * Metadata for TransactionParams
 */
export const TransactionParamsMeta: ObjectModelMetadata<TransactionParams> = {
  name: 'TransactionParams',
  kind: 'object',
  fields: [
    // Common transaction fields
    { name: 'type', wireKey: 'type', optional: false, codec: new TransactionTypeCodec() },
    { name: 'sender', wireKey: 'snd', optional: false, codec: addressCodec },
    { name: 'fee', wireKey: 'fee', optional: true, codec: bigIntCodec },
    { name: 'firstValid', wireKey: 'fv', optional: false, codec: bigIntCodec },
    { name: 'lastValid', wireKey: 'lv', optional: false, codec: bigIntCodec },
    { name: 'genesisHash', wireKey: 'gh', optional: true, codec: fixedBytes32Codec },
    { name: 'genesisId', wireKey: 'gen', optional: true, codec: stringCodec },
    { name: 'note', wireKey: 'note', optional: true, codec: bytesCodec },
    { name: 'rekeyTo', wireKey: 'rekey', optional: true, codec: addressCodec },
    { name: 'lease', wireKey: 'lx', optional: true, codec: fixedBytes32Codec },
    { name: 'group', wireKey: 'grp', optional: true, codec: fixedBytes32Codec },
    // Transaction type-specific fields (flattened)
    {
      name: 'payment',
      flattened: true,
      optional: true,
      codec: new TransactionDataCodec(TransactionType.Payment, PaymentTransactionFieldsMeta),
    },
    {
      name: 'assetTransfer',
      flattened: true,
      optional: true,
      codec: new TransactionDataCodec(TransactionType.AssetTransfer, AssetTransferTransactionFieldsMeta),
    },
    {
      name: 'assetFreeze',
      flattened: true,
      optional: true,
      codec: new TransactionDataCodec(TransactionType.AssetFreeze, AssetFreezeTransactionFieldsMeta),
    },
    {
      name: 'keyRegistration',
      flattened: true,
      optional: true,
      codec: new TransactionDataCodec(TransactionType.KeyRegistration, KeyRegistrationTransactionFieldsMeta),
    },
    {
      name: 'assetConfig',
      flattened: true,
      optional: true,
      codec: new AssetConfigDataCodec(),
    },
    {
      name: 'heartbeat',
      wireKey: 'hb',
      optional: true,
      // Heartbeat is not flattened and therefore does not need the type check for conditional decoding
      codec: new ObjectModelCodec(HeartbeatTransactionFieldsMeta),
    },
    {
      name: 'appCall',
      flattened: true,
      optional: true,
      codec: new AppCallDataCodec(),
    },
    {
      name: 'stateProof',
      flattened: true,
      optional: true,
      codec: new TransactionDataCodec(TransactionType.StateProof, StateProofTransactionFieldsMeta),
    },
  ],
}

export const transactionParamsCodec = new ObjectModelCodec<TransactionParams>(TransactionParamsMeta)
