import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { ApplicationKvStorage } from './application-kv-storage'
import { ApplicationKvStorageMeta } from './application-kv-storage'

/**
 * An application's initial global/local/box states that were accessed during simulation.
 */
export type ApplicationInitialStates = {
  /**
   * Application index.
   */
  id: bigint

  /**
   * An application's initial local states tied to different accounts.
   */
  appLocals?: ApplicationKvStorage[]
  appGlobals?: ApplicationKvStorage
  appBoxes?: ApplicationKvStorage
}

export const ApplicationInitialStatesMeta: ObjectModelMetadata = {
  name: 'ApplicationInitialStates',
  kind: 'object',
  fields: [
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'appLocals',
      wireKey: 'app-locals',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(ApplicationKvStorageMeta)),
    },
    {
      name: 'appGlobals',
      wireKey: 'app-globals',
      optional: true,
      codec: new ObjectModelCodec(ApplicationKvStorageMeta),
    },
    {
      name: 'appBoxes',
      wireKey: 'app-boxes',
      optional: true,
      codec: new ObjectModelCodec(ApplicationKvStorageMeta),
    },
  ],
}
