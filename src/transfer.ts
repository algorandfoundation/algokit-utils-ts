import algosdk, { Algodv2 } from 'algosdk'
import { Config, microAlgos } from './'
import { encodeTransactionNote, getSenderAddress, getTransactionParams, sendTransaction } from './transaction'
import { SendTransactionResult } from './types/transaction'
import { AlgoTransferParams, EnsureFundedParams } from './types/transfer'

/**
 * Transfer ALGOs between two accounts.
 * @param transfer The transfer definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 */
export async function transferAlgos(transfer: AlgoTransferParams, algod: Algodv2): Promise<SendTransactionResult> {
  const { from, to, amount, note, transactionParams, ...sendParams } = transfer

  const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: getSenderAddress(from),
    to: to,
    amount: amount.microAlgos,
    note: encodeTransactionNote(note),
    suggestedParams: await getTransactionParams(transactionParams, algod),
    closeRemainderTo: undefined,
    rekeyTo: undefined,
  })

  if (!sendParams.skipSending) {
    Config.getLogger(sendParams.suppressLog).debug(`Transferring ${amount.microAlgos}µALGOs from ${getSenderAddress(from)} to ${to}`)
  }

  return sendTransaction({ transaction, from, sendParams }, algod)
}

/**
 * Funds a given account using a funding source such that it has a certain amount of algos free to spend (accounting for ALGOs locked in minimum balance requirement).
 *
 * @see https://developer.algorand.org/docs/get-details/accounts/#minimum-balance
 *
 * @param funding The funding configuration
 * @param client An algod client
 * @returns undefined if nothing was needed or the transaction send result
 */
export async function ensureFunded(funding: EnsureFundedParams, client: Algodv2): Promise<SendTransactionResult | undefined> {
  const { accountToFund, fundingSource, minSpendingBalance, minFundingIncrement, transactionParams, note, ...sendParams } = funding

  const addressToFund = typeof accountToFund === 'string' ? accountToFund : getSenderAddress(accountToFund)

  const accountInfo = await client.accountInformation(addressToFund).do()
  const balance = Number(accountInfo.amount)
  const minimumBalanceRequirement = microAlgos(Number(accountInfo['min-balance']))
  const currentSpendingBalance = microAlgos(balance - +minimumBalanceRequirement)

  if (minSpendingBalance > currentSpendingBalance) {
    const minFundAmount = microAlgos(+minSpendingBalance - +currentSpendingBalance)
    const fundAmount = microAlgos(Math.max(+minFundAmount, minFundingIncrement?.microAlgos ?? 0))
    Config.logger.info(
      `Funding ${addressToFund} ${fundAmount} from ${getSenderAddress(
        fundingSource,
      )} to reach minimum spend amount of ${minSpendingBalance} (balance = ${balance}, min_balance_req = ${minimumBalanceRequirement})`,
    )
    return await transferAlgos(
      {
        from: fundingSource,
        to: addressToFund,
        note: note ?? 'Funding account to meet minimum requirement',
        amount: fundAmount,
        transactionParams,
        ...sendParams,
      },
      client,
    )
  }

  return undefined
}
