import { AlgodApi, PendingTransactionResponse, RequestContext, SecurityAuthentication } from '@algorand/algod-client'
import { addressFromString, Transaction as AlgokitCoreTransaction, encodeTransactionRaw } from 'algokit_transact'
import algosdk, { Address, TokenHeader } from 'algosdk'
import { toNumber } from '../util'

function getAlgokitCoreAddress(address: string | Address) {
  return addressFromString(typeof address === 'string' ? address : address.toString())
}

// Experimental feature to build algosdk payment transactions with algokit-core
export function buildPayment({
  sender,
  receiver,
  amount,
  closeRemainderTo,
  rekeyTo,
  note,
  lease,
  suggestedParams,
}: algosdk.PaymentTransactionParams & algosdk.CommonTransactionParams) {
  const txnModel: AlgokitCoreTransaction = {
    header: {
      sender: getAlgokitCoreAddress(sender),
      transactionType: 'Payment',
      fee: BigInt(suggestedParams.fee),
      firstValid: BigInt(suggestedParams.firstValid),
      lastValid: BigInt(suggestedParams.lastValid),
      genesisHash: suggestedParams.genesisHash,
      genesisId: suggestedParams.genesisID,
      rekeyTo: rekeyTo ? getAlgokitCoreAddress(rekeyTo) : undefined,
      note: note,
      lease: lease,
    },
    payFields: {
      amount: BigInt(amount),
      receiver: getAlgokitCoreAddress(receiver),
      closeRemainderTo: closeRemainderTo ? getAlgokitCoreAddress(closeRemainderTo) : undefined,
    },
  }

  let fee = BigInt(suggestedParams.fee)
  if (!suggestedParams.flatFee) {
    const minFee = BigInt(suggestedParams.minFee)
    const numAddlBytesAfterSigning = 75
    const estimateTxnSize = encodeTransactionRaw(txnModel).length + numAddlBytesAfterSigning

    fee *= BigInt(estimateTxnSize)
    // If suggested fee too small and will be rejected, set to min tx fee
    if (fee < minFee) {
      fee = minFee
    }
  }
  txnModel.header.fee = fee

  return algosdk.decodeUnsignedTransaction(encodeTransactionRaw(txnModel))
}

export class TokenHeaderAuthenticationMethod implements SecurityAuthentication {
  private _header: string
  private _key: string

  public constructor(tokenHeader: TokenHeader) {
    const [header, key] = Object.entries(tokenHeader)[0]
    this._header = header
    this._key = key
  }

  public getName(): string {
    return 'custom_header'
  }

  public applySecurityAuthentication(context: RequestContext) {
    context.setHeaderParam(this._header, this._key)
  }
}

/**
 * Wait until the transaction is confirmed or rejected, or until `timeout`
 * number of rounds have passed.
 *
 * @param algod An AlgoKit core algod client
 * @param transactionId The transaction ID to wait for
 * @param maxRoundsToWait Maximum number of rounds to wait
 *
 * @return Pending transaction information
 * @throws Throws an error if the transaction is not confirmed or rejected in the next `timeout` rounds
 */
export const waitForConfirmation = async function (
  transactionId: string,
  maxRoundsToWait: number | bigint,
  algod: AlgodApi,
): Promise<PendingTransactionResponse> {
  if (maxRoundsToWait < 0) {
    throw new Error(`Invalid timeout, received ${maxRoundsToWait}, expected > 0`)
  }

  // Get current round
  const status = await algod.getStatus()
  if (status === undefined) {
    throw new Error('Unable to get node status')
  }

  // Loop for up to `timeout` rounds looking for a confirmed transaction
  const startRound = BigInt(status.lastRound) + 1n
  let currentRound = startRound
  while (currentRound < startRound + BigInt(maxRoundsToWait)) {
    try {
      const pendingInfo = await algod.pendingTransactionInformation(transactionId, 'msgpack')

      if (pendingInfo !== undefined) {
        const confirmedRound = pendingInfo.confirmedRound
        if (confirmedRound && confirmedRound > 0) {
          return pendingInfo
        } else {
          const poolError = pendingInfo.poolError
          if (poolError != null && poolError.length > 0) {
            // If there was a pool error, then the transaction has been rejected!
            throw new Error(`Transaction ${transactionId} was rejected; pool error: ${poolError}`)
          }
        }
      }
    } catch (e: unknown) {
      if ((e as Error).name === 'URLTokenBaseHTTPError') {
        currentRound++
        continue
      }
    }

    await algod.waitForBlock(toNumber(currentRound))
    currentRound++
  }

  throw new Error(`Transaction ${transactionId} not confirmed after ${maxRoundsToWait} rounds`)
}
