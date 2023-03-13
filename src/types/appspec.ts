import type algosdk from 'algosdk'
import { ABIMethod } from 'algosdk'

export interface AppSpec {
  hints: HintSpec
  schema: SchemaSpec
  source: AppSources
  contract: algosdk.ABIContract
  state: StateSchemaSpec
  bare_call_config: {
    no_op?: CallConfigValue
    opt_in?: CallConfigValue
    close_out?: CallConfigValue
    clear_state?: CallConfigValue
    update_application?: CallConfigValue
    delete_application?: CallConfigValue
  }
}

export type HintSpec = Record<string, Hint>

export interface AppSources {
  approval: string
  clear: string
}

export type CallConfigValue = 'NEVER' | 'CALL' | 'CREATE' | 'ALL'

export interface Hint {
  structs: Record<string, Struct>
  readonly: boolean
  default_arguments: Record<string, DefaultArgument>
  call_config: {
    no_op?: CallConfigValue
    opt_in?: CallConfigValue
    close_out?: CallConfigValue
    clear_state?: CallConfigValue
    update_application?: CallConfigValue
    delete_application?: CallConfigValue
  }
}

type StructElement = [string, string]
export interface Struct {
  name: string
  elements: StructElement[]
}

export interface DefaultArgument {
  source: string
  data: string | bigint | number
}

export enum AVMType {
  uint64,
  bytes,
}
export interface DeclaredSchemaValueSpec {
  type: AVMType
  key: string
  desc: string
  static: boolean
}

export interface ReservedSchemaValueSpec {
  type: AVMType
  desc: string
  max_keys: number
}

export interface SchemaSpec {
  local: Schema
  global: Schema
}

export interface Schema {
  declared: Record<string, DeclaredSchemaValueSpec>
  reserved: Record<string, ReservedSchemaValueSpec>
}

export interface StateSchemaSpec {
  global: StateSchema
  local: StateSchema
}

export type StateSchema = {
  num_uints: number
  num_byte_slices: number
}

export const getABISignature = (method: ABIMethod) => {
  const argSignature = method.args.map((a) => a.type).join(',')
  const returnSignature = method.returns.type
  return `{${method.name}}(${argSignature})${returnSignature}`
}
