import * as algosdk from '../../../src/sdk'
import { Address } from '../../../src/sdk'
import { readFile } from 'fs/promises'
import path from 'path'
import { encodeTransactionNote, replaceDeployTimeControlParams } from '../../../src'
import { APP_DEPLOY_NOTE_DAPP, AppDeployMetadata, OnSchemaBreak, OnUpdate } from '../../../src/types/app'
import { AppDeployParams } from '../../../src/types/app-deployer'
import { AppSpec } from '../../../src/types/app-spec'
import { AppCreateParams } from '../../../src/types/composer'
import { Arc2TransactionNote } from '../../../src/types/transaction'

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

export const getTestingAppCreateParams = async (from: algosdk.Account, metadata: AppDeployMetadata) => {
  const contract = await getTestingAppContract()
  return {
    sender: from.addr,
    approvalProgram: replaceDeployTimeControlParams(contract.approvalProgram, metadata).replace('TMPL_VALUE', '1'),
    clearStateProgram: contract.clearStateProgram,
    schema: contract.stateSchema,
    note: encodeTransactionNote({
      dAppName: APP_DEPLOY_NOTE_DAPP,
      data: metadata,
      format: 'j',
    } as Arc2TransactionNote),
  } satisfies AppCreateParams
}

export const getTestingAppDeployParams = async (deployment: {
  sender: Address | string
  metadata: AppDeployMetadata
  codeInjectionValue?: number
  onSchemaBreak?: 'replace' | 'fail' | 'append' | OnSchemaBreak
  onUpdate?: 'update' | 'replace' | 'fail' | 'append' | OnUpdate
  breakSchema?: boolean
}) => {
  const contract = await getTestingAppContract()
  return {
    createParams: {
      sender: deployment.sender,
      approvalProgram: contract.approvalProgram,
      clearStateProgram: contract.clearStateProgram,
      schema: deployment.breakSchema
        ? {
            ...contract.stateSchema,
            globalByteSlices: contract.stateSchema.globalByteSlices + 1,
          }
        : contract.stateSchema,
    },
    updateParams: {
      sender: deployment.sender,
    },
    deleteParams: {
      sender: deployment.sender,
    },
    metadata: deployment.metadata,
    deployTimeParams: {
      VALUE: deployment.codeInjectionValue ?? 1,
    },
    onSchemaBreak: deployment.onSchemaBreak,
    onUpdate: deployment.onUpdate,
  } satisfies AppDeployParams
}
