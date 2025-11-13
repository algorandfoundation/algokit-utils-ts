import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates the fluent syntax for creating AlgoAmount instances.
 *
 * AlgoKit Utils provides convenient functions like algo() and microAlgo() that
 * provide an intuitive way to create amount instances.
 */

console.log('=== Create Algo Amounts with Fluent Syntax ===\n')

// Example 1: Creating amounts using the algo() function
console.log('1. Using algo() Function')
console.log('   Creating amounts in ALGO units...\n')

const amount1 = algo(100)
console.log('   Created: algo(100)')
console.log(`   Type: ${amount1.constructor.name}`)
console.log(`   Value in ALGOs: ${amount1.algos}`)
console.log(`   Value in microALGOs: ${amount1.microAlgos}`)
console.log()

// Example 2: Creating small amounts
console.log('2. Small Amounts (Fractional ALGOs)')
console.log('   Creating fractional ALGO amounts...\n')

const smallAmount = algo(0.5)
console.log('   Created: algo(0.5)')
console.log(`   Value in ALGOs: ${smallAmount.algos}`)
console.log(`   Value in microALGOs: ${smallAmount.microAlgos}`)
console.log()

// Example 3: Creating large amounts
console.log('3. Large Amounts')
console.log('   Creating large ALGO amounts...\n')

const largeAmount = algo(1_000_000)
console.log('   Created: algo(1,000,000)')
console.log(`   Value in ALGOs: ${largeAmount.algos}`)
console.log(`   Value in microALGOs: ${largeAmount.microAlgos}`)
console.log()

// Example 4: Using microAlgo() function
console.log('4. Using microAlgo() Function')
console.log('   Creating amounts in microALGO units...\n')

const microAmount = microAlgo(500_000)
console.log('   Created: microAlgo(500,000)')
console.log(`   Value in ALGOs: ${microAmount.algos}`)
console.log(`   Value in microALGOs: ${microAmount.microAlgos}`)
console.log()

// Example 5: Practical usage in code
console.log('5. Practical Usage Examples')
console.log('   Using fluent syntax for readable code...\n')

const paymentAmount = algo(50)
const minimumBalance = algo(0.1)
const feeAmount = microAlgo(1000)

console.log(`   Payment amount: ${paymentAmount.algos} ALGOs`)
console.log(`   Minimum balance: ${minimumBalance.algos} ALGOs`)
console.log(`   Fee amount: ${feeAmount.microAlgos} microALGOs (${feeAmount.algos} ALGOs)`)
console.log()

// Example 6: Convenient access to both units
console.log('6. Unit Conversion')
console.log('   AlgoAmount provides both ALGO and microALGO values...\n')

const demoAmount = algo(25)
console.log(`   ${demoAmount.algos} ALGOs = ${demoAmount.microAlgos} microALGOs`)
console.log()

// Example 7: Comparison of both functions
console.log('7. Function Comparison')
console.log('   algo() vs microAlgo() - same value, different input...\n')

const fromAlgo = algo(1)
const fromMicroAlgo = microAlgo(1_000_000)

console.log(`   algo(1):`)
console.log(`     ALGOs: ${fromAlgo.algos}`)
console.log(`     microALGOs: ${fromAlgo.microAlgos}`)
console.log()
console.log(`   microAlgo(1,000,000):`)
console.log(`     ALGOs: ${fromMicroAlgo.algos}`)
console.log(`     microALGOs: ${fromMicroAlgo.microAlgos}`)
console.log()
console.log(`   Both represent the same amount: ${fromAlgo.algos === fromMicroAlgo.algos}`)
console.log()

console.log('=== Summary ===')
console.log('✅ Successfully demonstrated AlgoAmount creation!')
console.log()
console.log('Key points:')
console.log('  • algo() creates amounts from ALGO values')
console.log('  • microAlgo() creates amounts from microALGO values')
console.log('  • Both functions return AlgoAmount instances')
console.log('  • Access .algos for ALGO value')
console.log('  • Access .microAlgos for microALGO value')
console.log('  • Fluent syntax makes code more readable')
console.log()
console.log('=== Key Takeaways ===')
console.log('• Use algo() for human-readable amounts (e.g., algo(10))')
console.log('• Use microAlgo() for precise amounts (e.g., microAlgo(1000))')
console.log('• AlgoAmount handles conversions automatically')
console.log('• Both .algos and .microAlgos properties are always available')
