import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const ApplicationInitialStatesMeta: ModelMetadata = {
  name: 'ApplicationInitialStates',
  kind: 'object',
  fields: [
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'appLocals',
      wireKey: 'app-locals',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(ApplicationKvStorageMeta)),
    },
    {
      name: 'appGlobals',
      wireKey: 'app-globals',
      optional: true,
      nullable: false,
      codec: new ModelCodec(ApplicationKvStorageMeta),
    },
    {
      name: 'appBoxes',
      wireKey: 'app-boxes',
      optional: true,
      nullable: false,
      codec: new ModelCodec(ApplicationKvStorageMeta),
    },
  ],
}
