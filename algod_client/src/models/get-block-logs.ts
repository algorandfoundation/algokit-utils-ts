import type { ModelMetadata } from '../core/model-runtime'
import type { AppCallLogs } from './app-call-logs'
import { AppCallLogsMeta } from './app-call-logs'

export type GetBlockLogs = {
  logs: AppCallLogs[]
}

export const GetBlockLogsMeta: ModelMetadata = {
  name: 'GetBlockLogs',
  kind: 'object',
  fields: [
    {
      name: 'logs',
      wireKey: 'logs',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AppCallLogsMeta } },
    },
  ],
}
