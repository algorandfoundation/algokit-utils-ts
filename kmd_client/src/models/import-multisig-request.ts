import type { ModelMetadata } from '../core/model-runtime'
import type { PublicKey } from './public-key'
import { PublicKeyMeta } from './public-key'

/**
 * APIV1POSTMultisigImportRequest is the request for `POST /v1/multisig/import`
 */
export type ImportMultisigRequest = {
  multisigVersion?: bigint
  pks?: PublicKey[]
  threshold?: bigint
  walletHandleToken?: string
}

export const ImportMultisigRequestMeta: ModelMetadata = {
  name: 'ImportMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'multisigVersion',
      wireKey: 'multisig_version',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'pks',
      wireKey: 'pks',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => PublicKeyMeta } },
    },
    {
      name: 'threshold',
      wireKey: 'threshold',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
