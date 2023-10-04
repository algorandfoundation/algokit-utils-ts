import algosdk, { Algodv2, Kmd } from 'algosdk'
import { Config, getDispenserAccount, microAlgos } from './'
import { isTestNet } from './network-client'
import { encodeTransactionNote, getSenderAddress, getTransactionParams, sendTransaction } from './transaction'
import { AlgoAmount } from './types/amount'
import { DispenserApiTestnetClient } from './types/dispenser-client'
import { SendTransactionResult, TransactionNote } from './types/transaction'
import { AlgoTransferParams, EnsureFundedParams, EnsureFundedReturnType, TransferAssetParams } from './types/transfer'
import { calculateFundAmount } from './util'

async function fundUsingDispenserApi(
  dispenserClient: DispenserApiTestnetClient,
  addressToFund: string,
  fundAmount: number,
): Promise<EnsureFundedReturnType> {
  const response = await dispenserClient.fund(addressToFund, fundAmount)
  return { transactionId: response.txId, amount: response.amount }
}

async function fundUsingTransfer({
  algod,
  addressToFund,
  funding,
  fundAmount,
  transactionParams,
  sendParams,
  note,
  kmd,
}: {
  algod: Algodv2
  addressToFund: string
  funding: EnsureFundedParams
  fundAmount: number
  transactionParams: algosdk.SuggestedParams | undefined
  sendParams: {
    useDispenserApi?: boolean | undefined
    skipSending?: boolean | undefined
    skipWaiting?: boolean | undefined
    atc?: algosdk.AtomicTransactionComposer | undefined
    suppressLog?: boolean | undefined
    fee?: AlgoAmount | undefined
    maxFee?: AlgoAmount | undefined
    maxRoundsToWaitForConfirmation?: number | undefined
  }
  note: TransactionNote
  kmd?: Kmd
}): Promise<EnsureFundedReturnType> {
  if (funding.fundingSource instanceof DispenserApiTestnetClient) {
    throw new Error('Dispenser API client is not supported in this context.')
  }

  const from = funding.fundingSource ?? (await getDispenserAccount(algod, kmd))
  const amount = microAlgos(Math.max(fundAmount, funding.minFundingIncrement?.microAlgos ?? 0))
  const response = await transferAlgos(
    {
      from,
      to: addressToFund,
      note: note ?? 'Funding account to meet minimum requirement',
      amount: amount,
      transactionParams: transactionParams,
      ...sendParams,
    },
    algod,
  )

  return {
    transactionId: response.transaction.txID(),
    amount: Number(response.transaction.amount),
  }
}

/**
 * Transfer ALGOs between two accounts.
 * @param transfer The transfer definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 *
 * @example Usage example
 * ```typescript
 * await algokit.transferAlgos({ from, to, amount: algokit.algos(1) }, algod)
 * ```
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
 * @param funding The funding configuration of type `EnsureFundedParams`, including the account to fund, minimum spending balance, and optional parameters. If you set `useDispenserApi` to true, you must also set `ALGOKIT_DISPENSER_ACCESS_TOKEN` in your environment variables.
 * @param algod An instance of the Algodv2 client.
 * @param kmd An optional instance of the Kmd client.
 * @returns
 * - `SendTransactionResult` if funds were transferred.
 * - `SendDispenserTransactionResult` if `useDispenserApi` is set to true.
 * - `undefined` if no funds were needed.
 */
export async function ensureFunded<T extends EnsureFundedParams>(
  funding: T,
  algod: Algodv2,
  kmd?: Kmd,
): Promise<EnsureFundedReturnType | undefined> {
  const { accountToFund, fundingSource, minSpendingBalance, minFundingIncrement, transactionParams, note, ...sendParams } = funding

  const addressToFund = typeof accountToFund === 'string' ? accountToFund : getSenderAddress(accountToFund)

  const accountInfo = await algod.accountInformation(addressToFund).do()
  const balance = Number(accountInfo.amount)
  const minimumBalanceRequirement = microAlgos(Number(accountInfo['min-balance']))
  const currentSpendingBalance = microAlgos(balance - minimumBalanceRequirement.microAlgos)

  const fundAmount = calculateFundAmount(
    minSpendingBalance.microAlgos,
    currentSpendingBalance.microAlgos,
    minFundingIncrement?.microAlgos ?? 0,
  )

  if (fundAmount !== null) {
    if ((await isTestNet(algod)) && fundingSource instanceof DispenserApiTestnetClient) {
      return fundUsingDispenserApi(fundingSource, addressToFund, fundAmount) as Promise<EnsureFundedReturnType>
    } else {
      return fundUsingTransfer({
        algod,
        addressToFund,
        funding,
        fundAmount,
        transactionParams,
        sendParams,
        note,
        kmd,
      }) as Promise<EnsureFundedReturnType>
    }
  }

  return undefined
}

/**
 * Transfer asset between two accounts.
 * @param transfer The transfer definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 *
 * @example Usage example
 * ```typescript
 * await algokit.transferAsset({ from, to, assetId, amount }, algod)
 * ```
 */
export async function transferAsset(transfer: TransferAssetParams, algod: Algodv2): Promise<SendTransactionResult> {
  const { from, to, assetId, amount, transactionParams, clawbackFrom, note, ...sendParams } = transfer
  const transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: getSenderAddress(from),
    to: typeof to === 'string' ? to : getSenderAddress(to),
    closeRemainderTo: undefined,
    revocationTarget: clawbackFrom ? (typeof clawbackFrom === 'string' ? clawbackFrom : getSenderAddress(clawbackFrom)) : undefined,
    amount: amount,
    note: encodeTransactionNote(note),
    assetIndex: assetId,
    suggestedParams: await getTransactionParams(transactionParams, algod),
    rekeyTo: undefined,
  })

  if (!sendParams.skipSending) {
    Config.getLogger(sendParams.suppressLog).debug(
      `Transferring ASA (${assetId}) of amount ${amount} from ${getSenderAddress(from)} to ${to}`,
    )
  }

  return sendTransaction({ transaction, from, sendParams }, algod)
}
