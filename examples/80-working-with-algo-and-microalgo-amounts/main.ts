import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

/**
 * Working with ALGO and MicroAlgo Amounts
 * 
 * This example demonstrates how to create and convert between ALGO and microAlgo amounts.
 * On Algorand, the base unit is microAlgos (µALGO), where 1 ALGO = 1,000,000 microAlgos.
 */

function demonstrateAlgoAmounts() {
  console.log('=== ALGO Amount Conversions ===')
  console.log()

  // 1. Creating an amount in ALGO and retrieving it in ALGO (identity conversion)
  console.log('1. Identity Conversion (ALGO to ALGO):')
  const amount1 = algo(100)
  console.log(`   Created: algo(100)`)
  console.log(`   Retrieved: ${amount1.algo} ALGO`)
  console.log()

  // 2. Converting small microAlgo amounts to ALGO
  console.log('2. Small Amount Conversion (microAlgos to ALGO):')
  const amount2 = microAlgo(1000)
  console.log(`   Created: microAlgo(1000)`)
  console.log(`   Retrieved: ${amount2.algo} ALGO`)
  console.log(`   This shows 1000 µALGO = 0.001 ALGO`)
  console.log()

  // 3. Converting large microAlgo amounts to ALGO
  console.log('3. Large Amount Conversion (microAlgos to ALGO):')
  const amount3 = microAlgo(100_000_000)
  console.log(`   Created: microAlgo(100_000_000)`)
  console.log(`   Retrieved: ${amount3.algo} ALGO`)
  console.log(`   This demonstrates: 100,000,000 µALGO = 100 ALGO`)
  console.log()

  // 4. Additional examples showing the conversion factor
  console.log('4. Understanding the Conversion Factor:')
  console.log(`   1 ALGO = 1,000,000 microAlgos`)
  console.log(`   microAlgo(1_000_000).algo = ${microAlgo(1_000_000).algo} ALGO`)
  console.log()

  // 5. Practical use case: displaying transaction fees
  console.log('5. Practical Example - Transaction Fee Display:')
  const minTxnFee = microAlgo(1000) // Minimum transaction fee
  console.log(`   Minimum transaction fee: ${minTxnFee.microAlgos} µALGO`)
  console.log(`   In ALGO: ${minTxnFee.algo} ALGO`)
  console.log()

  // 6. Working with both accessors
  console.log('6. Accessing Both Units:')
  const amount = algo(5.5)
  console.log(`   Amount created: algo(5.5)`)
  console.log(`   In ALGO: ${amount.algo} ALGO`)
  console.log(`   In microAlgos: ${amount.microAlgos} µALGO`)
}

// Run the demonstration
demonstrateAlgoAmounts()