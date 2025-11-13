# TEAL Template Parameter Substitution

This example demonstrates how TEAL template parameter substitution works in Algorand smart contracts.

## Overview

Template variables (prefixed with `TMPL_`) in TEAL code are replaced with actual values during deployment. The substitution behaves differently depending on the opcode context:

- **For `int` and `pushint` opcodes**: Substitutes as decimal integer
- **For `byte` and `pushbytes` opcodes**: Substitutes as hex-encoded bytes (8-byte uint64)

## Key Concepts

### Template Variables

Template variables are placeholders in TEAL code that start with the `TMPL_` prefix:

```teal
#pragma version 8
int TMPL_FEE
byte TMPL_ADMIN_ADDR
```

### Context-Aware Substitution

The same template variable is substituted differently based on the opcode:

```teal
int TMPL_SOME_VALUE      → int 123 (decimal)
byte TMPL_SOME_VALUE     → byte 0x000000000000007b (8-byte hex)
```

### Automatic Deployment-Time Substitution

In AlgoKit Utils v9.1.2, template substitution happens automatically during app deployment when you provide `deployTimeParams` to the factory:

```typescript
const { result } = await factory.deploy({
  deployTimeParams: {
    FEE: 1000,
    AMOUNT: 5000000,
  },
  // ... other options
})
```

The factory automatically:
1. Reads the TEAL templates from the app spec
2. Substitutes all `TMPL_` variables with your parameters
3. Compiles the substituted TEAL
4. Deploys the compiled bytecode

## Code Example

This example demonstrates the concept with a simple substitution implementation:

```typescript
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
```

### Single Parameter Example

```typescript
const tealTemplate = `#pragma version 8
int TMPL_SOME_VALUE
pushint TMPL_SOME_VALUE
byte TMPL_SOME_VALUE
pushbytes TMPL_SOME_VALUE
return
`

const templateParams = {
  SOME_VALUE: 123,
}

const substitutedTeal = replaceTealTemplateParams(tealTemplate, templateParams)
```

**Result**:
```teal
#pragma version 8
int 123
pushint 123
byte 0x000000000000007b
pushbytes 0x000000000000007b
return
```

### Multiple Parameters Example

```typescript
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

const multiSubstituted = replaceTealTemplateParams(multiTemplate, multiParams)
```

**Result**:
```teal
#pragma version 8
int 1000
int 5000000
pushint 100
byte addr:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ
return
```

## Best Practices

1. **Use Descriptive Names**: Make template variable names clear and descriptive
   ```typescript
   // Good
   FEE: 1000
   MAX_USERS: 100

   // Avoid
   X: 1000
   Y: 100
   ```

2. **Validate Parameter Types**: Ensure parameters match the expected types for their opcode context
   ```typescript
   // Numeric values for int/pushint
   FEE: 1000

   // Addresses or hex strings for byte/pushbytes
   ADMIN_ADDR: 'addr:...'
   ```

3. **Document Template Parameters**: Include comments in your TEAL explaining what each template variable is for
   ```teal
   // Fee charged per transaction
   int TMPL_FEE

   // Maximum number of users allowed
   pushint TMPL_MAX_USERS
   ```

4. **Use Type-Safe Definitions**: Define your template parameters with proper TypeScript types
   ```typescript
   interface TemplateParams {
     FEE: number
     AMOUNT: number
     MAX_USERS: number
     ADMIN_ADDR: string
   }
   ```

## Common Use Cases

### Configuration Parameters

Template substitution is ideal for deployment-specific configuration:
- Fee amounts
- Rate limits
- Administrator addresses
- Time constraints

### Multi-Instance Deployment

Deploy multiple instances of the same contract with different parameters:
```typescript
// Deploy fee-based version
await factory.deploy({
  deployTimeParams: { FEE: 1000, ADMIN_ADDR: adminAddr },
})

// Deploy free version
await factory.deploy({
  deployTimeParams: { FEE: 0, ADMIN_ADDR: adminAddr },
})
```

### Network-Specific Values

Use different values for different networks:
```typescript
const params = network === 'mainnet'
  ? { FEE: 10000, ADMIN_ADDR: mainnetAdmin }
  : { FEE: 1000, ADMIN_ADDR: testnetAdmin }

await factory.deploy({ deployTimeParams: params })
```

## Important Notes

1. **Automatic in v9.1.2**: This example shows the concept, but in practice template substitution happens automatically when using `factory.deploy()` with `deployTimeParams`

2. **Type Conversion**: The SDK handles type conversion based on the opcode context automatically

3. **Hex Encoding**: Numeric values in byte context are encoded as 8-byte big-endian hex values

4. **Parameter Names**: Use the parameter name without the `TMPL_` prefix when passing to `deployTimeParams`

## Running This Example

```bash
npm install
npm start
```

This will demonstrate:
- How template variables are substituted in different opcode contexts
- Single parameter substitution
- Multiple parameter substitution
- The format of substituted values (decimal vs hex)

## Related Concepts

- **App Deployment**: [10-appclient-create-and-call](../10-appclient-create-and-call)
- **App Factory Pattern**: [11-appclient-deploy](../11-appclient-deploy)
- **TEAL Programming**: Algorand's smart contract language
- **Deploy-Time Configuration**: Setting contract parameters at deployment

## Learn More

- [Algorand Developer Portal - Smart Contracts](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/)
- [TEAL Language Reference](https://developer.algorand.org/docs/get-details/dapps/avm/teal/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
