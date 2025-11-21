import type { BodyFormat, ObjectModelMetadata, WireBigInt, WireBytes, WireObject } from '@algorandfoundation/algokit-common'
import {
  Codec,
  ContextualCodec,
  MapCodec,
  ModelCodec,
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
  getWireValue,
  numberCodec,
  requiredBigIntCodec,
  stringCodec,
} from '@algorandfoundation/algokit-common'
import { Buffer } from 'buffer'
import { AccessReference, BoxReference } from './app-call'
import { AssetConfigTransactionFields } from './asset-config'
import { TransactionType } from './transaction-type'

type BoxReferenceWire = {
  /** App index (0 or index into access list) */
  i?: number
  /** Box name */
  n?: WireBytes
}

type AccessWireEntry = {
  /** Account address */
  d?: WireBytes

  /** App index */
  p?: WireBigInt

  /** Asset index */
  s?: WireBigInt

  /** Box reference */
  b?: BoxReferenceWire

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

/**
 * Custom codec for TransactionType enum that converts to/from wire format strings
 */
class TransactionTypeCodec extends Codec<TransactionType, string> {
  public defaultValue(): TransactionType {
    return TransactionType.Payment
  }

  protected toEncoded(value: TransactionType, _format: BodyFormat): string {
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
        throw new Error(`Unknown transaction type: ${value}`)
    }
  }

  protected fromEncoded(value: string | Uint8Array, _format: BodyFormat): TransactionType {
    // Convert Uint8Array to string if needed (msgpack may return transaction type as bytes)
    const typeString = value instanceof Uint8Array ? Buffer.from(value).toString('utf-8') : value

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
        throw new Error(`Unknown transaction type string: ${typeString}`)
    }
  }

  protected isDefaultValue(_value: TransactionType): boolean {
    // Never omit the transaction type - it's always required
    return false
  }
}

const PaymentTransactionFieldsMeta: ObjectModelMetadata = {
  name: 'PaymentTransactionFields',
  kind: 'object',
  fields: [
    { name: 'amount', wireKey: 'amt', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'receiver', wireKey: 'rcv', optional: false, nullable: false, codec: addressCodec },
    { name: 'closeRemainderTo', wireKey: 'close', optional: true, nullable: false, codec: addressCodec },
  ],
}

const AssetTransferTransactionFieldsMeta: ObjectModelMetadata = {
  name: 'AssetTransferTransactionFields',
  kind: 'object',
  fields: [
    { name: 'assetId', wireKey: 'xaid', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'amount', wireKey: 'aamt', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'receiver', wireKey: 'arcv', optional: false, nullable: false, codec: addressCodec },
    { name: 'assetSender', wireKey: 'asnd', optional: true, nullable: false, codec: addressCodec },
    { name: 'closeRemainderTo', wireKey: 'aclose', optional: true, nullable: false, codec: addressCodec },
  ],
}

const AssetFreezeTransactionFieldsMeta: ObjectModelMetadata = {
  name: 'AssetFreezeTransactionFields',
  kind: 'object',
  fields: [
    { name: 'assetId', wireKey: 'faid', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'freezeTarget', wireKey: 'fadd', optional: false, nullable: false, codec: addressCodec },
    { name: 'frozen', wireKey: 'afrz', optional: false, nullable: false, codec: booleanCodec },
  ],
}

const KeyRegistrationTransactionFieldsMeta: ObjectModelMetadata = {
  name: 'KeyRegistrationTransactionFields',
  kind: 'object',
  fields: [
    { name: 'voteKey', wireKey: 'votekey', optional: true, nullable: false, codec: fixedBytes32Codec },
    { name: 'selectionKey', wireKey: 'selkey', optional: true, nullable: false, codec: fixedBytes32Codec },
    { name: 'stateProofKey', wireKey: 'sprfkey', optional: true, nullable: false, codec: fixedBytes64Codec },
    { name: 'voteFirst', wireKey: 'votefst', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'voteLast', wireKey: 'votelst', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'voteKeyDilution', wireKey: 'votekd', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'nonParticipation', wireKey: 'nonpart', optional: true, nullable: false, codec: booleanCodec },
  ],
}

const AssetParamsMeta: ObjectModelMetadata = {
  name: 'AssetParams',
  kind: 'object',
  fields: [
    { name: 'total', wireKey: 't', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'decimals', wireKey: 'dc', optional: true, nullable: false, codec: numberCodec },
    { name: 'defaultFrozen', wireKey: 'df', optional: true, nullable: false, codec: booleanCodec },
    { name: 'unitName', wireKey: 'un', optional: true, nullable: false, codec: stringCodec },
    { name: 'assetName', wireKey: 'an', optional: true, nullable: false, codec: stringCodec },
    { name: 'url', wireKey: 'au', optional: true, nullable: false, codec: stringCodec },
    { name: 'metadataHash', wireKey: 'am', optional: true, nullable: false, codec: fixedBytes32Codec },
    { name: 'manager', wireKey: 'm', optional: true, nullable: false, codec: addressCodec },
    { name: 'reserve', wireKey: 'r', optional: true, nullable: false, codec: addressCodec },
    { name: 'freeze', wireKey: 'f', optional: true, nullable: false, codec: addressCodec },
    { name: 'clawback', wireKey: 'c', optional: true, nullable: false, codec: addressCodec },
  ],
}

class AssetConfigCodec extends Codec<AssetConfigTransactionFields | undefined, WireObject> {
  private assetParamsCodec = new ObjectModelCodec<Record<string, unknown>>(AssetParamsMeta)

  public defaultValue(): undefined {
    return undefined
  }

  protected toEncoded(value: AssetConfigTransactionFields | undefined, format: BodyFormat): WireObject {
    const result: Record<string, unknown> = {}

    if (!value) {
      return result
    }

    const { assetId, ...assetParams } = value

    const encodedAssetId = bigIntCodec.encode(value.assetId, format)
    if (encodedAssetId !== undefined) {
      result.caid = encodedAssetId
    }

    const encodedParams = this.assetParamsCodec.encode(assetParams, format)
    if (encodedParams && Object.keys(encodedParams).length > 0) {
      result.apar = encodedParams
    }

    return result
  }

  protected fromEncoded(value: WireObject, format: BodyFormat): AssetConfigTransactionFields | undefined {
    if ((value instanceof Map && value.size === 0) || (!(value instanceof Map) && Object.keys(value).length === 0)) {
      return undefined
    }

    const caid = getWireValue<WireBigInt>(value, 'caid')
    const apar = getWireValue<WireObject>(value, 'apar')

    if (caid === undefined && !apar) {
      return undefined
    }

    return {
      assetId: bigIntCodec.decode(caid, format),
      ...this.assetParamsCodec.decode(apar, format),
    } satisfies AssetConfigTransactionFields
  }

  protected isDefaultValue(value: AssetConfigTransactionFields | undefined): boolean {
    return value === undefined
  }
}

/**
 * Contextual codec for box references
 * Needs access to appId and appReferences for proper indexing
 */
class BoxReferencesCodec extends ContextualCodec<BoxReference[], BoxReferenceWire[]> {
  public defaultValue(): BoxReference[] {
    return []
  }

  public encodeWithContext(
    boxes: BoxReference[] | undefined,
    appCall: Record<string, unknown>,
    format: BodyFormat,
  ): BoxReferenceWire[] | undefined {
    if (!boxes || boxes.length === 0) return undefined

    const appId = appCall.appId as bigint
    const appReferences = (appCall.appReferences ?? []) as bigint[]

    return boxes.map((box) => {
      const isCurrentApp = box.appId === 0n || box.appId === appId
      // Index 0 means current app, index > 0 references foreign apps array (1-indexed)
      const index = isCurrentApp ? 0 : appReferences.indexOf(box.appId) + 1

      if (index === 0 && !isCurrentApp) {
        throw new Error(`Box ref with appId ${box.appId} not in appReferences`)
      }

      return {
        i: numberCodec.encode(index, format), // This returns undefined when index is 0, which omits the field
        n: bytesCodec.encode(box.name, format),
      }
    })
  }

  public decodeWithContext(
    dtoBoxes: BoxReferenceWire[] | undefined,
    parentDTO: Record<string, unknown>,
    format: BodyFormat,
  ): BoxReference[] {
    if (!dtoBoxes || dtoBoxes.length === 0) return []

    // Get app references from parent DTO using getValue (parentDTO could be a Map from msgpack)
    const appReferencesArray = getWireValue<unknown[]>(parentDTO, 'apfa')

    return dtoBoxes.map((box) => {
      // Use getValue to handle Map values with Uint8Array keys from msgpack
      const boxIndex = getWireValue<number | bigint>(box, 'i')
      const boxName = getWireValue<string | Uint8Array>(box, 'n')

      // Handle index - could be number, bigint, or undefined
      const index = typeof boxIndex === 'bigint' ? Number(boxIndex) : typeof boxIndex === 'number' ? boxIndex : 0

      let appId: bigint
      if (index === 0) {
        // 0 means current app
        appId = 0n
      } else {
        // 1-based index into foreignApps array
        const foreignAppId = appReferencesArray?.[index - 1]
        if (foreignAppId === undefined) {
          throw new Error(`Failed to find the app reference at index ${index - 1}`)
        }
        appId = bigIntCodec.decode(foreignAppId as string | number | bigint | undefined, format)
      }

      return {
        appId,
        name: bytesCodec.decode(boxName, format),
      }
    })
  }

  protected isDefaultValue(value: BoxReference[]): boolean {
    return value.length === 0
  }
}

/**
 * Contextual codec for access references
 * Handles complex encoding including holding, locals, and box references
 */
class AccessReferencesCodec extends ContextualCodec<AccessReference[], AccessWireEntry[]> {
  public defaultValue(): AccessReference[] {
    return []
  }

  public encodeWithContext(
    refs: AccessReference[] | undefined,
    appCall: { appId: bigint },
    format: BodyFormat,
  ): AccessWireEntry[] | undefined {
    if (!refs || refs.length === 0) return undefined

    const accessList: AccessWireEntry[] = []
    const ZERO_ADDRESS = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ' // TODO: NC - Remove this

    // Helper to find or add a simple reference and return its 1-based index
    const ensure = (target: Pick<AccessReference, 'address' | 'assetId' | 'appId'>): number => {
      // Search for existing entry
      for (let idx = 0; idx < accessList.length; idx++) {
        const entry = accessList[idx]
        const matchesAddress =
          (!entry.d && !target.address) || (entry.d && target.address && addressCodec.decode(entry.d, format) === target.address)
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
      if (target.address && target.address !== ZERO_ADDRESS) {
        accessList.push({ d: addressCodec.encode(target.address, format)! })
      }
      if (target.assetId !== undefined) {
        accessList.push({ s: bigIntCodec.encode(target.assetId, format)! })
      }
      if (target.appId !== undefined) {
        accessList.push({ p: bigIntCodec.encode(target.appId, format)! })
      }

      return accessList.length // Return 1-based index of last added
    }

    // Process each access reference
    for (const accessRef of refs) {
      // Simple references (address, assetId, or appId)
      if (accessRef.address || accessRef.assetId !== undefined || accessRef.appId !== undefined) {
        ensure(accessRef)
        continue
      }

      // Holding reference
      if (accessRef.holding) {
        const holding = accessRef.holding
        let addressIndex = 0
        if (holding.address && holding.address !== ZERO_ADDRESS) {
          addressIndex = ensure({ address: holding.address })
        }
        const assetIndex = ensure({ assetId: holding.assetId })
        accessList.push({
          h: {
            d: numberCodec.encode(addressIndex, format),
            s: numberCodec.encode(assetIndex, format),
          },
        })
        continue
      }

      // Locals reference
      if (accessRef.locals) {
        const locals = accessRef.locals
        let addressIndex = 0
        if (locals.address && locals.address !== ZERO_ADDRESS) {
          addressIndex = ensure({ address: locals.address })
        }

        let appIndex = 0
        if (locals.appId && locals.appId !== appCall.appId) {
          appIndex = ensure({ appId: locals.appId })
        }
        if (addressIndex !== 0 || appIndex !== 0) {
          accessList.push({
            l: {
              d: numberCodec.encode(addressIndex, format),
              p: numberCodec.encode(appIndex, format),
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
        if (box.appId && box.appId !== appCall.appId) {
          appIndex = ensure({ appId: box.appId })
        }
        accessList.push({
          b: {
            i: numberCodec.encode(appIndex, format),
            n: bytesCodec.encode(box.name, format),
          },
        })
        continue
      }
    }

    return accessList.length > 0 ? accessList : undefined
  }

  public decodeWithContext(dtoAccessList: AccessWireEntry[] | undefined, parentDTO: unknown, format: BodyFormat): AccessReference[] {
    if (!dtoAccessList || dtoAccessList.length === 0) return []

    const result: AccessReference[] = []
    const ZERO_ADDRESS = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'

    // Process each entry in the access list
    for (const ref of dtoAccessList) {
      const d = getWireValue<WireBytes>(ref, 'd')
      const s = getWireValue<WireBigInt>(ref, 's')
      const p = getWireValue<WireBigInt>(ref, 'p')
      const h = getWireValue<WireObject>(ref, 'h')
      const l = getWireValue<WireObject>(ref, 'l')
      const b = getWireValue<WireObject>(ref, 'b')

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
        const addrIdx = getWireValue<number>(h, 'd') ?? 0
        const assetIdx = getWireValue<number>(h, 's')

        if (assetIdx === undefined) {
          throw new Error('Access list holding reference is missing asset index')
        }

        const holdingAddress = addrIdx === 0 ? ZERO_ADDRESS : getWireValue<WireBytes>(dtoAccessList[addrIdx - 1], 'd')!
        const holdingAssetId = getWireValue<WireBigInt>(dtoAccessList[assetIdx - 1], 's')!

        result.push({
          holding: {
            assetId: bigIntCodec.decode(holdingAssetId, format),
            address: typeof holdingAddress == 'string' ? holdingAddress : addressCodec.decode(holdingAddress, format),
          },
        })
        continue
      }

      // Locals reference (l)
      if (l) {
        const addrIdx = getWireValue<number>(l, 'd') ?? 0
        const appIdx = getWireValue<number>(l, 'p') ?? 0

        const localsAddress = addrIdx === 0 ? ZERO_ADDRESS : getWireValue<WireBytes>(dtoAccessList[addrIdx - 1], 'd')!
        const localsAppId = appIdx === 0 ? 0n : getWireValue<WireBigInt>(dtoAccessList[appIdx - 1], 'p')!

        result.push({
          locals: {
            appId: bigIntCodec.decode(localsAppId, format),
            address: typeof localsAddress === 'string' ? localsAddress : addressCodec.decode(localsAddress, format),
          },
        })
        continue
      }

      // Box reference (b)
      if (b) {
        const boxAppIdx = getWireValue<number>(b, 'i') ?? 0
        const name = getWireValue<WireBytes>(b, 'n')

        if (!name) {
          throw new Error('Access list box reference is missing name')
        }

        const boxAppId = boxAppIdx === 0 ? 0n : getWireValue<WireBigInt>(dtoAccessList[boxAppIdx - 1], 'p')!

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

  protected isDefaultValue(value: AccessReference[]): boolean {
    return value.length === 0
  }
}

const StateSchemaMeta: ObjectModelMetadata = {
  name: 'StateSchema',
  kind: 'object',
  fields: [
    { name: 'numUints', wireKey: 'nui', optional: false, nullable: false, codec: numberCodec },
    { name: 'numByteSlices', wireKey: 'nbs', optional: false, nullable: false, codec: numberCodec },
  ],
}

const AppCallTransactionFieldsMeta: ObjectModelMetadata = {
  name: 'AppCallTransactionFields',
  kind: 'object',
  fields: [
    { name: 'appId', wireKey: 'apid', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'onComplete', wireKey: 'apan', optional: false, nullable: false, codec: numberCodec },
    { name: 'approvalProgram', wireKey: 'apap', optional: true, nullable: false, codec: bytesCodec },
    { name: 'clearStateProgram', wireKey: 'apsu', optional: true, nullable: false, codec: bytesCodec },
    {
      name: 'globalStateSchema',
      wireKey: 'apgs',
      optional: true,
      nullable: false,
      codec: new ModelCodec(StateSchemaMeta),
    },
    {
      name: 'localStateSchema',
      wireKey: 'apls',
      optional: true,
      nullable: false,
      codec: new ModelCodec(StateSchemaMeta),
    },
    { name: 'extraProgramPages', wireKey: 'apep', optional: true, nullable: false, codec: numberCodec },
    { name: 'args', wireKey: 'apaa', optional: true, nullable: false, codec: bytesArrayCodec },
    { name: 'accountReferences', wireKey: 'apat', optional: true, nullable: false, codec: addressArrayCodec },
    { name: 'appReferences', wireKey: 'apfa', optional: true, nullable: false, codec: bigIntArrayCodec },
    { name: 'assetReferences', wireKey: 'apas', optional: true, nullable: false, codec: bigIntArrayCodec },
    // These fields use contextual codecs that need access to sibling fields
    { name: 'boxReferences', wireKey: 'apbx', optional: true, nullable: false, codec: new BoxReferencesCodec() },
    { name: 'accessReferences', wireKey: 'al', optional: true, nullable: false, codec: new AccessReferencesCodec() },
  ],
}

const HashFactoryMeta: ObjectModelMetadata = {
  name: 'HashFactory',
  kind: 'object',
  fields: [{ name: 'hashType', wireKey: 't', optional: false, nullable: false, codec: numberCodec }],
}

const MerkleArrayProofMeta: ObjectModelMetadata = {
  name: 'MerkleArrayProof',
  kind: 'object',
  fields: [
    { name: 'path', wireKey: 'pth', optional: false, nullable: false, codec: bytesArrayCodec },
    { name: 'hashFactory', wireKey: 'hsh', optional: false, nullable: false, codec: new ModelCodec(HashFactoryMeta) },
    { name: 'treeDepth', wireKey: 'td', optional: false, nullable: false, codec: numberCodec },
  ],
}

const FalconVerifierMeta: ObjectModelMetadata = {
  name: 'FalconVerifier',
  kind: 'object',
  fields: [{ name: 'publicKey', wireKey: 'k', optional: false, nullable: false, codec: fixedBytes1793Codec }],
}

const FalconSignatureStructMeta: ObjectModelMetadata = {
  name: 'FalconSignatureStruct',
  kind: 'object',
  fields: [
    { name: 'signature', wireKey: 'sig', optional: false, nullable: false, codec: bytesCodec },
    { name: 'vectorCommitmentIndex', wireKey: 'idx', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'proof', wireKey: 'prf', optional: false, nullable: false, codec: new ModelCodec(MerkleArrayProofMeta) },
    { name: 'verifyingKey', wireKey: 'vkey', optional: false, nullable: false, codec: new ModelCodec(FalconVerifierMeta) },
  ],
}

const SigslotCommitMeta: ObjectModelMetadata = {
  name: 'SigslotCommit',
  kind: 'object',
  fields: [
    { name: 'sig', wireKey: 's', optional: false, nullable: false, codec: new ModelCodec(FalconSignatureStructMeta) },
    { name: 'lowerSigWeight', wireKey: 'l', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

const MerkleSignatureVerifierMeta: ObjectModelMetadata = {
  name: 'MerkleSignatureVerifier',
  kind: 'object',
  fields: [
    { name: 'commitment', wireKey: 'cmt', optional: false, nullable: false, codec: fixedBytes64Codec },
    { name: 'keyLifetime', wireKey: 'lf', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

const ParticipantMeta: ObjectModelMetadata = {
  name: 'Participant',
  kind: 'object',
  fields: [
    { name: 'verifier', wireKey: 'p', optional: false, nullable: false, codec: new ModelCodec(MerkleSignatureVerifierMeta) },
    { name: 'weight', wireKey: 'w', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

/**
 * Metadata for the Reveal value structure (without position, as position is the map key)
 * Wire format: { s: SigslotCommit, p: Participant }
 */
const RevealMeta: ObjectModelMetadata = {
  name: 'Reveal',
  kind: 'object',
  fields: [
    { name: 'sigslot', wireKey: 's', optional: false, nullable: false, codec: new ModelCodec(SigslotCommitMeta) },
    { name: 'participant', wireKey: 'p', optional: false, nullable: false, codec: new ModelCodec(ParticipantMeta) },
  ],
}

const StateProofMeta: ObjectModelMetadata = {
  name: 'StateProof',
  kind: 'object',
  fields: [
    { name: 'sigCommit', wireKey: 'c', optional: false, nullable: false, codec: bytesCodec },
    { name: 'signedWeight', wireKey: 'w', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'sigProofs', wireKey: 'S', optional: false, nullable: false, codec: new ModelCodec(MerkleArrayProofMeta) },
    { name: 'partProofs', wireKey: 'P', optional: false, nullable: false, codec: new ModelCodec(MerkleArrayProofMeta) },
    { name: 'merkleSignatureSaltVersion', wireKey: 'v', optional: false, nullable: false, codec: numberCodec },
    {
      name: 'reveals',
      wireKey: 'r',
      optional: false,
      nullable: false,
      codec: new MapCodec(requiredBigIntCodec, new ModelCodec(RevealMeta)),
    },
    { name: 'positionsToReveal', wireKey: 'pr', optional: false, nullable: false, codec: bigIntArrayCodec },
  ],
}

const StateProofMessageMeta: ObjectModelMetadata = {
  name: 'StateProofMessage',
  kind: 'object',
  fields: [
    { name: 'blockHeadersCommitment', wireKey: 'b', optional: false, nullable: false, codec: bytesCodec },
    { name: 'votersCommitment', wireKey: 'v', optional: false, nullable: false, codec: bytesCodec },
    { name: 'lnProvenWeight', wireKey: 'P', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'firstAttestedRound', wireKey: 'f', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'lastAttestedRound', wireKey: 'l', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

const StateProofTransactionFieldsMeta: ObjectModelMetadata = {
  name: 'StateProofTransactionFields',
  kind: 'object',
  fields: [
    { name: 'stateProofType', wireKey: 'sptype', optional: false, nullable: false, codec: numberCodec },
    { name: 'stateProof', wireKey: 'sp', optional: true, nullable: false, codec: new ModelCodec(StateProofMeta) },
    { name: 'message', wireKey: 'spmsg', optional: true, nullable: false, codec: new ModelCodec(StateProofMessageMeta) },
  ],
}

const HeartbeatProofMeta: ObjectModelMetadata = {
  name: 'HeartbeatProof',
  kind: 'object',
  fields: [
    { name: 'sig', wireKey: 's', optional: false, nullable: false, codec: fixedBytes64Codec },
    { name: 'pk', wireKey: 'p', optional: false, nullable: false, codec: fixedBytes32Codec },
    { name: 'pk2', wireKey: 'p2', optional: false, nullable: false, codec: fixedBytes32Codec },
    { name: 'pk1Sig', wireKey: 'p1s', optional: false, nullable: false, codec: fixedBytes64Codec },
    { name: 'pk2Sig', wireKey: 'p2s', optional: false, nullable: false, codec: fixedBytes64Codec },
  ],
}

/**
 * Metadata for HeartbeatTransactionFields
 * These fields are nested under 'hb' wire key (not flattened)
 */
export const HeartbeatTransactionFieldsMeta: ObjectModelMetadata = {
  name: 'HeartbeatTransactionFields',
  kind: 'object',
  fields: [
    { name: 'address', wireKey: 'a', optional: false, nullable: false, codec: addressCodec },
    { name: 'proof', wireKey: 'prf', optional: false, nullable: false, codec: new ModelCodec(HeartbeatProofMeta) },
    { name: 'seed', wireKey: 'sd', optional: false, nullable: false, codec: bytesCodec },
    { name: 'voteId', wireKey: 'vid', optional: false, nullable: false, codec: fixedBytes32Codec },
    { name: 'keyDilution', wireKey: 'kd', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

export const TransactionMeta: ObjectModelMetadata = {
  name: 'Transaction',
  kind: 'object',
  fields: [
    // Common transaction fields
    { name: 'type', wireKey: 'type', optional: false, nullable: false, codec: new TransactionTypeCodec() },
    { name: 'sender', wireKey: 'snd', optional: false, nullable: false, codec: addressCodec },
    { name: 'fee', wireKey: 'fee', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'firstValid', wireKey: 'fv', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'lastValid', wireKey: 'lv', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'genesisHash', wireKey: 'gh', optional: true, nullable: false, codec: fixedBytes32Codec },
    { name: 'genesisId', wireKey: 'gen', optional: true, nullable: false, codec: stringCodec },
    { name: 'note', wireKey: 'note', optional: true, nullable: false, codec: bytesCodec },
    { name: 'rekeyTo', wireKey: 'rekey', optional: true, nullable: false, codec: addressCodec },
    { name: 'lease', wireKey: 'lx', optional: true, nullable: false, codec: fixedBytes32Codec },
    { name: 'group', wireKey: 'grp', optional: true, nullable: false, codec: fixedBytes32Codec },

    // Transaction type-specific fields (flattened)
    {
      name: 'payment',
      flattened: true,
      optional: true,
      nullable: false,
      codec: new ModelCodec(PaymentTransactionFieldsMeta),
    },
    {
      name: 'assetTransfer',
      flattened: true,
      optional: true,
      nullable: false,
      codec: new ModelCodec(AssetTransferTransactionFieldsMeta),
    },
    {
      name: 'assetFreeze',
      flattened: true,
      optional: true,
      nullable: false,
      codec: new ModelCodec(AssetFreezeTransactionFieldsMeta),
    },
    {
      name: 'keyRegistration',
      flattened: true,
      optional: true,
      nullable: false,
      codec: new ModelCodec(KeyRegistrationTransactionFieldsMeta),
    },
    {
      name: 'assetConfig',
      flattened: true,
      optional: true,
      nullable: false,
      codec: new AssetConfigCodec(),
    },
    {
      name: 'heartbeat',
      wireKey: 'hb',
      optional: true,
      nullable: false,
      codec: new ModelCodec(HeartbeatTransactionFieldsMeta),
    },
    {
      name: 'appCall',
      flattened: true,
      optional: true,
      nullable: false,
      codec: new ModelCodec(AppCallTransactionFieldsMeta),
    },
    {
      name: 'stateProof',
      flattened: true,
      optional: true,
      nullable: false,
      codec: new ModelCodec(StateProofTransactionFieldsMeta),
    },
  ],
}
