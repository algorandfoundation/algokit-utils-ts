import type { ModelMetadata } from '../core/model-runtime'

export type TealDisassemble = {
  /**
   * disassembled Teal code
   */
  result: string
}

export const TealDisassembleMeta: ModelMetadata = {
  name: 'TealDisassemble',
  kind: 'object',
  fields: [
    {
      name: 'result',
      wireKey: 'result',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
