import algosdk, { Account, Algodv2, Kmd, SuggestedParams } from 'algosdk'
import { Config, getDispenserAccount, microAlgos } from './'
import { encodeTransactionNote, getSenderAddress, getTransactionParams, sendTransaction } from './transaction'
import { SendTransactionFrom, SendTransactionParams, SendTransactionResult, TransactionNote } from './types/transaction'
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
    to: typeof to === 'string' ? to : getSenderAddress(to),
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
 * https://developer.algorand.org/docs/get-details/accounts/#minimum-balance
 *
 * @param funding The funding configuration
 * @param algod An algod client
 * @param kmd An optional kmd client
 * @returns undefined if nothing was needed or the transaction send result
 */
export async function ensureFunded(funding: EnsureFundedParams, algod: Algodv2, kmd?: Kmd): Promise<SendTransactionResult | undefined> {
  const { accountToFund, fundingSource, minSpendingBalance, minFundingIncrement, transactionParams, note, ...sendParams } = funding

  const addressToFund = typeof accountToFund === 'string' ? accountToFund : getSenderAddress(accountToFund)

  const accountInfo = await algod.accountInformation(addressToFund).do()
  const balance = Number(accountInfo.amount)
  const minimumBalanceRequirement = microAlgos(Number(accountInfo['min-balance']))
  const currentSpendingBalance = microAlgos(balance - minimumBalanceRequirement.microAlgos)

  if (minSpendingBalance > currentSpendingBalance) {
    const from = fundingSource ?? (await getDispenserAccount(algod, kmd))
    const minFundAmount = microAlgos(minSpendingBalance.microAlgos - currentSpendingBalance.microAlgos)
    const fundAmount = microAlgos(Math.max(minFundAmount.microAlgos, minFundingIncrement?.microAlgos ?? 0))
    Config.getLogger(sendParams.suppressLog).info(
      `Funding ${addressToFund} ${fundAmount} from ${getSenderAddress(
        from,
      )} to reach minimum spend amount of ${minSpendingBalance} (balance = ${balance}, min_balance_req = ${minimumBalanceRequirement})`,
    )
    return await transferAlgos(
      {
        from,
        to: addressToFund,
        note: note ?? 'Funding account to meet minimum requirement',
        amount: fundAmount,
        transactionParams,
        ...sendParams,
      },
      algod,
    )
  }

  return undefined
}

interface TransferAssetParams extends SendTransactionParams {
  senderAccount: SendTransactionFrom
  receiverAccount: Account
  assetId: number
  amount: number | bigint
  transactionParams?: SuggestedParams
  clawbackFrom?: SendTransactionFrom
  note?: TransactionNote
}

export async function transferAsset(
  { senderAccount, receiverAccount, assetId, amount, transactionParams, clawbackFrom, note, ...sendParams }: TransferAssetParams,
  algod: Algodv2,
) {
  const transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: getSenderAddress(senderAccount),
    to: receiverAccount.addr,
    closeRemainderTo: undefined,
    revocationTarget: clawbackFrom ? getSenderAddress(clawbackFrom) : undefined,
    amount: amount,
    note: encodeTransactionNote(note),
    assetIndex: assetId,
    suggestedParams: await getTransactionParams(transactionParams, algod),
    rekeyTo: undefined,
  })

  if (!sendParams.skipSending) {
    if (sendParams.maxFee === undefined) {
      sendParams.maxFee = (0.02).algos()
    }

    const result = await sendTransaction(
      {
        transaction: transaction,
        from: senderAccount,
        sendParams: sendParams,
      },
      algod,
    )

    Config.getLogger(sendParams.suppressLog).info(
      `Successfully transferred ${amount} of asset ${assetId} from ${getSenderAddress(senderAccount)} to ${receiverAccount}.`,
    )

    return result
  }

  return { transaction, confirmation: undefined }
}
