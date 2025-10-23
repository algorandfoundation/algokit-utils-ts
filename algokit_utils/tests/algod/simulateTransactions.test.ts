import { expect, it, describe } from 'vitest'
import { AlgodClient, ClientConfig, SimulateRequest } from '@algorandfoundation/algod-client'
import { TransactionType, type SignedTransaction, type Transaction } from '@algorandfoundation/algokit-transact'
import { getAlgodEnv, getSenderAccount, groupTransactions, signTransaction } from './helpers'

describe('simulateTransactions', () => {
  it('should simulate two transactions and decode msgpack response', async () => {
    const env = getAlgodEnv()
    const client = new AlgodClient({
      baseUrl: env.algodBaseUrl,
      apiToken: env.algodApiToken,
    } as ClientConfig)
    const acct = await getSenderAccount()
    const sp = await client.transactionParams()

    const sender = acct.address
    const fee = sp.minFee
    const firstValid = sp.lastRound
    const lastValid = sp.lastRound + 1000n
    const genesisHash = sp.genesisHash
    const genesisId = sp.genesisId

    const unsignedGroup: Transaction[] = [
      {
        transactionType: TransactionType.Payment,
        sender,
        fee,
        firstValid,
        lastValid,
        genesisHash,
        genesisId,
        payment: {
          receiver: sender,
          amount: 100000n, // 0.1 ALGO
        },
      },
      {
        transactionType: TransactionType.Payment,
        sender,
        fee,
        firstValid,
        lastValid,
        genesisHash,
        genesisId,
        note: new TextEncoder().encode('0aa50d27-b8f7-4d77-a1fb-551fd55df2bc'),
        payment: {
          receiver: sender,
          amount: 100000n, // 0.1 ALGO
        },
      },
    ]

    const [groupedTxn1, groupedTxn2] = groupTransactions(unsignedGroup)
    const signedTxns: SignedTransaction[] = []
    for (const gtx of [groupedTxn1, groupedTxn2]) {
      const signed = await signTransaction(gtx, acct.secretKey)
      signedTxns.push(signed)
    }

    // Create simulate request matching Rust structure
    const simulateRequest: SimulateRequest = {
      txnGroups: [
        {
          txns: signedTxns,
        },
      ],
      allowEmptySignatures: true,
      allowMoreLogging: true,
      allowUnnamedResources: true,
      extraOpcodeBudget: 1000n,
      execTraceConfig: {
        enable: true,
        stackChange: true,
        scratchChange: true,
        stateChange: true,
      },
      fixSigners: true,
    }

    // Try msgpack format (default and generally more reliable)
    const res = await client.simulateTransaction({ format: 'msgpack', body: simulateRequest })

    expect(res.txnGroups).toBeDefined()
    expect(res.txnGroups.length).toBe(1)
    expect(res.txnGroups[0].txnResults.length).toBe(2)

    // Both transactions should have succeeded
    for (const result of res.txnGroups[0].txnResults) {
      expect(result.txnResult).toBeDefined()
    }
  }, 20000)
})
