import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { addressCodec, bigIntCodec, bytesCodec } from '@algorandfoundation/algokit-common'
import type { BoxReference, HoldingReference, LocalsReference } from './app-call'

/**
 * Metadata for BoxReference
 *
 * Maps wire format (app, name) to BoxReference (appId, name)
 */
export const BoxReferenceMeta: ObjectModelMetadata<BoxReference> = {
  name: 'BoxReference',
  kind: 'object',
  fields: [
    { name: 'appId', wireKey: 'app', optional: false, codec: bigIntCodec },
    { name: 'name', wireKey: 'name', optional: false, codec: bytesCodec },
  ],
}

/**
 * Metadata for HoldingReference
 *
 * Maps wire format (account, asset) to HoldingReference (address, assetId)
 */
export const HoldingReferenceMeta: ObjectModelMetadata<HoldingReference> = {
  name: 'HoldingReference',
  kind: 'object',
  fields: [
    { name: 'address', wireKey: 'account', optional: false, codec: addressCodec },
    { name: 'assetId', wireKey: 'asset', optional: false, codec: bigIntCodec },
  ],
}

/**
 * Metadata for LocalsReference
 *
 * Maps wire format (account, app) to LocalsReference (address, appId)
 */
export const LocalsReferenceMeta: ObjectModelMetadata<LocalsReference> = {
  name: 'LocalsReference',
  kind: 'object',
  fields: [
    { name: 'address', wireKey: 'account', optional: false, codec: addressCodec },
    { name: 'appId', wireKey: 'app', optional: false, codec: bigIntCodec },
  ],
}
