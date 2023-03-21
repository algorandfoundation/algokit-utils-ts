import { readFile } from 'fs/promises'
import path from 'path'
import { encodeTransactionNote, replaceDeployTimeControlParams } from '../../../src'
import { AppDeployMetadata, APP_DEPLOY_NOTE_DAPP, OnSchemaBreak, OnUpdate } from '../../../src/types/app'
import { AppSpec } from '../../../src/types/appspec'
import { Arc2TransactionNote, SendTransactionFrom } from '../../../src/types/transaction'

export const getBareCallContractData = async () => {
  const appSpecFile = await readFile(path.join(__dirname, 'application.json'))
  const appSpec = JSON.parse(await appSpecFile.toString('utf-8')) as AppSpec

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

export const getBareCallContractCreateParams = async (from: SendTransactionFrom, metadata: AppDeployMetadata) => {
  const contract = await getBareCallContractData()
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

export const getBareCallContractDeployParams = async (deployment: {
  from: SendTransactionFrom
  metadata: AppDeployMetadata
  codeInjectionValue?: number
  onSchemaBreak?: 'replace' | 'fail' | OnSchemaBreak
  onUpdate?: 'update' | 'replace' | 'fail' | OnUpdate
  breakSchema?: boolean
}) => {
  const contract = await getBareCallContractData()
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
    deployTimeParameters: {
      VALUE: deployment.codeInjectionValue ?? 1,
    },
    onSchemaBreak: deployment.onSchemaBreak,
    onUpdate: deployment.onUpdate,
  }
}
