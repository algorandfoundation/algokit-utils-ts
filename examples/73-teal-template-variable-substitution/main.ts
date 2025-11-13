/**
 * This example demonstrates TEAL template variable substitution.
 *
 * TEAL templates allow you to parameterize your smart contract code by using
 * placeholder variables that are replaced with actual values before deployment.
 *
 * Template variables in TEAL follow the pattern: TMPL_VARIABLE_NAME
 * The prefix 'TMPL_' identifies them as template variables.
 *
 * In AlgoKit Utils v9.1.2, template substitution happens automatically during
 * app deployment when you provide deployTimeParams to the factory.deploy() method.
 */

// Simple template substitution implementation for demonstration
function replaceTealTemplateParams(teal: string, params: Record<string, number | string>): string {
  let result = teal

  for (const [key, value] of Object.entries(params)) {
    const placeholder = `TMPL_${key}`

    // For int/pushint context: replace with decimal value
    result = result.replace(new RegExp(`(int|pushint)\\s+${placeholder}`, 'g'), (match, opcode) => {
      return `${opcode} ${typeof value === 'number' ? value : value}`
    })

    // For byte/pushbytes context: replace with hex-encoded 8-byte value or string
    result = result.replace(new RegExp(`(byte|pushbytes)\\s+${placeholder}`, 'g'), (match, opcode) => {
      if (typeof value === 'number') {
        const hex = value.toString(16).padStart(16, '0')
        return `${opcode} 0x${hex}`
      } else if (typeof value === 'string') {
        return `${opcode} ${value}`
      }
      return match
    })
  }

  return result
}

async function demonstrateTealTemplateSubstitution() {
  console.log('=== TEAL Template Variable Substitution ===')
  console.log()

  // ===== Example 1: Simple Template Substitution =====
  console.log('Example 1: Basic Template Substitution')
  console.log('--------------------------------------')

  const simpleTeal = `#pragma version 8
int TMPL_MAX_VALUE
return`

  console.log('Original TEAL code:')
  console.log(simpleTeal)
  console.log()

  const simpleParams = {
    MAX_VALUE: 100,
  }

  console.log('Template parameters:', simpleParams)
  console.log()

  const substituted1 = replaceTealTemplateParams(simpleTeal, simpleParams)

  console.log('Substituted TEAL code:')
  console.log(substituted1)
  console.log()

  // ===== Example 2: Multiple Underscores in Variable Name =====
  console.log('Example 2: Template Variables with Multiple Underscores')
  console.log('--------------------------------------------------------')

  // Template variables can have multiple underscores in their names
  // This is useful for descriptive multi-word variable names
  const complexTeal = `#pragma version 8
// Check minimum balance
int TMPL_MIN_BALANCE
int TMPL_SOME_VALUE
>
return`

  console.log('Original TEAL code with multi-underscore variables:')
  console.log(complexTeal)
  console.log()

  const complexParams = {
    MIN_BALANCE: 100000, // Minimum balance in microAlgos
    SOME_VALUE: 123,     // Some other value
  }

  console.log('Template parameters:', complexParams)
  console.log()

  const substituted2 = replaceTealTemplateParams(complexTeal, complexParams)

  console.log('Substituted TEAL code:')
  console.log(substituted2)
  console.log()

  // ===== Example 3: Multiple Template Variables =====
  console.log('Example 3: Multiple Template Variables')
  console.log('---------------------------------------')

  const multiVarTeal = `#pragma version 8
// Configuration template
byte TMPL_OWNER_ADDRESS
txn Sender
==
bz not_owner
  int TMPL_ADMIN_FEE
  int TMPL_USER_FEE
  >
  return
not_owner:
  int TMPL_USER_FEE
  return`

  console.log('Original TEAL code with multiple variables:')
  console.log(multiVarTeal)
  console.log()

  const multiParams = {
    OWNER_ADDRESS: '"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"',
    ADMIN_FEE: 1000,
    USER_FEE: 100,
  }

  console.log('Template parameters:', multiParams)
  console.log()

  const substituted3 = replaceTealTemplateParams(multiVarTeal, multiParams)

  console.log('Substituted TEAL code:')
  console.log(substituted3)
  console.log()

  // ===== Summary =====
  console.log('=== Summary ===')
  console.log('Template substitution allows you to:')
  console.log('1. Parameterize smart contracts without recompiling')
  console.log('2. Deploy the same contract logic with different configurations')
  console.log('3. Use descriptive variable names with underscores (TMPL_SOME_VALUE)')
  console.log('4. Substitute numbers, addresses, and other values')
  console.log()
  console.log('Note: Template variables must start with TMPL_ prefix')
  console.log('      The prefix is removed during substitution (TMPL_VALUE -> VALUE)')
}

// Run the example
demonstrateTealTemplateSubstitution()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })