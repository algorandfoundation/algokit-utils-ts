/*import algosdk, { Algodv2, SuggestedParams } from 'algosdk'
import { createApp } from './app'
import { SendTransactionFrom } from './transaction'

interface ApplicationSpecification {
  name: string
  contract: any
}

interface File {
  name: string
  content: string
}

export class ApplicationClient {
  private client: Algodv2
  private appSpec: ApplicationSpecification
  private sender: SendTransactionFrom | undefined

  private _appId: number
  private _appAddress: string | undefined

  public get appId() {
    return this._appId
  }

  public get appAddress() {
    return this._appAddress
  }

  constructor(
    client: Algodv2,
    app: ApplicationSpecification | File | string,
    options?: {
      appId?: number
      sender?: SendTransactionFrom
      params?: SuggestedParams
    },
  ) {
    this.client = client
    this.appSpec =
      typeof app == 'string'
        ? (JSON.parse(app) as ApplicationSpecification)
        : 'contract' in app
        ? app
        : (JSON.parse(app.content) as ApplicationSpecification)

    this._appId = options?.appId ?? 0
    this._appAddress = options?.appId ? algosdk.getApplicationAddress(this._appId) : undefined
    this.sender = options?.sender
  }

  async create(create: { sender?: SendTransactionFrom }) {
    if (!create.sender && !this.sender) {
      throw new Error('No sender provided, unable to create account')
    }

    return createApp(
      {
        from: create?.sender ?? this.sender,
        approvalProgram: approval,
      },
      this.client,
    )
  }
}
*/
