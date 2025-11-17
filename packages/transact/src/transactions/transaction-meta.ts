import type { BodyFormat, ModelMetadata } from '@algorandfoundation/algokit-common'
import {
  Codec,
  ContextualCodec,
  ModelCodec,
  ModelSerializer,
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
  numberCodec,
  stringCodec,
} from '@algorandfoundation/algokit-common'
import { Buffer } from 'buffer'
import type { StateSchema } from './app-call'
import { TransactionType } from './transaction'

type StateSchemaDto = {
  /** Number of uints */
  nui?: number

  /** Number of byte slices */
  nbs?: number
}

/**
 * Helper function to get a value from either a Map or object
 * Maps from msgpack can have Uint8Array keys, so we need to handle that
 */
function getValue(value: unknown, key: string): unknown {
  if (value instanceof Map) {
    // First try the string key directly
    if (value.has(key)) {
      return value.get(key)
    }
    // Search for Uint8Array key that matches when decoded to string
    for (const [k, v] of value.entries()) {
      if (k instanceof Uint8Array) {
        const keyStr = Buffer.from(k).toString('utf-8')
        if (keyStr === key) {
          return v
        }
      }
    }
    return undefined
  }
  return (value as any)[key]
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

const PaymentTransactionFieldsMeta: ModelMetadata = {
  name: 'PaymentTransactionFields',
  kind: 'object',
  fields: [
    { name: 'amount', wireKey: 'amt', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'receiver', wireKey: 'rcv', optional: false, nullable: false, codec: addressCodec },
    { name: 'closeRemainderTo', wireKey: 'close', optional: true, nullable: false, codec: addressCodec },
  ],
}

const AssetTransferTransactionFieldsMeta: ModelMetadata = {
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

const AssetFreezeTransactionFieldsMeta: ModelMetadata = {
  name: 'AssetFreezeTransactionFields',
  kind: 'object',
  fields: [
    { name: 'assetId', wireKey: 'faid', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'freezeTarget', wireKey: 'fadd', optional: false, nullable: false, codec: addressCodec },
    { name: 'frozen', wireKey: 'afrz', optional: false, nullable: false, codec: booleanCodec },
  ],
}

const KeyRegistrationTransactionFieldsMeta: ModelMetadata = {
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

const AssetParamsMeta: ModelMetadata = {
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

/**
 * Custom codec for AssetConfigTransactionFields that uses ModelCodec internally
 * but handles the wire format transformation where assetId → caid and other fields → apar
 */
class AssetConfigCodec extends Codec<any, any> {
  private assetParamsCodec = new ModelCodec(AssetParamsMeta)

  public defaultValue() {
    return undefined
  }

  protected toEncoded(value: any, format: BodyFormat): any {
    const result: any = {}

    // Encode assetId directly with wireKey 'caid'
    const encodedAssetId = bigIntCodec.encode(value.assetId, format)
    if (encodedAssetId !== undefined) {
      result.caid = encodedAssetId
    }

    // Collect all asset param fields (everything except assetId)
    const assetParams: any = {}
    for (const field of AssetParamsMeta.fields!) {
      if (value[field.name] !== undefined) {
        assetParams[field.name] = value[field.name]
      }
    }

    // Encode asset params to the 'apar' nested object
    const encodedParams = this.assetParamsCodec.encode(assetParams, format)
    if (encodedParams && Object.keys(encodedParams).length > 0) {
      result.apar = encodedParams
    }

    return result
  }

  protected fromEncoded(value: any, format: BodyFormat): any {
    const caid = getValue(value, 'caid')
    const apar = getValue(value, 'apar')

    // If neither caid nor apar is present, this is not an asset config transaction
    if (caid === undefined && !apar) {
      return undefined
    }

    const result: any = {}

    // Decode assetId from 'caid'
    result.assetId = bigIntCodec.decode(caid as string | number | bigint | undefined, format)

    // Decode asset params from 'apar' and spread into result
    if (apar) {
      const params = this.assetParamsCodec.decode(apar as unknown[] | Record<string, unknown> | undefined, format)
      Object.assign(result, params)
    }

    return result
  }

  protected isDefaultValue(value: any): boolean {
    return value === undefined
  }
}

const assetConfigCodec = new AssetConfigCodec()

/**
 * Contextual codec for box references
 * Needs access to appId and appReferences for proper indexing
 */
class BoxReferencesCodec extends ContextualCodec<unknown[], unknown[]> {
  public defaultValue(): unknown[] {
    return []
  }

  public encodeWithContext(boxes: unknown[] | undefined, appCall: Record<string, unknown>, format: BodyFormat): unknown[] | undefined {
    if (!boxes || boxes.length === 0) return undefined

    const appId = appCall.appId
    const appReferences = appCall.appReferences ?? []

    return boxes.map((box: any) => {
      const isCurrentApp = box.appId === 0n || box.appId === appId
      // Index 0 means current app, index > 0 references foreign apps array (1-indexed)
      const index = isCurrentApp ? 0 : (appReferences as bigint[]).indexOf(box.appId) + 1

      if (index === 0 && !isCurrentApp) {
        throw new Error(`Box ref with appId ${box.appId} not in appReferences`)
      }

      return {
        i: numberCodec.encode(index, format), // This returns undefined when index is 0, which omits the field
        n: bytesCodec.encode(box.name, format),
      }
    })
  }

  public decodeWithContext(dtoBoxes: unknown[] | undefined, parentDTO: Record<string, unknown>, format: BodyFormat): unknown[] {
    if (!dtoBoxes || dtoBoxes.length === 0) return []

    // Get app references from parent DTO using getValue (parentDTO could be a Map from msgpack)
    const appReferencesArray = getValue(parentDTO, 'apfa') as unknown[] | undefined

    return dtoBoxes.map((box: any) => {
      // Use getValue to handle Map values with Uint8Array keys from msgpack
      const boxIndex = getValue(box, 'i')
      const boxName = getValue(box, 'n')

      // Handle index - could be number, bigint, or undefined
      const index = (typeof boxIndex === 'bigint' ? Number(boxIndex) : typeof boxIndex === 'number' ? boxIndex : 0) as number

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
        appId: appId,
        name: bytesCodec.decode(boxName as string | Uint8Array | undefined, format),
      }
    })
  }

  protected isDefaultValue(value: unknown[]): boolean {
    return value.length === 0
  }
}

/**
 * Contextual codec for access references
 * Handles complex encoding including holding, locals, and box references
 */
class AccessReferencesCodec extends ContextualCodec<unknown[], unknown[]> {
  public defaultValue(): unknown[] {
    return []
  }

  public encodeWithContext(refs: unknown[] | undefined, appCall: Record<string, unknown>, format: BodyFormat): unknown[] | undefined {
    if (!refs || refs.length === 0) return undefined

    const accessList: unknown[] = []
    const ZERO_ADDRESS = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'

    // Helper to find or add a simple reference and return its 1-based index
    const ensure = (target: Record<string, unknown>): number => {
      // Search for existing entry
      for (let idx = 0; idx < accessList.length; idx++) {
        const entry: any = accessList[idx]
        const matchesAddress =
          (!entry.d && !target.address) ||
          (entry.d && target.address && addressCodec.decode(entry.d as string | Uint8Array | undefined, format) === target.address)
        const matchesAssetId =
          (entry.s === undefined && target.assetId === undefined) ||
          (entry.s !== undefined &&
            target.assetId !== undefined &&
            bigIntCodec.decode(entry.s as string | number | bigint | undefined, format) === target.assetId)
        const matchesAppId =
          (entry.p === undefined && target.appId === undefined) ||
          (entry.p !== undefined &&
            target.appId !== undefined &&
            bigIntCodec.decode(entry.p as string | number | bigint | undefined, format) === target.appId)

        if (matchesAddress && matchesAssetId && matchesAppId) {
          return idx + 1 // Return 1-based index
        }
      }

      // Add new entries for each field
      if (target.address && target.address !== ZERO_ADDRESS) {
        accessList.push({ d: addressCodec.encode(target.address as string, format) })
      }
      if (target.assetId !== undefined) {
        accessList.push({ s: bigIntCodec.encode(target.assetId as bigint, format) })
      }
      if (target.appId !== undefined) {
        accessList.push({ p: bigIntCodec.encode(target.appId as bigint, format) })
      }

      return accessList.length // Return 1-based index of last added
    }

    // Process each access reference
    for (const accessRef of refs as any[]) {
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

  public decodeWithContext(dtoAccessList: unknown[] | undefined, parentDTO: unknown, format: BodyFormat): unknown[] {
    if (!dtoAccessList || dtoAccessList.length === 0) return []

    const result: unknown[] = []
    const ZERO_ADDRESS = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'

    // Process each entry in the access list
    for (const ref of dtoAccessList as any[]) {
      const d = getValue(ref, 'd')
      const s = getValue(ref, 's')
      const p = getValue(ref, 'p')
      const h = getValue(ref, 'h')
      const l = getValue(ref, 'l')
      const b = getValue(ref, 'b')

      // Simple address reference
      if (d) {
        result.push({ address: addressCodec.decode(d as string | Uint8Array | undefined, format) })
        continue
      }

      // Simple asset ID reference
      if (s !== undefined) {
        result.push({ assetId: bigIntCodec.decode(s as string | number | bigint | undefined, format) })
        continue
      }

      // Simple app ID reference
      if (p !== undefined) {
        result.push({ appId: bigIntCodec.decode(p as string | number | bigint | undefined, format) })
        continue
      }

      // Holding reference (h)
      if (h) {
        const addrIdx = (getValue(h, 'd') as number) ?? 0
        const assetIdx = (getValue(h, 's') as number) ?? 0
        let address: string | undefined
        let assetId: bigint | undefined

        // Resolve address from 1-based index
        const addrEntry = dtoAccessList[addrIdx - 1]
        if (addrIdx > 0 && addrEntry) {
          const addrD = getValue(addrEntry, 'd')
          if (addrD) {
            address = addressCodec.decode(addrD as string | Uint8Array | undefined, format)
          }
        }

        // Resolve assetId from 1-based index
        const assetEntry = dtoAccessList[assetIdx - 1]
        if (assetIdx > 0 && assetEntry) {
          const assetS = getValue(assetEntry, 's')
          if (assetS !== undefined) {
            assetId = bigIntCodec.decode(assetS as string | number | bigint | undefined, format)
          }
        }

        if (assetId !== undefined) {
          result.push({
            holding: {
              assetId,
              address: address ?? ZERO_ADDRESS,
            },
          })
        }
        continue
      }

      // Locals reference (l)
      if (l) {
        const addrIdx = (getValue(l, 'd') as number) ?? 0
        const appIdx = (getValue(l, 'p') as number) ?? 0
        let address: string | undefined
        let appId: bigint | undefined

        // Resolve address from 1-based index
        const addrEntry = dtoAccessList[addrIdx - 1]
        if (addrIdx > 0 && addrEntry) {
          const addrD = getValue(addrEntry, 'd')
          if (addrD) {
            address = addressCodec.decode(addrD as string | Uint8Array | undefined, format)
          }
        }

        // Resolve appId from 1-based index
        const appEntry = dtoAccessList[appIdx - 1]
        if (appIdx > 0 && appEntry) {
          const appP = getValue(appEntry, 'p')
          if (appP !== undefined) {
            appId = bigIntCodec.decode(appP as string | number | bigint | undefined, format)
          }
        }

        if (appId !== undefined) {
          result.push({
            locals: {
              appId,
              address: address ?? ZERO_ADDRESS,
            },
          })
        }
        continue
      }

      // Box reference (b)
      if (b) {
        const appIdx = (getValue(b, 'p') as number) ?? 0
        let appId: bigint

        // Resolve appId from 1-based index
        // Index 0 means "current app" (appId = 0n)
        if (appIdx === 0) {
          appId = 0n
        } else {
          const appEntry = dtoAccessList[appIdx - 1]
          if (appEntry) {
            const appP = getValue(appEntry, 'p')
            if (appP !== undefined) {
              appId = bigIntCodec.decode(appP as string | number | bigint | undefined, format)
            } else {
              // If index is invalid, skip this box reference
              continue
            }
          } else {
            // If index is invalid, skip this box reference
            continue
          }
        }

        result.push({
          box: {
            appId,
            name: bytesCodec.decode(getValue(b, 'n') as string | Uint8Array | undefined, format),
          },
        })
        continue
      }
    }

    return result
  }

  protected isDefaultValue(value: unknown[]): boolean {
    return (value as unknown[]).length === 0
  }
}

const StateSchemaMeta: ModelMetadata = {
  name: 'StateSchema',
  kind: 'object',
  fields: [
    { name: 'numUints', wireKey: 'nui', optional: false, nullable: false, codec: numberCodec },
    { name: 'numByteSlices', wireKey: 'nbs', optional: false, nullable: false, codec: numberCodec },
  ],
}

/**
 * Codec for StateSchema that omits empty objects (both fields are 0)
 * This matches the behavior of the old manual encoder which used OmitEmptyObjectCodec
 */
class StateSchemaCodec extends Codec<StateSchema, StateSchemaDto> {
  private modelCodec = new ModelCodec(StateSchemaMeta)

  public defaultValue(): StateSchema {
    return {
      numUints: 0,
      numByteSlices: 0,
    }
  }

  protected isDefaultValue(value: StateSchema): boolean {
    // Omit if both fields are 0 (empty/default state)
    return value.numUints === 0 && value.numByteSlices === 0
  }

  protected toEncoded(value: StateSchema, format: BodyFormat): Record<string, unknown> {
    return this.modelCodec.encode(value, format) as StateSchemaDto
  }

  protected fromEncoded(value: StateSchemaDto, format: BodyFormat): StateSchema {
    return this.modelCodec.decode(value, format) as StateSchema
  }
}

const stateSchemaCodec = new StateSchemaCodec()

const AppCallTransactionFieldsMeta: ModelMetadata = {
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
      codec: stateSchemaCodec, // Use codec that omits empty schemas
    },
    {
      name: 'localStateSchema',
      wireKey: 'apls',
      optional: true,
      nullable: false,
      codec: stateSchemaCodec, // Use codec that omits empty schemas
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

const HashFactoryMeta: ModelMetadata = {
  name: 'HashFactory',
  kind: 'object',
  fields: [{ name: 'hashType', wireKey: 't', optional: false, nullable: false, codec: numberCodec }],
}

const MerkleArrayProofMeta: ModelMetadata = {
  name: 'MerkleArrayProof',
  kind: 'object',
  fields: [
    { name: 'path', wireKey: 'pth', optional: false, nullable: false, codec: bytesArrayCodec },
    { name: 'hashFactory', wireKey: 'hsh', optional: false, nullable: false, codec: new ModelCodec(HashFactoryMeta) },
    { name: 'treeDepth', wireKey: 'td', optional: false, nullable: false, codec: numberCodec },
  ],
}

const FalconVerifierMeta: ModelMetadata = {
  name: 'FalconVerifier',
  kind: 'object',
  fields: [{ name: 'publicKey', wireKey: 'k', optional: false, nullable: false, codec: fixedBytes1793Codec }],
}

const FalconSignatureStructMeta: ModelMetadata = {
  name: 'FalconSignatureStruct',
  kind: 'object',
  fields: [
    { name: 'signature', wireKey: 'sig', optional: false, nullable: false, codec: bytesCodec },
    { name: 'vectorCommitmentIndex', wireKey: 'idx', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'proof', wireKey: 'prf', optional: false, nullable: false, codec: new ModelCodec(MerkleArrayProofMeta) },
    { name: 'verifyingKey', wireKey: 'vkey', optional: false, nullable: false, codec: new ModelCodec(FalconVerifierMeta) },
  ],
}

const SigslotCommitMeta: ModelMetadata = {
  name: 'SigslotCommit',
  kind: 'object',
  fields: [
    { name: 'sig', wireKey: 's', optional: false, nullable: false, codec: new ModelCodec(FalconSignatureStructMeta) },
    { name: 'lowerSigWeight', wireKey: 'l', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

const MerkleSignatureVerifierMeta: ModelMetadata = {
  name: 'MerkleSignatureVerifier',
  kind: 'object',
  fields: [
    { name: 'commitment', wireKey: 'cmt', optional: false, nullable: false, codec: fixedBytes64Codec },
    { name: 'keyLifetime', wireKey: 'lf', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

const ParticipantMeta: ModelMetadata = {
  name: 'Participant',
  kind: 'object',
  fields: [
    { name: 'verifier', wireKey: 'p', optional: false, nullable: false, codec: new ModelCodec(MerkleSignatureVerifierMeta) },
    { name: 'weight', wireKey: 'w', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

/**
 * Custom codec for Reveal structure (containing position, sigslot, and participant)
 * The wire format uses a Map with position as key
 */
class RevealCodec extends Codec<Record<string, unknown>, Record<string, unknown>> {
  public defaultValue(): Record<string, unknown> {
    return { position: 0n, sigslot: {}, participant: {} }
  }

  protected toEncoded(value: Record<string, unknown>, format: BodyFormat): Record<string, unknown> {
    return {
      s: ModelSerializer.encode(value.sigslot as object, SigslotCommitMeta, format),
      p: ModelSerializer.encode(value.participant as object, ParticipantMeta, format),
    }
  }

  protected fromEncoded(value: Record<string, unknown>, format: BodyFormat): Record<string, unknown> {
    return {
      position: 0n, // Position is set separately when used in StateProofRevealsCodec
      sigslot: ModelSerializer.decode(getValue(value, 's'), SigslotCommitMeta, format),
      participant: ModelSerializer.decode(getValue(value, 'p'), ParticipantMeta, format),
    }
  }

  protected isDefaultValue(_value: Record<string, unknown>): boolean {
    return false
  }
}

export const revealCodec = new RevealCodec()

/**
 * Custom codec for StateProof reveals Map
 * Wire format: Map<bigint, { s: SigslotCommit, p: Participant }>
 * App format: Reveal[]
 */
class StateProofRevealsCodec extends Codec<unknown[], Map<bigint, Record<string, unknown>>> {
  public defaultValue(): unknown[] {
    return []
  }

  protected toEncoded(reveals: unknown[], format: BodyFormat): Map<bigint, Record<string, unknown>> {
    const map = new Map<bigint, Record<string, unknown>>()
    for (const reveal of reveals as any[]) {
      const position = reveal.position
      const entry = revealCodec.encode(reveal, format)
      if (entry) {
        map.set(position, entry)
      }
    }
    return map
  }

  protected fromEncoded(revealsMap: Map<bigint, Record<string, unknown>>, format: BodyFormat): unknown[] {
    const reveals: unknown[] = []
    for (const [position, entry] of revealsMap.entries()) {
      const decoded = revealCodec.decode(entry, format)
      reveals.push({
        ...decoded,
        position: bigIntCodec.decode(position, format),
      })
    }
    return reveals
  }

  protected isDefaultValue(value: unknown[]): boolean {
    return (value as unknown[]).length === 0
  }
}

/**
 * Special codec for positions-to-reveal array
 * Must preserve array as-is without encoding individual bigints (they might be 0 or small values)
 */
class PositionsToRevealCodec extends Codec<bigint[], (bigint | number)[]> {
  public defaultValue(): bigint[] {
    return []
  }

  protected toEncoded(value: bigint[], _format: BodyFormat): (bigint | number)[] {
    // Pass through without encoding - preserve bigints even if they're 0
    return value
  }

  protected fromEncoded(value: (bigint | number)[], _format: BodyFormat): bigint[] {
    // Convert each element to bigint (msgpack may decode small values as numbers)
    if (!value) return []
    return value.map((v) => (typeof v === 'number' ? BigInt(v) : v))
  }

  protected isDefaultValue(value: bigint[]): boolean {
    return value.length === 0
  }
}

const StateProofMeta: ModelMetadata = {
  name: 'StateProof',
  kind: 'object',
  fields: [
    { name: 'sigCommit', wireKey: 'c', optional: false, nullable: false, codec: bytesCodec },
    { name: 'signedWeight', wireKey: 'w', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'sigProofs', wireKey: 'S', optional: false, nullable: false, codec: new ModelCodec(MerkleArrayProofMeta) },
    { name: 'partProofs', wireKey: 'P', optional: false, nullable: false, codec: new ModelCodec(MerkleArrayProofMeta) },
    { name: 'merkleSignatureSaltVersion', wireKey: 'v', optional: false, nullable: false, codec: numberCodec },
    { name: 'reveals', wireKey: 'r', optional: false, nullable: false, codec: new StateProofRevealsCodec() },
    { name: 'positionsToReveal', wireKey: 'pr', optional: false, nullable: false, codec: new PositionsToRevealCodec() },
  ],
}

const StateProofMessageMeta: ModelMetadata = {
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

const StateProofTransactionFieldsMeta: ModelMetadata = {
  name: 'StateProofTransactionFields',
  kind: 'object',
  fields: [
    { name: 'stateProofType', wireKey: 'sptype', optional: false, nullable: false, codec: numberCodec },
    { name: 'stateProof', wireKey: 'sp', optional: true, nullable: false, codec: new ModelCodec(StateProofMeta) },
    { name: 'message', wireKey: 'spmsg', optional: true, nullable: false, codec: new ModelCodec(StateProofMessageMeta) },
  ],
}

const HeartbeatProofMeta: ModelMetadata = {
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
export const HeartbeatTransactionFieldsMeta: ModelMetadata = {
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

export const TransactionMeta: ModelMetadata = {
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
      codec: assetConfigCodec,
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
