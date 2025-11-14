import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates creating AlgoAmount instances using the microAlgo()
 * function, which is ideal for working with precise microALGO values.
 *
 * microAlgo() is particularly useful when dealing with blockchain values,
 * transaction fees, and precise amount calculations.
 */

console.log('=== Create AlgoAmount Using microAlgo() Function ===\n')

// Example 1: Creating amounts with microAlgo()
console.log('1. Basic microAlgo() Usage')
console.log('   Creating amounts from microALGO values...\n')

const amount = microAlgo(100)
console.log('   Created: microAlgo(100)')
console.log(`   Type: ${amount.constructor.name}`)
console.log(`   Value in microALGOs: ${amount.microAlgos}`)
console.log(`   Value in ALGOs: ${amount.algos}`)
console.log()

// Example 2: One ALGO in microALGOs
console.log('2. One ALGO in microALGOs')
console.log('   Understanding the conversion...\n')

const oneAlgo = microAlgo(1_000_000)
console.log('   Created: microAlgo(1,000,000)')
console.log(`   microALGOs: ${oneAlgo.microAlgos}`)
console.log(`   ALGOs: ${oneAlgo.algos}`)
console.log('   Note: 1 ALGO = 1,000,000 microALGOs')
console.log()

// Example 3: Small precise amounts
console.log('3. Small Precise Amounts')
console.log('   Working with transaction fees...\n')

const smallAmount = microAlgo(50)
console.log('   Created: microAlgo(50)')
console.log(`   microALGOs: ${smallAmount.microAlgos}`)
console.log(`   ALGOs: ${smallAmount.algos}`)
console.log()

// Example 4: Typical transaction fee
console.log('4. Typical Transaction Fee')
console.log('   Standard Algorand transaction fee...\n')

const txnFee = microAlgo(1000)
console.log('   Created: microAlgo(1000)')
console.log(`   microALGOs: ${txnFee.microAlgos}`)
console.log(`   ALGOs: ${txnFee.algos}`)
console.log('   Standard fee: 0.001 ALGO')
console.log()

// Example 5: Comparing with algo() function
console.log('5. Comparison: microAlgo() vs algo()')
console.log('   Same value, different input...\n')

const fromMicro = microAlgo(5_000_000)
const fromAlgo = algo(5)

console.log('   microAlgo(5,000,000):')
console.log(`     microALGOs: ${fromMicro.microAlgos}`)
console.log(`     ALGOs: ${fromMicro.algos}`)
console.log()
console.log('   algo(5):')
console.log(`     microALGOs: ${fromAlgo.microAlgos}`)
console.log(`     ALGOs: ${fromAlgo.algos}`)
console.log()
console.log(`   Both equal: ${fromMicro.microAlgos === fromAlgo.microAlgos}`)
console.log()

// Example 6: Practical use case - calculating costs
console.log('6. Practical Example: Calculating Costs')
console.log('   Computing total transaction costs...\n')

const baseFee = microAlgo(1000)
const numTransactions = 10
const totalFee = microAlgo(Number(baseFee.microAlgos) * numTransactions)

console.log(`   Base fee: ${baseFee.microAlgos} microALGOs (${baseFee.algos} ALGOs)`)
console.log(`   Number of transactions: ${numTransactions}`)
console.log(`   Total cost: ${totalFee.microAlgos} microALGOs (${totalFee.algos} ALGOs)`)
console.log()

// Example 7: Minimum balance calculation
console.log('7. Minimum Balance Calculation')
console.log('   Calculating account minimum balances...\n')

const baseMinBalance = microAlgo(100_000)  // 0.1 ALGO
const assetOptIn = microAlgo(100_000)      // 0.1 ALGO per asset
const numAssets = 3

const totalMinBalance = microAlgo(
  Number(baseMinBalance.microAlgos) + (Number(assetOptIn.microAlgos) * numAssets)
)

console.log(`   Base minimum: ${baseMinBalance.algos} ALGO`)
console.log(`   Per asset opt-in: ${assetOptIn.algos} ALGO`)
console.log(`   Number of assets: ${numAssets}`)
console.log(`   Total minimum balance: ${totalMinBalance.algos} ALGOs (${totalMinBalance.microAlgos} microALGOs)`)
console.log()

// Example 8: Working with AlgoAmount properties
console.log('8. AlgoAmount Properties')
console.log('   Understanding the AlgoAmount class...\n')

const demoAmount = microAlgo(250_000)
console.log('   Created: microAlgo(250,000)')
console.log(`   Type: ${demoAmount.constructor.name}`)
console.log(`   .microAlgos property: ${demoAmount.microAlgos}`)
console.log(`   .algos property: ${demoAmount.algos}`)
console.log(`   Both properties always available`)
console.log()

console.log('=== Summary ===')
console.log('✅ Successfully demonstrated microAlgo() function!')
console.log()
console.log('Key points:')
console.log('  • microAlgo() creates AlgoAmount from microALGO values')
console.log('  • Ideal for precise blockchain amounts')
console.log('  • Perfect for transaction fees and exact calculations')
console.log('  • Returns AlgoAmount with both .algos and .microAlgos')
console.log('  • 1 ALGO = 1,000,000 microALGOs')
console.log('  • Use for fee calculations and minimum balances')
console.log()
console.log('=== Key Takeaways ===')
console.log('• Use microAlgo() for precise microALGO amounts')
console.log('• Use algo() for human-readable ALGO amounts')
console.log('• Both create the same AlgoAmount type')
console.log('• Choose based on your input: microALGOs or ALGOs')
console.log('• AlgoAmount handles all conversions automatically')
