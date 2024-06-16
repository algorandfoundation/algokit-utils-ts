const DISPENSER_BASE_URL = 'https://api.dispenser.algorandfoundation.tools'
const DEFAULT_DISPENSER_REQUEST_TIMEOUT = 15
const DISPENSER_ACCESS_TOKEN_KEY = 'ALGOKIT_DISPENSER_ACCESS_TOKEN'

enum DispenserAssetName {
  Algo = 0,
}

const dispenserAssets = {
  [DispenserAssetName.Algo]: {
    assetId: 0,
    decimals: 6,
    description: 'Algo',
  },
}

export interface DispenserFundResponse {
  txId: string
  amount: number
}

export interface DispenserLimitResponse {
  amount: number
}

export interface TestNetDispenserApiClientParams {
  authToken: string
  requestTimeout?: number
}

/**
 * `TestNetDispenserApiClient` is a class that provides methods to interact with the [Algorand TestNet Dispenser API](https://github.com/algorandfoundation/algokit/blob/main/docs/testnet_api.md).
 * It allows you to fund an address with Algos, refund a transaction, and get the funding limit for the Algo asset.
 *
 * The class requires an authentication token and a request timeout to be initialized. The authentication token can be provided
 * either directly as a parameter or through an `ALGOKIT_DISPENSER_ACCESS_TOKEN` environment variable. If neither is provided, an error is thrown.
 *
 * The request timeout can be provided as a parameter. If not provided, a default value is used.
 *
 * @property {string} authToken - The authentication token used for API requests.
 * @property {number} requestTimeout - The timeout for API requests, in seconds.
 *
 * @method fund - Sends a funding request to the dispenser API to fund the specified address with the given amount of Algo.
 * @method refund - Sends a refund request to the dispenser API for the specified refundTxnId.
 * @method limit - Sends a request to the dispenser API to get the funding limit for the Algo asset.
 *
 * @example
 * ```typescript
 * const client = new TestNetDispenserApiClient({ authToken: 'your_auth_token', requestTimeout: 30 });
 * const fundResponse = await client.fund('your_address', 100);
 * const limitResponse = await client.getLimit();
 * await client.refund('your_transaction_id');
 * ```
 *
 * @throws {Error} If neither the environment variable 'ALGOKIT_DISPENSER_ACCESS_TOKEN' nor the authToken parameter were provided.
 */
export class TestNetDispenserApiClient {
  private _authToken: string
  private _requestTimeout: number

  constructor(params?: TestNetDispenserApiClientParams) {
    const authTokenFromEnv = process?.env?.[DISPENSER_ACCESS_TOKEN_KEY]

    if (params?.authToken) {
      this._authToken = params.authToken
    } else if (authTokenFromEnv) {
      this._authToken = authTokenFromEnv
    } else {
      throw new Error(
        `Can't init AlgoKit TestNet Dispenser API client because neither environment variable ${DISPENSER_ACCESS_TOKEN_KEY} or the authToken were provided.`,
      )
    }

    this._requestTimeout = params?.requestTimeout || DEFAULT_DISPENSER_REQUEST_TIMEOUT
  }

  get authToken(): string {
    return this._authToken
  }

  get requestTimeout(): number {
    return this._requestTimeout
  }

  /**
   * Processes a dispenser API request.
   *
   * @param authToken - The authentication token.
   * @param urlSuffix - The URL suffix for the API request.
   * @param body - The request body.
   * @param method - The HTTP method.
   *
   * @returns The API response.
   */
  private async processDispenserRequest(
    authToken: string,
    urlSuffix: string,
    body: Record<string, string | number> | null = null,
    method = 'POST',
  ): Promise<Response> {
    const headers = { Authorization: `Bearer ${authToken}` }

    const requestArgs: RequestInit = {
      method: method,
      headers: headers,
      signal: AbortSignal.timeout(this.requestTimeout * 1000),
    }

    if (body) {
      requestArgs.body = JSON.stringify(body)
    }

    const response = await fetch(`${DISPENSER_BASE_URL}/${urlSuffix}`, requestArgs)
    if (!response.ok) {
      let error_message = `Error processing dispenser API request: ${response.status}`
      let error_response = null
      try {
        error_response = await response.json()
      } catch (err) {
        // suppress exception
      }

      if (error_response && error_response.code) {
        error_message = error_response.code
      } else if (response.status === 400) {
        error_message = (await response.json()).message
      }

      throw new Error(error_message)
    }
    return response
  }

  /**
   * Sends a funding request to the dispenser API to fund the specified address with the given amount of Algo.
   *
   * @param address - The address to fund.
   * @param amount - The amount of microAlgos to fund.
   *
   * @returns DispenserFundResponse: An object containing the transaction ID and funded amount.
   */
  async fund(address: string, amount: number): Promise<DispenserFundResponse> {
    const response = await this.processDispenserRequest(
      this.authToken,
      `fund/${dispenserAssets[DispenserAssetName.Algo].assetId}`,
      { receiver: address, amount: amount, assetID: dispenserAssets[DispenserAssetName.Algo].assetId },
      'POST',
    )

    const content = await response.json()
    return { txId: content.txID, amount: content.amount }
  }

  /**
   * Sends a refund request to the dispenser API for the specified refundTxnId.
   *
   * @param refundTxnId - The transaction ID to refund.
   */
  async refund(refundTxnId: string): Promise<void> {
    await this.processDispenserRequest(this.authToken, 'refund', { refundTransactionID: refundTxnId }, 'POST')
  }

  /**
   * Sends a request to the dispenser API to get the funding limit for the Algo asset.
   *
   * @returns DispenserLimitResponse: An object containing the funding limit amount.
   */
  async getLimit(): Promise<DispenserLimitResponse> {
    const response = await this.processDispenserRequest(
      this.authToken,
      `fund/${dispenserAssets[DispenserAssetName.Algo].assetId}/limit`,
      null,
      'GET',
    )
    const content = await response.json()

    return { amount: content.amount }
  }
}
