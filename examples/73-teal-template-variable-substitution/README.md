# TEAL Template Variable Substitution

This example demonstrates how to substitute template variables in TEAL code, including variables with multiple underscores, allowing for dynamic parameterization of smart contracts.

## Overview

TEAL template variables provide a powerful way to parameterize smart contract code. Variables prefixed with `TMPL_` are placeholder values that get replaced with actual values during deployment, allowing you to:

1. Deploy the same contract logic with different configurations
2. Use descriptive multi-word variable names (e.g., `TMPL_MIN_BALANCE`, `TMPL_ADMIN_FEE`)
3. Parameterize contracts without recompiling the TEAL code

## Key Concepts

### Template Variable Naming Convention

Template variables must follow the pattern `TMPL_VARIABLE_NAME`:
- **Required Prefix**: All template variables must start with `TMPL_`
- **Multiple Underscores**: Variable names can contain multiple underscores for readability
- **Case Convention**: Typically use UPPER_SNAKE_CASE

```teal
int TMPL_MAX_VALUE           // Simple variable
int TMPL_MIN_BALANCE         // Multi-word with underscore
byte TMPL_OWNER_ADDRESS      // Another multi-word variable
```

### Substitution Process

During deployment, template variables are replaced with actual values:

```teal
// Before substitution
int TMPL_MAX_VALUE

// After substitution with MAX_VALUE: 100
int 100
```

### Context-Aware Substitution

Like in example 72, substitution is context-aware:
- **int/pushint opcodes**: Numeric values substituted as decimal integers
- **byte/pushbytes opcodes**: String values or hex-encoded values

## Code Examples

### Example 1: Basic Template Substitution

```typescript
const simpleTeal = `#pragma version 8
int TMPL_MAX_VALUE
return`

const simpleParams = {
  MAX_VALUE: 100,
}

const substituted = replaceTealTemplateParams(simpleTeal, simpleParams)
```

**Result**:
```teal
#pragma version 8
int 100
return
```

### Example 2: Variables with Multiple Underscores

This example highlights the key feature of supporting multi-word variable names:

```typescript
const complexTeal = `#pragma version 8
// Check minimum balance
int TMPL_MIN_BALANCE
int TMPL_SOME_VALUE
>
return`

const complexParams = {
  MIN_BALANCE: 100000, // Minimum balance in microAlgos
  SOME_VALUE: 123,     // Some other value
}

const substituted = replaceTealTemplateParams(complexTeal, complexParams)
```

**Result**:
```teal
#pragma version 8
// Check minimum balance
int 100000
int 123
>
return
```

### Example 3: Multiple Template Variables

```typescript
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

const multiParams = {
  OWNER_ADDRESS: '"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"',
  ADMIN_FEE: 1000,
  USER_FEE: 100,
}

const substituted = replaceTealTemplateParams(multiVarTeal, multiParams)
```

**Result**:
```teal
#pragma version 8
// Configuration template
byte "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"
txn Sender
==
bz not_owner
  int 1000
  int 100
  >
  return
not_owner:
  int 100
  return
```

## Best Practices

### 1. Use Descriptive Variable Names

**Good** - Clear, multi-word names with underscores:
```typescript
{
  MIN_BALANCE: 100000,
  MAX_USERS: 1000,
  ADMIN_FEE: 500,
  OWNER_ADDRESS: "..."
}
```

**Avoid** - Single-letter or unclear names:
```typescript
{
  X: 100000,
  Y: 1000,
  Z: 500
}
```

### 2. Group Related Parameters

Organize parameters logically by their purpose:

```typescript
// Fee configuration
const feeParams = {
  ADMIN_FEE: 1000,
  USER_FEE: 100,
  EARLY_BIRD_FEE: 50,
}

// Access control
const accessParams = {
  OWNER_ADDRESS: ownerAddr,
  ADMIN_ADDRESS: adminAddr,
}

// Limits
const limitParams = {
  MIN_BALANCE: 100000,
  MAX_USERS: 1000,
  MAX_TRANSACTION_SIZE: 4096,
}
```

### 3. Document Template Variables

Add comments explaining what each variable controls:

```teal
#pragma version 8
// Minimum account balance required (microAlgos)
int TMPL_MIN_BALANCE

// Maximum number of users allowed in the system
int TMPL_MAX_USERS

// Administrator address with special privileges
byte TMPL_ADMIN_ADDRESS
```

### 4. Validate Parameter Values

Before substitution, validate that parameters are reasonable:

```typescript
function validateTemplateParams(params: Record<string, number | string>): void {
  if (params.MIN_BALANCE < 100000) {
    throw new Error('MIN_BALANCE must be at least 100000 microAlgos')
  }

  if (params.MAX_USERS > 10000) {
    throw new Error('MAX_USERS cannot exceed 10000')
  }

  if (params.ADMIN_FEE < params.USER_FEE) {
    throw new Error('ADMIN_FEE should not be less than USER_FEE')
  }
}

validateTemplateParams(params)
const substituted = replaceTealTemplateParams(teal, params)
```

## Common Use Cases

### 1. Fee Configuration

Deploy contracts with different fee structures:

```typescript
// Premium tier
const premiumParams = {
  TRANSACTION_FEE: 10000,
  MONTHLY_FEE: 100000,
  ADMIN_FEE: 5000,
}

// Standard tier
const standardParams = {
  TRANSACTION_FEE: 5000,
  MONTHLY_FEE: 50000,
  ADMIN_FEE: 2000,
}
```

### 2. Access Control

Configure different administrators per deployment:

```typescript
const mainnetParams = {
  OWNER_ADDRESS: mainnetOwner,
  ADMIN_ADDRESS: mainnetAdmin,
  TREASURY_ADDRESS: mainnetTreasury,
}

const testnetParams = {
  OWNER_ADDRESS: testnetOwner,
  ADMIN_ADDRESS: testnetAdmin,
  TREASURY_ADDRESS: testnetTreasury,
}
```

### 3. Resource Limits

Set different limits for different environments:

```typescript
// Production limits
const prodParams = {
  MAX_USERS: 10000,
  MAX_DAILY_TRANSACTIONS: 100000,
  MIN_BALANCE: 1000000,
}

// Testing limits
const testParams = {
  MAX_USERS: 100,
  MAX_DAILY_TRANSACTIONS: 1000,
  MIN_BALANCE: 100000,
}
```

### 4. Time-Based Configuration

Deploy contracts with different timing parameters:

```typescript
const params = {
  VOTING_PERIOD_SECONDS: 604800,      // 7 days
  COOLDOWN_PERIOD_SECONDS: 86400,     // 1 day
  EXECUTION_DELAY_SECONDS: 172800,    // 2 days
}
```

## Automatic Substitution in v9.1.2

In AlgoKit Utils v9.1.2, template substitution happens automatically during deployment when using `factory.deploy()`:

```typescript
const factory = algorand.client.getAppFactory({
  appSpec: myAppSpec,
  defaultSender: deployer.addr,
})

const { result } = await factory.deploy({
  deployTimeParams: {
    MIN_BALANCE: 100000,
    MAX_USERS: 1000,
    ADMIN_FEE: 500,
  },
  // ... other deployment options
})
```

The factory will:
1. Read TEAL templates from the app spec
2. Substitute all `TMPL_` variables with provided values
3. Compile the substituted TEAL
4. Deploy the compiled bytecode

## Important Notes

1. **Prefix Requirement**: Template variables MUST start with `TMPL_` prefix
2. **Parameter Naming**: When passing parameters, use the name WITHOUT the `TMPL_` prefix
3. **Multi-Underscore Support**: Variable names like `TMPL_MIN_BALANCE` are fully supported
4. **Type Safety**: Consider using TypeScript interfaces to define template parameter types
5. **Automatic in Production**: This example shows the concept; in practice, use `factory.deploy()` with `deployTimeParams`

## Running This Example

```bash
npm install
npm start
```

**Expected Output**:
```
=== TEAL Template Variable Substitution ===

Example 1: Basic Template Substitution
--------------------------------------
Original TEAL code:
#pragma version 8
int TMPL_MAX_VALUE
return

Template parameters: { MAX_VALUE: 100 }

Substituted TEAL code:
#pragma version 8
int 100
return

Example 2: Template Variables with Multiple Underscores
--------------------------------------------------------
[Shows substitution of TMPL_MIN_BALANCE and TMPL_SOME_VALUE]

Example 3: Multiple Template Variables
---------------------------------------
[Shows substitution of multiple variables including address]

✅ Example completed successfully
```

## Related Concepts

- **Template Substitution Basics**: [72-teal-template-parameter-substitution](../72-teal-template-parameter-substitution)
- **App Deployment**: [10-appclient-create-and-call](../10-appclient-create-and-call)
- **App Factory Pattern**: [11-appclient-deploy](../11-appclient-deploy)
- **TEAL Programming**: Algorand's smart contract language

## Learn More

- [Algorand Developer Portal - Smart Contracts](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/)
- [TEAL Language Reference](https://developer.algorand.org/docs/get-details/dapps/avm/teal/)
- [TEAL Template Variables](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/frontend/smartsigs/#template-variables)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
