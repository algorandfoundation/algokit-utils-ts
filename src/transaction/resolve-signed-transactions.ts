import algosdk from 'algosdk'
import Transaction = algosdk.Transaction

/**
 * Resolve the transactions as they were signed.
 *
 * Signers (e.g. wallets) can mutate the transactions they are given, so the signed transactions are the source of truth
 * for what is actually sent to the network. Without this, a mutated transaction would be reported (and waited for)
 * under the transaction ID of the transaction that was built, which was never sent.
 *
 * The built transaction is returned when it wasn't mutated, so callers keep the exact transaction they built.
 *
 * @param builtTransactions The transactions that were given to the signers
 * @param encodedSignedTransactions The signed transactions returned by the signers
 * @returns The transactions as they were signed
 */
export function resolveSignedTransactions(builtTransactions: Transaction[], encodedSignedTransactions: Uint8Array[]): Transaction[] {
  return encodedSignedTransactions.map((encodedSignedTransaction, index) => {
    const { txn } = algosdk.decodeSignedTransaction(encodedSignedTransaction)
    const builtTransaction = builtTransactions[index]
    return builtTransaction !== undefined && builtTransaction.txID() === txn.txID() ? builtTransaction : txn
  })
}
