import { readFile } from 'fs/promises'
import path from 'path'
import { encodeTransactionNote, replaceDeployTimeControlParams } from '../../../src'
import { APP_DEPLOY_NOTE_DAPP, AppDeployMetadata, OnSchemaBreak, OnUpdate } from '../../../src/types/app'
import { AppSpec } from '../../../src/types/app-spec'
import { Arc2TransactionNote, SendTransactionFrom } from '../../../src/types/transaction'

export const getTestingAppContract = async () => {
  const appSpecFile = await readFile(path.join(__dirname, 'application.json'), 'utf-8')
  const appSpec = JSON.parse(appSpecFile) as AppSpec

  return {
    appSpec,
    approvalProgram: Buffer.from(appSpec.source.approval, 'base64').toString('utf-8'),
    clearStateProgram: Buffer.from(appSpec.source.clear, 'base64').toString('utf-8'),
    stateSchema: {
      globalByteSlices: appSpec.state.global.num_byte_slices,
      globalInts: appSpec.state.global.num_uints,
      localByteSlices: appSpec.state.local.num_byte_slices,
      localInts: appSpec.state.local.num_byte_slices,
    },
  }
}

export const getTestingAppCreateParams = async (from: SendTransactionFrom, metadata: AppDeployMetadata) => {
  const contract = await getTestingAppContract()
  return {
    from: from,
    approvalProgram: replaceDeployTimeControlParams(contract.approvalProgram, metadata).replace('TMPL_VALUE', '1'),
    clearStateProgram: contract.clearStateProgram,
    schema: contract.stateSchema,
    note: encodeTransactionNote({
      dAppName: APP_DEPLOY_NOTE_DAPP,
      data: metadata,
      format: 'j',
    } as Arc2TransactionNote),
  }
}

export const getTestingAppDeployParams = async (deployment: {
  from: SendTransactionFrom
  metadata: AppDeployMetadata
  codeInjectionValue?: number
  onSchemaBreak?: 'replace' | 'fail' | 'append' | OnSchemaBreak
  onUpdate?: 'update' | 'replace' | 'fail' | 'append' | OnUpdate
  breakSchema?: boolean
}) => {
  const contract = await getTestingAppContract()
  return {
    approvalProgram: contract.approvalProgram,
    clearStateProgram: contract.clearStateProgram,
    from: deployment.from,
    metadata: deployment.metadata,
    schema: deployment.breakSchema
      ? {
          ...contract.stateSchema,
          globalByteSlices: contract.stateSchema.globalByteSlices + 1,
        }
      : contract.stateSchema,
    deployTimeParams: {
      VALUE: deployment.codeInjectionValue ?? 1,
    },
    onSchemaBreak: deployment.onSchemaBreak,
    onUpdate: deployment.onUpdate,
  }
}
