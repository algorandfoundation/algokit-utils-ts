import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
import { TestNetDispenserApiClient } from './dispenser-client'
enableFetchMocks()

describe('TestNetDispenserApiClient', () => {
  const env = process.env

  beforeEach(async () => {
    jest.resetModules()
    process.env = { ...env }
  })

  afterEach(() => {
    process.env = env
  })
  it('should fund account with algos with auth token', async () => {
    const mockResponse = { txID: 'dummy_tx_id', amount: 1 }
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

    const dispenserClient = new TestNetDispenserApiClient({ authToken: 'dummy_auth_token' })
    const address = 'dummy_address'
    const amount = 1

    const response = await dispenserClient.fund(address, amount)
    expect(response.txId).toEqual('dummy_tx_id')
    expect(response.amount).toEqual(1)
  })

  it('should register refund with auth token', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}))

    const dispenserClient = new TestNetDispenserApiClient({ authToken: 'dummy_auth_token' })
    const refundTxnId = 'dummy_txn_id'

    await dispenserClient.refund(refundTxnId)
    expect(fetchMock.mock.calls.length).toEqual(1)
    const methodArgs = fetchMock.mock.calls[0]
    expect(methodArgs.length).toEqual(2)
    const requestParams = methodArgs[1]
    expect(requestParams?.method).toEqual('POST')
    expect((requestParams?.headers as Record<string, string>)?.Authorization).toEqual(`Bearer ${dispenserClient.authToken}`)
    expect(JSON.parse(requestParams?.body as string)).toEqual({ refundTransactionID: refundTxnId })
  })

  it('should get limit with auth token', async () => {
    const amount = 10000000
    const mockResponse = { amount: amount }
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

    const dispenserClient = new TestNetDispenserApiClient({ authToken: 'dummy_auth_token' })
    const response = await dispenserClient.getLimit()
    expect(response.amount).toEqual(amount)
  })

  it('should throw error when no auth token provided', () => {
    expect(() => new TestNetDispenserApiClient()).toThrow()
  })

  it('should init with environment variable', () => {
    process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN = 'dummy_token'
    const client = new TestNetDispenserApiClient()
    expect(client.authToken).toEqual('dummy_token')
  })

  it('should init with argument over environment variable', () => {
    process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN = 'dummy_token'
    const client = new TestNetDispenserApiClient({ authToken: 'test_value_2' })
    expect(client.authToken).toEqual('test_value_2')
  })
})
