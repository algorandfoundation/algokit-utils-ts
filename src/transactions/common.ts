import { PendingTransactionResponse, SuggestedParams } from '@algorandfoundation/algokit-algod-client'
import { Address, TransactionSigner } from '@algorandfoundation/sdk'
import { encodeLease } from '../transaction'
import { TransactionSignerAccount } from '../types/account'
import { AlgoAmount } from '../types/amount'
import { FeeDelta } from '../types/fee-coverage'
import { genesisIdIsLocalNet } from '../types/network-client'

/** Common parameters for defining a transaction. */
export type CommonTransactionParams = {
  /** The address of the account sending the transaction. */
  sender: string | Address
  /** The function used to sign transaction(s); if not specified then
   *  an attempt will be made to find a registered signer for the
   *  given `sender` or use a default signer (if configured).
   */
  signer?: TransactionSigner | TransactionSignerAccount
  /** Change the signing key of the sender to the given address.
   *
   * **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).
   */
  rekeyTo?: string | Address
  /** Note to attach to the transaction. Max of 1000 bytes. */
  note?: Uint8Array | string
  /** Prevent multiple transactions with the same lease being included within the validity window.
   *
   * A [lease](https://dev.algorand.co/concepts/transactions/leases)
   *  enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios).
   */
  lease?: Uint8Array | string
  /** The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. */
  staticFee?: AlgoAmount
  /** The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. */
  extraFee?: AlgoAmount
  /** Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. */
  maxFee?: AlgoAmount
  /** How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. */
  validityWindow?: number | bigint
  /**
   * Set the first round this transaction is valid.
   * If left undefined, the value from algod will be used.
   *
   * We recommend you only set this when you intentionally want this to be some time in the future.
   */
  firstValidRound?: bigint
  /** The last round this transaction is valid. It is recommended to use `validityWindow` instead. */
  lastValidRound?: bigint
}

export type TransactionHeader = {
  sender: string
  fee?: bigint
  firstValid: bigint
  lastValid: bigint
  genesisHash?: Uint8Array
  genesisId?: string
  note?: Uint8Array
  rekeyTo?: string
  lease?: Uint8Array
  group?: Uint8Array
}

export const ensureString = (data?: string | Uint8Array) => {
  if (data === undefined) return undefined
  const encoder = new TextEncoder()
  return typeof data === 'string' ? encoder.encode(data) : data
}

export const buildTransactionHeader = (
  commonParams: CommonTransactionParams,
  suggestedParams: SuggestedParams,
  defaultValidityWindow: number,
) => {
  const firstValid = commonParams.firstValidRound ?? suggestedParams.firstValid
  const lease = commonParams.lease === undefined ? undefined : encodeLease(commonParams.lease)
  const note = ensureString(commonParams.note)

  return {
    sender: commonParams.sender.toString(),
    rekeyTo: commonParams.rekeyTo?.toString(),
    note: note,
    lease: lease,
    fee: commonParams.staticFee?.microAlgos,
    genesisId: suggestedParams.genesisId,
    genesisHash: suggestedParams.genesisHash,
    firstValid,
    lastValid:
      commonParams.lastValidRound ??
      (commonParams.validityWindow !== undefined
        ? firstValid + BigInt(commonParams.validityWindow)
        : firstValid + BigInt(defaultValidityWindow)),
    group: undefined,
  } satisfies TransactionHeader
}

export function calculateInnerFeeDelta(
  innerTransactions?: PendingTransactionResponse[],
  minTransactionFee: bigint = 1000n,
  acc?: FeeDelta,
): FeeDelta | undefined {
  if (!innerTransactions) {
    return acc
  }

  // Surplus inner transaction fees do not pool up to the parent transaction.
  // Additionally surplus inner transaction fees only pool from sibling transactions
  // that are sent prior to a given inner transaction, hence why we iterate in reverse order.
  return innerTransactions.reduceRight((acc, innerTxn) => {
    const recursiveDelta = calculateInnerFeeDelta(innerTxn.innerTxns, minTransactionFee, acc)

    // Inner transactions don't require per byte fees
    const txnFeeDelta = FeeDelta.fromBigInt(minTransactionFee - (innerTxn.txn.txn.fee ?? 0n))

    const currentFeeDelta = FeeDelta.fromBigInt(
      (recursiveDelta ? FeeDelta.toBigInt(recursiveDelta) : 0n) + (txnFeeDelta ? FeeDelta.toBigInt(txnFeeDelta) : 0n),
    )

    // If after the recursive inner fee calculations we have a surplus,
    // return undefined to avoid pooling up surplus fees, which is not allowed.
    if (currentFeeDelta && FeeDelta.isSurplus(currentFeeDelta)) {
      return undefined
    }

    return currentFeeDelta
  }, acc)
}

export function getDefaultValidityWindow(genesisId: string): number {
  const isLocalNet = genesisIdIsLocalNet(genesisId)
  if (isLocalNet) {
    return 1000 // LocalNet gets bigger window to avoid dead transactions
  } else {
    return 10 // Standard default validity window
  }
}
