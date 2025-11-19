import { transactionFees } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to calculate transaction fees on Algorand.
 *
 * Algorand uses a flat fee structure where each transaction costs 1000 microAlgos (0.001 Algo).
 * When working with atomic transaction groups, you need to budget for multiple transaction fees.
 */

// Calculate the fee for a single transaction
// The standard Algorand fee is 1000 microAlgos per transaction
const singleTxFee = transactionFees(1)
console.log('Single transaction fee:', singleTxFee.microAlgos, 'microAlgos')
console.log('Single transaction fee:', singleTxFee.algos, 'Algos')

// Calculate fees for multiple transactions
// This is useful when creating atomic transaction groups
const tenTxFees = transactionFees(10)
console.log('\nFee for 10 transactions:', tenTxFees.microAlgos, 'microAlgos')
console.log('Fee for 10 transactions:', tenTxFees.algos, 'Algos')

// Example: Budgeting for an atomic transfer with 3 transactions
const atomicGroupSize = 3
const totalFees = transactionFees(atomicGroupSize)
console.log(`\nTotal fees for atomic group of ${atomicGroupSize} transactions:`, totalFees.microAlgos, 'microAlgos')

// You can use this for fee estimation before submitting transactions
const estimatedTransactions = 5
const estimatedCost = transactionFees(estimatedTransactions)
console.log(`\nEstimated cost for ${estimatedTransactions} transactions:`, estimatedCost.algos, 'Algos')
