/**
 * This example demonstrates how TEAL template parameter substitution works.
 *
 * Template variables (prefixed with TMPL_) in TEAL code are replaced with actual values
 * during deployment. The substitution behaves differently depending on the opcode context:
 *
 * - For 'int' and 'pushint' opcodes: substitutes as decimal integer
 * - For 'byte' and 'pushbytes' opcodes: substitutes as hex-encoded bytes (8-byte uint64)
 *
 * In AlgoKit Utils v9.1.2, template substitution happens automatically during app deployment
 * when you provide deployTimeParams to the factory.deploy() method.
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

    // For byte/pushbytes context: replace with hex-encoded 8-byte value
    result = result.replace(new RegExp(`(byte|pushbytes)\\s+${placeholder}`, 'g'), (match, opcode) => {
      if (typeof value === 'number') {
        // Convert number to 8-byte hex
        const hex = value.toString(16).padStart(16, '0')
        return `${opcode} 0x${hex}`
      } else if (typeof value === 'string') {
        // Assume it's an address or hex string
        return `${opcode} ${value}`
      }
      return match
    })
  }

  return result
}

async function demonstrateTealTemplateSubstitution() {
  // Define TEAL code with template placeholders
  // Template variables are prefixed with TMPL_
  const tealTemplate = `#pragma version 8
int TMPL_SOME_VALUE
pushint TMPL_SOME_VALUE
byte TMPL_SOME_VALUE
pushbytes TMPL_SOME_VALUE
return
`

  // Define the template parameters
  // Note: We use the parameter name without the TMPL_ prefix
  const templateParams = {
    SOME_VALUE: 123,
  }

  console.log('=== TEAL Template Parameter Substitution ===\n')

  console.log('Original TEAL template:')
  console.log(tealTemplate)

  console.log('Template parameters:')
  console.log(JSON.stringify(templateParams, null, 2))
  console.log()

  // Substitute template parameters
  // The SDK will automatically handle type conversion based on context
  const substitutedTeal = replaceTealTemplateParams(tealTemplate, templateParams)

  console.log('Substituted TEAL code:')
  console.log(substitutedTeal)
  console.log()

  console.log('=== How Substitution Works ===')
  console.log('• int/pushint opcodes: TMPL_SOME_VALUE → 123 (decimal integer)')
  console.log('• byte/pushbytes opcodes: TMPL_SOME_VALUE → 0x000000000000007b (8-byte hex of 123)')
  console.log()

  // Example with multiple parameters
  console.log('=== Multiple Parameters Example ===\n')

  const multiTemplate = `#pragma version 8
int TMPL_FEE
int TMPL_AMOUNT
pushint TMPL_MAX_USERS
byte TMPL_ADMIN_ADDR
return
`

  const multiParams = {
    FEE: 1000,
    AMOUNT: 5000000,
    MAX_USERS: 100,
    ADMIN_ADDR: 'addr:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
  }

  console.log('Template with multiple parameters:')
  console.log(multiTemplate)

  console.log('Parameters:')
  console.log(JSON.stringify(multiParams, null, 2))
  console.log()

  const multiSubstituted = replaceTealTemplateParams(multiTemplate, multiParams)

  console.log('Substituted result:')
  console.log(multiSubstituted)
  console.log()

  console.log('=== Real-World Usage ===')
  console.log('In practice, template substitution happens automatically during deployment:')
  console.log()
  console.log('const { result } = await factory.deploy({')
  console.log('  deployTimeParams: {')
  console.log('    FEE: 1000,')
  console.log('    AMOUNT: 5000000,')
  console.log('  },')
  console.log('  ...')
  console.log('})')
  console.log()
  console.log('The factory will automatically:')
  console.log('1. Read the TEAL templates from the app spec')
  console.log('2. Substitute all TMPL_ variables with your parameters')
  console.log('3. Compile the substituted TEAL')
  console.log('4. Deploy the compiled bytecode')
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
