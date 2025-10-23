import { expect, it, describe } from 'vitest'
import { AlgodClient, PendingTransactionResponse } from '@algorandfoundation/algod-client'
import { encodeSignedTransaction, getTransactionId, TransactionType, type Transaction } from '@algorandfoundation/algokit-transact'
import { getAlgodEnv, getSenderAccount, signTransaction } from './helpers'

describe('Algod pendingTransaction', () => {
  it('submits a payment tx and queries pending info', async () => {
    const env = getAlgodEnv()
    const client = new AlgodClient({
      baseUrl: env.algodBaseUrl,
      apiToken: env.algodApiToken,
    })
    const acct = await getSenderAccount()
    const sp = await client.transactionParams()

    const senderAddress = acct.address
    const transaction: Transaction = {
      transactionType: TransactionType.Payment,
      sender: senderAddress,
      fee: BigInt(sp['minFee']), // flat fee
      firstValid: BigInt(sp['lastRound']),
      lastValid: BigInt(sp['lastRound']) + 1000n,
      genesisHash: sp['genesisHash'] as Uint8Array,
      genesisId: sp['genesisId'] as string,
      payment: {
        receiver: senderAddress,
        amount: 0n,
      },
    }

    const signedTransaction = await signTransaction(transaction, acct.secretKey)
    const signedBytes = encodeSignedTransaction(signedTransaction)
    const sendResult = await client.rawTransaction({ body: signedBytes })
    const txId = getTransactionId(transaction)
    expect(sendResult.txId).toBe(txId)

    let pending: PendingTransactionResponse | undefined
    const maxAttempts = 10
    for (let i = 0; i < maxAttempts; i++) {
      pending = await client.pendingTransactionInformation(txId)
      if (pending?.confirmedRound || pending?.poolError) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    if (!pending) {
      throw new Error('Transaction confirmation timeout')
    }

    expect(pending).toHaveProperty('txn')
  }, 30_000)
})
