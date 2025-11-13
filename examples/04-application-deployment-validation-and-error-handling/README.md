# Application Deployment Validation and Error Handling

This example demonstrates how AlgoKit Utils validates template variables during application deployment, helping you catch configuration errors before they reach the blockchain.

## What This Example Shows

This example teaches you how to:
- Understand the SDK's validation of deploy-time template variables (TMPL_UPDATABLE and TMPL_DELETABLE)
- See what error messages you get when required template variables are missing from TEAL code
- Learn how to properly structure TEAL contracts with deploy-time controls
- Deploy applications with correct template variable configuration

## Why This Matters

Template variable validation is crucial for several reasons:

1. **Early Error Detection**: Catches missing template variables before submitting deployment transactions
2. **Cost Savings**: Prevents wasted transaction fees from invalid deployments
3. **Clear Error Messages**: Provides specific feedback about which template variable is missing
4. **Deploy-Time Flexibility**: Template variables allow you to configure updatability and deletability at deployment time rather than hardcoding them

Understanding template variables is important because:
- **TMPL_UPDATABLE**: Required when `metadata.updatable` is set to `true`
- **TMPL_DELETABLE**: Required when `metadata.deletable` is set to `true`
- These variables enable flexible deployment strategies without rewriting TEAL code
- They allow the same smart contract to be deployed with different control settings

Without this validation:
- You'd submit invalid deployment transactions to the blockchain
- You'd pay transaction fees for deployments that will fail
- Error messages would be less helpful
- Debugging deployment issues would take longer

## How It Works

The SDK validates that template variables exist in your TEAL code before deployment:

### 1. Missing TMPL_UPDATABLE
```typescript
const approvalWithoutUpdatable = `#pragma version 8
// This contract is missing TMPL_UPDATABLE template variable
int 1
return`

const deployment = {
  metadata: {
    updatable: true,  // ❌ Requesting updatability but TMPL_UPDATABLE is missing!
  },
  createParams: {
    approvalProgram: approvalWithoutUpdatable,
    // ...
  },
}

await algorand.appDeployer.deploy(deployment)
// Throws: "Deploy-time updatability control requested for app deployment, but TMPL_UPDATABLE not present in TEAL code"
```

### 2. Missing TMPL_DELETABLE
```typescript
const approvalWithoutDeletable = `#pragma version 8
// This contract is missing TMPL_DELETABLE template variable
int 1
return`

const deployment = {
  metadata: {
    deletable: true,  // ❌ Requesting deletability but TMPL_DELETABLE is missing!
  },
  createParams: {
    approvalProgram: approvalWithoutDeletable,
    // ...
  },
}

await algorand.appDeployer.deploy(deployment)
// Throws: "Deploy-time deletability control requested for app deployment, but TMPL_DELETABLE not present in TEAL code"
```

### 3. Correct Usage with Template Variables
```typescript
const approvalWithTemplates = `#pragma version 8
txn OnCompletion
int UpdateApplication
==
bnz update

txn OnCompletion
int DeleteApplication
==
bnz delete

int 1
return

update:
int TMPL_UPDATABLE  // ✅ Template variable for updatability
return

delete:
int TMPL_DELETABLE  // ✅ Template variable for deletability
return`

const deployment = {
  metadata: {
    updatable: true,
    deletable: true,
  },
  createParams: {
    approvalProgram: approvalWithTemplates,
    // ...
  },
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // Will be replaced in TEAL
    TMPL_DELETABLE: 1,  // Will be replaced in TEAL
  },
}

await algorand.appDeployer.deploy(deployment)
// ✅ Deployment successful!
```

The validation happens client-side before the transaction is sent, so:
- No blockchain interaction occurs for invalid deployments
- No transaction fees are wasted
- You get immediate feedback with clear error messages

## Prerequisites

- AlgoKit installed
- Docker installed (for LocalNet)
- Node.js and npm

## Running the Example

1. Start LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the example:
   ```bash
   npm start
   ```

## Expected Output

```
Application Deployment Validation Example
==========================================

Deployer account: [account-address]

--- Example 1: Missing TMPL_UPDATABLE ---
Attempting to deploy with updatable=true but no TMPL_UPDATABLE in code...

✅ Caught expected error:
   Message: Deploy-time updatability control requested for app deployment, but TMPL_UPDATABLE not present in TEAL code
   ✓ Error correctly identifies missing TMPL_UPDATABLE

--- Example 2: Missing TMPL_DELETABLE ---
Attempting to deploy with deletable=true but no TMPL_DELETABLE in code...

✅ Caught expected error:
   Message: Deploy-time deletability control requested for app deployment, but TMPL_DELETABLE not present in TEAL code
   ✓ Error correctly identifies missing TMPL_DELETABLE

--- Example 3: Correct Usage with Template Variables ---
Deploying with proper template variables...
✅ Deployment successful!
   App ID: [app-id]
   Updatable: true
   Deletable: true

==========================================
Key Takeaways:
1. Include TMPL_UPDATABLE when metadata.updatable is true
2. Include TMPL_DELETABLE when metadata.deletable is true
3. The SDK validates template variables before deployment
4. Template variables enable deploy-time control configuration

✅ Example completed successfully
```

## Key Takeaways

- The SDK validates template variables before sending deployment transactions
- TMPL_UPDATABLE must be present in TEAL code when `metadata.updatable` is `true`
- TMPL_DELETABLE must be present in TEAL code when `metadata.deletable` is `true`
- Validation happens client-side, saving transaction fees
- Error messages clearly indicate which template variable is missing
- Template variables are replaced with actual values (0 or 1) during deployment via `deployTimeParams`
- This validation works for all application deployments using `appDeployer.deploy`
- Template variables enable flexible deployment strategies without modifying TEAL code
- You cannot bypass this validation - it's a safety feature built into the SDK
