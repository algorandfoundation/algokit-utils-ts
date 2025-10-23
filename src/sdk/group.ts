import type { Transaction } from '../../algokit_transact/src/transactions/transaction.js';
import { groupTransactions as groupTxns, getTransactionIdRaw } from '../../algokit_transact/src/transactions/transaction.js';
import * as nacl from './nacl/naclWrappers.js';
import { msgpackRawEncode } from './encoding/encoding.js';
import * as utils from './utils/utils.js';

const ALGORAND_MAX_TX_GROUP_SIZE = 16;
const TX_GROUP_TAG = new TextEncoder().encode('TG');

function txGroupPreimage(txnHashes: Uint8Array[]): Uint8Array {
  if (txnHashes.length > ALGORAND_MAX_TX_GROUP_SIZE) {
    throw new Error(
      `${txnHashes.length} transactions grouped together but max group size is ${ALGORAND_MAX_TX_GROUP_SIZE}`
    );
  }
  if (txnHashes.length === 0) {
    throw new Error('Cannot compute group ID of zero transactions');
  }
  const bytes = msgpackRawEncode({
    txlist: txnHashes,
  });
  return utils.concatArrays(TX_GROUP_TAG, bytes);
}

/**
 * computeGroupID returns group ID for a group of transactions
 * @param txns - array of transactions
 * @returns Uint8Array
 */
export function computeGroupID(txns: ReadonlyArray<Transaction>): Uint8Array {
  const hashes: Uint8Array[] = [];
  for (const txn of txns) {
    hashes.push(getTransactionIdRaw(txn));
  }

  const toBeHashed = txGroupPreimage(hashes);
  const gid = nacl.genericHash(toBeHashed);
  return Uint8Array.from(gid);
}

/**
 * assignGroupID assigns group id to a given list of unsigned transactions
 * @param txns - array of transactions. Returns a new array with group IDs assigned (immutable)
 * @returns Transaction[] - New array of transactions with group IDs assigned
 */
export function assignGroupID(txns: Transaction[]): Transaction[] {
  // Use the algokit_transact groupTransactions function which returns new transaction objects
  return groupTxns(txns);
}
