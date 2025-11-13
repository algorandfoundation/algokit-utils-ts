# ARC56 Error Debugging Without Source Maps

This example demonstrates how ARC56 (Algorand ABI specification) provides rich error debugging information even when source maps are not available. This is particularly important when template variables affect code offsets in the compiled TEAL, which can make debugging challenging.

## Overview

When smart contracts fail, understanding **where** and **why** they failed is crucial for debugging. Traditionally, you might only see cryptic TEAL program counter (PC) values and basic error messages. With ARC56, even without source maps, you get:

- **Source file references**: The original TypeScript/Python file and line number
- **Source code context**: The actual line of code that failed
- **Template variable names**: References to template variables (e.g., `TMPL_uint64TmplVar`)
- **TEAL instruction context**: The TEAL opcode that caused the failure
- **Surrounding code**: Lines before and after the failure point

## Why This Matters

### The Challenge with Template Variables

Template variables are placeholders in smart contract code that get replaced with actual values at deployment time. For example:

```typescript
// Contract code
assert(this.uint64TmplVar)
```

When deployed with `TMPL_uint64TmplVar = 0`, this becomes:

```teal
intc 1  // TMPL_uint64TmplVar (value: 0)
assert  // This will fail!
```

The problem: Template variables can change the bytecode offsets, making it hard to correlate errors back to source code. ARC56 solves this by embedding rich metadata in the contract specification.

### Without ARC56

Traditional error message:
```
logic eval error: assert failed pc=156
```

You'd need to:
1. Look up PC 156 in the TEAL code
2. Figure out which source line that corresponds to
3. Guess what the template variable values were

### With ARC56

Enhanced error message:
```
Error at tests/example-contracts/arc56_templates/templates.algo.ts:14
assert(this.uint64TmplVar)
intc 1 // TMPL_uint64TmplVar
assert <--- Error
```

You immediately know:
- The exact source file and line number
- The source code that failed
- Which template variable was involved
- The TEAL instruction that failed

## Code Walkthrough

### Step 1: Deploy with Template Variables

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import arc56AppSpec from './arc56_app.json' with { type: 'json' }

const algorand = AlgorandClient.defaultLocalNet()
const account = await algorand.account.localNetDispenser()

// Create app factory with ARC56 spec
const factory = algorand.client.getAppFactory({
  appSpec: arc56AppSpec,
  defaultSender: account.addr,
})

// Deploy with template variable values
const { result: deployResult } = await factory.deploy({
  createParams: {
    method: 'createApplication',
  },
  deployTimeParams: {
    TMPL_bytes64TmplVar: '0'.repeat(64),
    TMPL_uint64TmplVar: 0,  // This will cause the assertion to fail!
    TMPL_bytes32TmplVar: '0'.repeat(32),
    TMPL_bytesTmplVar: 'foo',
  },
})
```

**Key Points**:
- Template variables are prefixed with `TMPL_`
- Values are provided at deployment time via `deployTimeParams`
- Setting `TMPL_uint64TmplVar` to `0` will cause the contract's assertion to fail

### Step 2: Create Client Without Source Maps

```typescript
// Create a new client that won't have the source map from compilation
// This simulates connecting to an already-deployed app
const appClient = algorand.client.getAppClientById({
  appId: deployResult.appId,
  defaultSender: account.addr,
  appSpec: arc56AppSpec,
})
```

**Why This Matters**:
- When you deploy, you have access to source maps from compilation
- When connecting to an existing app, source maps may not be available
- ARC56 metadata in the app spec still provides rich error information

### Step 3: Call Method That Fails

```typescript
try {
  // This call will fail because TMPL_uint64TmplVar is 0
  await appClient.send.call({ method: 'tmpl', args: [] })
  console.log('❌ Unexpected: call should have failed')
} catch (e: any) {
  console.log('✓ Error caught as expected')
  console.log(e.stack)
}
```

### Step 4: Examine Enhanced Error Information

The error output shows:

```
log

// tests/example-contracts/arc56_templates/templates.algo.ts:14
// assert(this.uint64TmplVar)
intc 1 // TMPL_uint64TmplVar
assert <--- Error
retsub
```

**Breaking it down**:
- **Line 1**: `log` - Previous TEAL instruction
- **Lines 2-3**: Source file reference and original code
- **Line 4**: `intc 1 // TMPL_uint64TmplVar` - The template variable reference
- **Line 5**: `assert <--- Error` - The exact instruction that failed

## API Patterns (AlgoKit Utils v9.1.2)

### Getting LocalNet Dispenser

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const account = await algorand.account.localNetDispenser()
```

### Creating App Factory with ARC56 Spec

```typescript
const factory = algorand.client.getAppFactory({
  appSpec: arc56AppSpec,  // ARC56 JSON spec
  defaultSender: account.addr,
})
```

### Deploying with Template Parameters

```typescript
const { result: deployResult, appClient } = await factory.deploy({
  createParams: {
    method: 'createApplication',  // Method to call for creation
  },
  deployTimeParams: {
    TMPL_variableName: value,  // Template variable values
    // ... more template variables
  },
})
```

### Getting App Client by ID

```typescript
const appClient = algorand.client.getAppClientById({
  appId: deployResult.appId,
  defaultSender: account.addr,
  appSpec: arc56AppSpec,
})
```

## Running This Example

```bash
# Install dependencies
npm install

# Ensure AlgoKit LocalNet is running
algokit localnet start

# Run the example
npm start
```

**Expected Output**:
```
=== ARC56 Error Debugging Without Source Maps ===

Step 1: Deploy application with template variables
✓ Application deployed with ID: 1258

Step 2: Create new app client without source maps
✓ App client created

Step 3: Call method that will fail

✓ Error caught as expected

Step 4: Examine error stack trace
--- Error Stack Trace ---
log

// tests/example-contracts/arc56_templates/templates.algo.ts:14
// assert(this.uint64TmplVar)
intc 1 // TMPL_uint64TmplVar
assert <--- Error
retsub
--- End Stack Trace ---

=== Example Complete ===
```

## Key Takeaways

1. **ARC56 Provides Rich Debugging**: Even without source maps, you get file references, source code, and context
2. **Template Variables Preserved**: Template variable names are included in error output
3. **Works After Deployment**: Error information is available even when connecting to existing apps
4. **Program Counter Mapping**: PC values are automatically mapped to source lines
5. **TEAL Context**: See the actual TEAL instructions that failed
6. **Production Ready**: These error messages work in production deployments

## Learn More

- [ARC-56 Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0056.md)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [TEAL Opcode Reference](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/)
- [Smart Contract Debugging Guide](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/debugging/)
