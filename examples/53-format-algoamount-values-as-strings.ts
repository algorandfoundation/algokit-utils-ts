import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'

/**
 * This example demonstrates how to format AlgoAmount values as human-readable strings.
 *
 * AlgoAmount provides convenient methods for working with Algorand's native currency
 * in different units:
 * - microAlgos (µALGO): The smallest unit (1 ALGO = 1,000,000 µALGO)
 * - milliAlgos (mALGO): 1 mALGO = 1,000 µALGO
 * - Algos (ALGO): The standard unit
 *
 * The toString() method automatically formats amounts with the appropriate unit suffix.
 */
function formatAlgoAmounts() {
  console.log('=== Formatting AlgoAmount Values ===')
  console.log()

  // Format tiny amounts in microAlgos
  const oneMicroAlgo = AlgoAmount.MicroAlgos(1)
  console.log('1 microAlgo formatted:', `${oneMicroAlgo}`)
  // Output: "1 µALGO"

  const hundredMicroAlgos = AlgoAmount.MicroAlgos(100)
  console.log('100 microAlgos formatted:', `${hundredMicroAlgos}`)
  // Output: "100 µALGO"

  // Format amounts equivalent to milliAlgos (1 milliAlgo = 1,000 microAlgos)
  const oneMilliAlgo = AlgoAmount.MicroAlgos(1000)
  console.log('1 milliAlgo (1,000 µALGO) formatted:', `${oneMilliAlgo}`)
  // Output: "1,000 µALGO"

  const tenMilliAlgos = AlgoAmount.MicroAlgos(10000)
  console.log('10 milliAlgos (10,000 µALGO) formatted:', `${tenMilliAlgos}`)
  // Output: "10,000 µALGO"

  console.log()

  // Format standard Algo amounts
  const oneAlgo = AlgoAmount.Algos(1)
  console.log('1 Algo formatted:', `${oneAlgo}`)
  // Output: "1,000,000 µALGO"

  const tenAlgos = AlgoAmount.Algos(10)
  console.log('10 Algos formatted:', `${tenAlgos}`)
  // Output: "10,000,000 µALGO"

  console.log()

  // Format fractional Algos
  const halfAlgo = AlgoAmount.Algos(0.5)
  console.log('0.5 Algos formatted:', `${halfAlgo}`)
  // Output: "500,000 µALGO"

  console.log()
  console.log('=== Converting Between Units ===')
  console.log()

  // You can also access different unit representations
  const amount = AlgoAmount.Algos(5)
  console.log(`5 ALGO equals:`)
  console.log(`  - ${amount.microAlgos} microAlgos`)
  console.log(`  - ${amount.algos} Algos`)
  console.log(`  - String representation: ${amount}`)

  console.log()
  console.log('=== Practical Use Cases ===')
  console.log()

  // Logging transaction amounts
  function logTransaction(sender: string, receiver: string, amount: AlgoAmount) {
    console.log(`Transaction: ${sender} -> ${receiver}`)
    console.log(`Amount: ${amount}`) // Automatically formatted!
  }

  logTransaction(
    'SENDER123...',
    'RECEIVER456...',
    AlgoAmount.MicroAlgos(1000)
  )

  console.log()

  // Display balance in UI
  function displayBalance(address: string, balance: AlgoAmount) {
    return `Account ${address} has a balance of ${balance}`
  }

  console.log(displayBalance(
    'ACCOUNT789...',
    AlgoAmount.Algos(42.5)
  ))
}

// Run the example
formatAlgoAmounts()
