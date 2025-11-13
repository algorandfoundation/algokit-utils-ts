import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates working with AlgoAmount for:
 * 1. Creating amounts in microAlgos
 * 2. Creating amounts in ALGOs
 * 3. Converting between units
 * 4. Formatting amounts as readable strings
 */

function demonstrateAlgoAmounts() {
  console.log('=== Working with AlgoAmount ===')
  console.log()

  // Creating amounts in microAlgos
  console.log('1. Creating amounts in microAlgos:')
  const amountInMicroAlgos = microAlgo(100)
  console.log(`   Created: microAlgo(100)`)
  console.log(`   Value as BigInt: ${amountInMicroAlgos.microAlgos}`) // 100n
  console.log()

  // Creating amounts in ALGOs and converting to microAlgos
  console.log('2. Creating amounts in ALGOs and converting:')
  const amountInAlgos = algo(100)
  console.log(`   Created: algo(100)`)
  console.log(`   Converted to microAlgos: ${amountInAlgos.microAlgos}`) // 100_000_000n
  console.log(`   (1 ALGO = 1,000,000 microAlgos)`)
  console.log()

  // Formatting amounts as readable strings
  console.log('3. Formatting amounts for display:')
  const largeAmount = algo(100)
  console.log(`   Amount: algo(100)`)
  console.log(`   Formatted string: ${largeAmount}`) // "100,000,000 µALGO"
  console.log(`   (Automatic comma separators for readability)`)
  console.log()

  // Additional examples with different amounts
  console.log('4. More formatting examples:')
  const examples = [algo(1), algo(10), algo(1000), microAlgo(500)]
  examples.forEach((amount, index) => {
    console.log(`   ${index + 1}. ${amount}`)
  })
  console.log()

  // Working with amounts in calculations
  console.log('5. Using amounts in calculations:')
  const amount1 = algo(50)
  const amount2 = algo(25)
  console.log(`   Amount 1: ${amount1}`)
  console.log(`   Amount 2: ${amount2}`)
  console.log(`   Sum (in microAlgos): ${amount1.microAlgos + amount2.microAlgos}`)
  console.log()
}

// Run the demonstration
demonstrateAlgoAmounts()

console.log('=== Key Takeaways ===')
console.log('• Use algo() for human-friendly ALGO units')
console.log('• Use microAlgo() for precise microAlgo units')
console.log('• Access .microAlgos property to get BigInt value for calculations')
console.log('• toString() automatically formats with comma separators')
console.log('• All values use BigInt for precise integer arithmetic')