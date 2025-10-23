import sha512 from 'js-sha512'
import { getAppAddress } from '@algorandfoundation/algokit-common'
import { AlgodClient, TealKeyValueStore } from '@algorandfoundation/algod-client'
import { Buffer } from 'buffer'

export enum TealTemplateValueType {
  Int = 'int',
  Bytes = 'bytes',
  String = 'string',
}

export type TealTemplateValue = {
  type: TealTemplateValueType
  value: bigint | Uint8Array | string
}

export type TealTemplateParams = Record<string, TealTemplateValue>

export type DeploymentMetadata = {
  updatable?: boolean
  deletable?: boolean
}

export type CompiledTeal = {
  teal: string
  compiled: string
  compiledHash: string
  compiledBase64ToBytes: Uint8Array
  sourceMap?: Record<string, unknown>
}

export enum AppStateType {
  Uint = 'uint',
  Bytes = 'bytes',
}

export type UintAppState = {
  keyRaw: Uint8Array
  keyBase64: string
  value: bigint
}

export type BytesAppState = {
  keyRaw: Uint8Array
  keyBase64: string
  valueRaw: Uint8Array
  valueBase64: string
  value: string
}

export type AppState = UintAppState | BytesAppState

export type AppInformation = {
  appId: bigint
  appAddress: string
  approvalProgram: Uint8Array
  clearStateProgram: Uint8Array
  creator: string
  localInts: number
  localByteSlices: number
  globalInts: number
  globalByteSlices: number
  extraProgramPages?: number
  globalState: Record<string, AppState>
}

export type BoxName = {
  nameRaw: Uint8Array
  nameBase64: string
  name: string
}

export const UPDATABLE_TEMPLATE_NAME = 'TMPL_UPDATABLE'
export const DELETABLE_TEMPLATE_NAME = 'TMPL_DELETABLE'

export class AppManager {
  private algodClient: AlgodClient
  private compilationResults: Map<string, CompiledTeal>

  constructor(algodClient: AlgodClient) {
    this.algodClient = algodClient
    this.compilationResults = new Map()
  }

  private static hashTealCode(tealCode: string): string {
    return sha512.sha512_256.hex(tealCode)
  }

  async compileTeal(tealCode: string): Promise<CompiledTeal> {
    const cacheKey = AppManager.hashTealCode(tealCode)

    if (this.compilationResults.has(cacheKey)) {
      return this.compilationResults.get(cacheKey)!
    }

    const compileResponse = await this.algodClient.tealCompile({
      sourcemap: true,
      body: tealCode,
    })

    const result: CompiledTeal = {
      teal: tealCode,
      compiled: compileResponse.result,
      compiledHash: compileResponse.hash,
      compiledBase64ToBytes: Buffer.from(compileResponse.result, 'base64'),
      sourceMap: compileResponse.sourcemap,
    }

    this.compilationResults.set(cacheKey, result)
    return result
  }

  async compileTealTemplate(
    tealTemplateCode: string,
    templateParams?: TealTemplateParams,
    deploymentMetadata?: DeploymentMetadata,
  ): Promise<CompiledTeal> {
    let tealCode = AppManager.stripTealComments(tealTemplateCode)

    if (templateParams) {
      tealCode = AppManager.replaceTemplateVariables(tealCode, templateParams)
    }

    if (deploymentMetadata) {
      tealCode = AppManager.replaceTealTemplateDeployTimeControlParams(tealCode, deploymentMetadata)
    }

    return this.compileTeal(tealCode)
  }

  getCompilationResult(tealCode: string): CompiledTeal | undefined {
    const cacheKey = AppManager.hashTealCode(tealCode)
    return this.compilationResults.get(cacheKey)
  }

  async getById(appId: bigint): Promise<AppInformation> {
    const app = await this.algodClient.getApplicationById(appId)

    return {
      appId,
      appAddress: getAppAddress(appId),
      // TODO: this conversion from base64 encoded string to uint8array may happen inside the algod client
      approvalProgram: new Uint8Array(Buffer.from(app.params.approvalProgram, 'base64')),
      clearStateProgram: new Uint8Array(Buffer.from(app.params.clearStateProgram, 'base64')),
      creator: app.params.creator,
      localInts: Number(app.params.localStateSchema?.numUint ?? 0),
      localByteSlices: Number(app.params.localStateSchema?.numByteSlice ?? 0),
      globalInts: Number(app.params.globalStateSchema?.numUint ?? 0),
      globalByteSlices: Number(app.params.globalStateSchema?.numByteSlice ?? 0),
      extraProgramPages: Number(app.params.extraProgramPages ?? 0),
      globalState: AppManager.decodeAppState(app.params.globalState ?? []),
    }
  }

  async getGlobalState(appId: bigint): Promise<Record<string, AppState>> {
    const appInfo = await this.getById(appId)
    return appInfo.globalState
  }

  async getLocalState(appId: bigint, address: string): Promise<Record<string, AppState>> {
    const appInfo = await this.algodClient.accountApplicationInformation(address, appId)

    if (!appInfo.appLocalState?.keyValue) {
      throw new Error("Couldn't find local state")
    }

    return AppManager.decodeAppState(appInfo.appLocalState.keyValue)
  }

  async getBoxNames(appId: bigint): Promise<BoxName[]> {
    const boxResult = await this.algodClient.getApplicationBoxes(appId)
    return boxResult.boxes.map((b) => {
      return {
        nameRaw: new Uint8Array(Buffer.from(b.name)),
        nameBase64: b.name,
        name: Buffer.from(b.name).toString('utf-8'),
      }
    })
  }

  async getBoxValue(appId: bigint, boxName: Uint8Array): Promise<Uint8Array> {
    // Algod expects goal-arg style encoding for box name query param in 'encoding:value'.
    // However our HTTP client decodes base64 automatically into bytes for the Box model fields.
    // The API still requires 'b64:<base64>' for the query parameter value.
    const processedBoxName = `b64:${Buffer.from(boxName).toString('base64')}`

    const boxResult = await this.algodClient.getApplicationBoxByName(appId, {
      name: processedBoxName,
    })
    return new Uint8Array(Buffer.from(boxResult.value))
  }

  async getBoxValues(appId: bigint, boxNames: Uint8Array[]): Promise<Uint8Array[]> {
    const values: Uint8Array[] = []
    for (const boxName of boxNames) {
      values.push(await this.getBoxValue(appId, boxName))
    }
    return values
  }

  private static ensureDecodedBytes(bytes: Uint8Array): Uint8Array {
    try {
      const str = Buffer.from(bytes).toString('utf8')
      if (
        str.length > 0 &&
        /^[A-Za-z0-9+/]*={0,2}$/.test(str) &&
        (str.includes('=') || str.includes('+') || str.includes('/') || (str.length % 4 === 0 && str.length >= 8))
      ) {
        const decoded = Buffer.from(str, 'base64')
        if (!decoded.equals(Buffer.from(bytes))) {
          return new Uint8Array(decoded)
        }
      }
    } catch {
      // Not valid UTF-8 or base64, return as-is
    }
    return bytes
  }

  static decodeAppState(state: TealKeyValueStore): Record<string, AppState> {
    const stateValues: Record<string, AppState> = {}

    for (const stateVal of state) {
      const keyRaw = new Uint8Array(Buffer.from(stateVal.key, 'base64'))
      const keyBase64 = stateVal.key
      const keyString = Buffer.from(keyRaw).toString('base64')

      // TODO: we will need to update the algod client to return int here
      if (stateVal.value.type === 1n) {
        const valueRaw = AppManager.ensureDecodedBytes(new Uint8Array(Buffer.from(stateVal.value.bytes, 'base64')))
        const valueBase64 = Buffer.from(valueRaw).toString('base64')
        let valueStr: string
        try {
          valueStr = Buffer.from(valueRaw).toString('utf8')
        } catch {
          valueStr = Buffer.from(valueRaw).toString('hex')
        }

        const bytesState: BytesAppState = {
          keyRaw,
          keyBase64,
          valueRaw,
          valueBase64,
          value: valueStr,
        }
        stateValues[keyString] = bytesState
      } else if (stateVal.value.type === 2n) {
        const uintState: UintAppState = {
          keyRaw,
          keyBase64,
          value: BigInt(stateVal.value.uint),
        }
        stateValues[keyString] = uintState
      } else {
        throw new Error(`Unknown state data type: ${stateVal.value.type}`)
      }
    }

    return stateValues
  }

  static replaceTemplateVariables(program: string, templateValues: TealTemplateParams): string {
    let programLines = program.split('\n')

    for (const [templateVariableName, templateValue] of Object.entries(templateValues)) {
      const token = templateVariableName.startsWith('TMPL_') ? templateVariableName : `TMPL_${templateVariableName}`

      let value: string
      switch (templateValue.type) {
        case TealTemplateValueType.Int: {
          value = templateValue.value.toString()
          break
        }
        case TealTemplateValueType.String: {
          const strValue = templateValue.value as string
          if (/^\d+$/.test(strValue)) {
            value = strValue
          } else {
            value = `0x${Buffer.from(strValue, 'utf8').toString('hex')}`
          }
          break
        }
        case TealTemplateValueType.Bytes: {
          value = `0x${Buffer.from(templateValue.value as Uint8Array).toString('hex')}`
          break
        }
      }

      programLines = AppManager.replaceTemplateVariable(programLines, token, value)
    }

    return programLines.join('\n')
  }

  private static replaceTemplateVariable(programLines: string[], token: string, replacement: string): string[] {
    const result: string[] = []
    const tokenIndexOffset = replacement.length - token.length

    for (const line of programLines) {
      const commentIndex = AppManager.findUnquotedString(line, '//') ?? line.length
      let code = line.slice(0, commentIndex)
      const comment = line.slice(commentIndex)
      let trailingIndex = 0

      while (true) {
        const tokenIndex = AppManager.findTemplateToken(code, token, trailingIndex)
        if (tokenIndex === undefined) break

        trailingIndex = tokenIndex + token.length
        const prefix = code.slice(0, tokenIndex)
        const suffix = code.slice(trailingIndex)
        code = `${prefix}${replacement}${suffix}`
        trailingIndex = Math.max(0, trailingIndex + tokenIndexOffset)
      }

      result.push(`${code}${comment}`)
    }

    return result
  }

  private static findTemplateToken(line: string, token: string, startIndex: number): number | undefined {
    const endIndex = line.length
    let index = startIndex

    while (index < endIndex) {
      const tokenIndex = AppManager.findUnquotedString(line.slice(index), token)
      if (tokenIndex === undefined) break

      const actualTokenIndex = index + tokenIndex
      const trailingIndex = actualTokenIndex + token.length

      const validStart = actualTokenIndex === 0 || !AppManager.isValidTokenCharacter(line.charAt(actualTokenIndex - 1))
      const validEnd = trailingIndex >= line.length || !AppManager.isValidTokenCharacter(line.charAt(trailingIndex))

      if (validStart && validEnd) {
        return actualTokenIndex
      }
      index = trailingIndex
    }
    return undefined
  }

  private static isValidTokenCharacter(ch: string): boolean {
    return /[a-zA-Z0-9_]/.test(ch)
  }

  static replaceTealTemplateDeployTimeControlParams(tealTemplateCode: string, params: DeploymentMetadata): string {
    let result = tealTemplateCode

    if (params.updatable !== undefined) {
      if (!tealTemplateCode.includes(UPDATABLE_TEMPLATE_NAME)) {
        throw new Error(`Deploy-time updatability control requested, but ${UPDATABLE_TEMPLATE_NAME} not present in TEAL code`)
      }
      result = result.replace(new RegExp(UPDATABLE_TEMPLATE_NAME, 'g'), params.updatable ? '1' : '0')
    }

    if (params.deletable !== undefined) {
      if (!tealTemplateCode.includes(DELETABLE_TEMPLATE_NAME)) {
        throw new Error(`Deploy-time deletability control requested, but ${DELETABLE_TEMPLATE_NAME} not present in TEAL code`)
      }
      result = result.replace(new RegExp(DELETABLE_TEMPLATE_NAME, 'g'), params.deletable ? '1' : '0')
    }

    return result
  }

  static stripTealComments(tealCode: string): string {
    return tealCode
      .split('\n')
      .map((line) => {
        const commentPos = AppManager.findUnquotedString(line, '//')
        return commentPos !== undefined ? line.slice(0, commentPos).trimEnd() : line
      })
      .join('\n')
  }

  private static findUnquotedString(line: string, token: string): number | undefined {
    let inQuotes = false
    let inBase64 = false
    const chars = Array.from(line)
    let i = 0

    while (i < chars.length) {
      const char = chars[i]

      if (!inQuotes && (char === ' ' || char === '(') && AppManager.lastTokenBase64(line, i)) {
        inBase64 = true
      } else if (!inQuotes && (char === ' ' || char === ')') && inBase64) {
        inBase64 = false
      } else if (inQuotes && char === '\\') {
        i++
      } else if (char === '"') {
        inQuotes = !inQuotes
      } else if (!inQuotes && !inBase64) {
        if (i + token.length <= line.length && line.slice(i, i + token.length) === token) {
          return i
        }
      }
      i++
    }
    return undefined
  }

  private static lastTokenBase64(line: string, index: number): boolean {
    const tokens = line.slice(0, index).split(/\s+/)
    const lastToken = tokens[tokens.length - 1]
    return lastToken === 'base64' || lastToken === 'b64'
  }
}
