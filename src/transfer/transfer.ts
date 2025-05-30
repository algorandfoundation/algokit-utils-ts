import algosdk from 'algosdk'
import { legacySendTransactionBridge } from '../transaction/legacy-bridge'
import { encodeTransactionNote, getSenderAddress } from '../transaction/transaction'
import { AlgorandClient } from '../types/algorand-client'
import { TestNetDispenserApiClient } from '../types/dispenser-client'
import { SendTransactionResult } from '../types/transaction'
import { AlgoRekeyParams, EnsureFundedParams, EnsureFundedReturnType, TransferAssetParams } from '../types/transfer'
import Algodv2 = algosdk.Algodv2
import Kmd = algosdk.Kmd

/**
 * @deprecated Use `algorand.account.ensureFunded()` / `algorand.account.ensureFundedFromEnvironment()`
 * / `algorand.account.ensureFundedFromTestNetDispenserApi()` instead
 *
 * Funds a given account using a funding source such that it has a certain amount of Algo free to spend (accounting for Algo locked in minimum balance requirement).
 *
 * https://dev.algorand.co/concepts/smart-contracts/costs-constraints#mbr
 *
 * @param funding The funding configuration of type `EnsureFundedParams`, including the account to fund, minimum spending balance, and optional parameters. If you set `useDispenserApi` to true, you must also set `ALGOKIT_DISPENSER_ACCESS_TOKEN` in your environment variables.
 * @param algod An instance of the Algodv2 client.
 * @param kmd An optional instance of the Kmd client.
 * @returns
 * - `EnsureFundedReturnType` if funds were transferred.
 * - `undefined` if no funds were needed.
 */
export async function ensureFunded<T extends EnsureFundedParams>(
  funding: T,
  algod: Algodv2,
  kmd?: Kmd,
): Promise<EnsureFundedReturnType | undefined> {
  const algorand = AlgorandClient.fromClients({ algod, kmd })

  if (funding.fundingSource instanceof TestNetDispenserApiClient) {
    const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
      getSenderAddress(funding.accountToFund),
      funding.fundingSource,
      funding.minSpendingBalance,
      {
        minFundingIncrement: funding.minFundingIncrement,
      },
    )
    if (!result) return undefined
    return {
      amount: Number(result.amountFunded.microAlgo),
      transactionId: result.transactionId,
    }
  } else {
    const sender = funding.fundingSource ?? (await algorand.account.dispenserFromEnvironment())
    if (funding.fundingSource) {
      algorand.setSignerFromAccount(funding.fundingSource)
    }

    const result = await algorand.account.ensureFunded(
      getSenderAddress(funding.accountToFund),
      getSenderAddress(sender),
      funding.minSpendingBalance,
      {
        minFundingIncrement: funding.minFundingIncrement,
        note: encodeTransactionNote(funding.note),
        staticFee: funding.fee,
        lease: funding.lease,
        maxFee: funding.maxFee,
        maxRoundsToWaitForConfirmation: funding.maxRoundsToWaitForConfirmation,
        suppressLog: funding.suppressLog,
      },
    )

    return result
      ? {
          amount: Number(result.amountFunded.microAlgo),
          transactionId: result.txIds[0],
        }
      : undefined
  }
}

/**
 * @deprecated Use `algorand.send.assetTransfer()` / `algorand.createTransaction.assetTransfer()` instead
 *
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
  return legacySendTransactionBridge(
    algod,
    transfer.from,
    transfer,
    {
      assetId: BigInt(transfer.assetId),
      sender: getSenderAddress(transfer.from),
      receiver: getSenderAddress(transfer.to),
      clawbackTarget: transfer.clawbackFrom ? getSenderAddress(transfer.clawbackFrom) : undefined,
      amount: BigInt(transfer.amount),
      note: encodeTransactionNote(transfer.note),
      lease: transfer.lease,
    },
    (c) => c.assetTransfer,
    (c) => c.assetTransfer,
  )
}

/**
 * @deprecated Use `algorand.account.rekeyAccount()` instead
 *
 * Rekey an account to a new address.
 *
 * **Note:** Please be careful with this function and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).
 *
 * @param rekey The rekey definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 *
 * @example Usage example
 * ```typescript
 * await algokit.rekeyAccount({ from, rekeyTo }, algod)
 * ```
 */
export async function rekeyAccount(rekey: AlgoRekeyParams, algod: Algodv2): Promise<SendTransactionResult> {
  return legacySendTransactionBridge(
    algod,
    rekey.from,
    rekey,
    {
      sender: getSenderAddress(rekey.from),
      receiver: getSenderAddress(rekey.from),
      amount: (0).microAlgo(),
      rekeyTo: typeof rekey.rekeyTo === 'string' ? rekey.rekeyTo : getSenderAddress(rekey.rekeyTo),
      note: encodeTransactionNote(rekey.note),
      lease: rekey.lease,
    },
    (c) => c.payment,
    (c) => c.payment,
  )
}
