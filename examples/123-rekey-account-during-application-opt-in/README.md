# Example 123: Rekey Account During Application Opt-In

This example demonstrates how to rekey an account during an application opt-in transaction, showcasing Algorand's powerful account security feature that allows changing signing authority while maintaining the same address.

## Core Concept

**Account rekeying** is a fundamental Algorand feature that allows you to change the signing authority of an account without changing its address. This is a powerful security mechanism unique to Algorand's architecture.

When you rekey an account:

1. **Address stays the same**: The account address never changes
2. **Signing authority changes**: Future transactions must be signed with the new key
3. **Atomic operation**: Rekeying happens as part of any transaction (payment, opt-in, app call, etc.)
4. **Tracked on-chain**: The `auth-addr` field shows the current signing authority
5. **Reversible**: You can rekey back to the original or to another address

Key characteristics:
- **Non-destructive**: All balances, assets, and app state remain intact
- **Immediate**: Takes effect in the same transaction that performs the rekey
- **Flexible**: Can be combined with any transaction type
- **Secure**: Original key becomes useless once rekeying is confirmed
- **Use cases**: Key rotation, security upgrades, multi-sig patterns, account recovery

## What This Example Shows

This example demonstrates:

1. **Deploying a smart contract**: Simple app that accepts opt-in transactions
2. **Rekeying during opt-in**: Using the `rekeyTo` parameter during app opt-in
3. **Verifying rekey success**: Checking the `auth-addr` field in account information
4. **Using rekeyed accounts**: Creating and using a `rekeyedAccount` object
5. **Understanding implications**: How rekeying affects transaction signing

## Transaction Flow

```
Step 1: Initial State
┌──────────────────────────────────┐
│ Account Address: ABC123...       │
│ Auth Address: (none)             │
│ Signing Key: Original Key        │
│ Status: Normal account           │
└──────────────────────────────────┘

Step 2: Opt-In with Rekey
┌──────────────────────────────────┐
│ Transaction: App Opt-In          │
│   sender: ABC123...              │
│   appId: 1234                    │
│   rekeyTo: XYZ789...             │
│ Effect: Opt-in + Rekey           │
└──────────────────────────────────┘

Step 3: Rekeyed State
┌──────────────────────────────────┐
│ Account Address: ABC123...       │
│ Auth Address: XYZ789...          │
│ Signing Key: New Key             │
│ Status: Rekeyed account          │
└──────────────────────────────────┘

Step 4: Using Rekeyed Account
┌──────────────────────────────────┐
│ Transaction: Payment             │
│   sender: ABC123...  (address)   │
│   signer: XYZ789...  (new key)   │
│ Result: ✅ Success               │
└──────────────────────────────────┘
```

## Account Information Fields

### Before Rekeying

```typescript
{
  address: "ABC123...",
  authAddr: undefined,        // No rekey - using original key
  balance: { microAlgo: 10000000n },
  ...
}
```

### After Rekeying

```typescript
{
  address: "ABC123...",
  authAddr: "XYZ789...",      // Rekeyed! Must sign with this key
  balance: { microAlgo: 9998000n },
  ...
}
```

The presence of `authAddr` indicates the account has been rekeyed.

## Key API Pattern

The pattern for rekeying during application opt-in:

```typescript
// Step 1: Create accounts
const testAccount = algorand.account.random()
const rekeyTarget = algorand.account.random()

// Step 2: Deploy an application
const appResult = await algorand.send.appCreate({
  sender: testAccount.addr,
  approvalProgram,
  clearStateProgram,
  schema: { ... },
})

// Step 3: Opt-in with rekey (atomic operation)
await algorand.send.appCall({
  sender: testAccount.addr,
  appId: appResult.appId,
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  rekeyTo: rekeyTarget.addr,  // ← The rekey happens here
})

// Step 4: Create rekeyed account object
const rekeyedAccount = algorand.account.rekeyed(
  testAccount.addr,    // Original address
  rekeyTarget          // New signing authority
)

// Step 5: Use rekeyed account for transactions
await algorand.send.payment({
  sender: rekeyedAccount.addr,  // From original address
  receiver: someAddress,
  amount: (0.001).algos(),
  // Signed with rekeyTarget's key automatically!
})
```

Key points:
- **`rekeyTo` parameter**: Available on all transaction types
- **`algorand.account.rekeyed()`**: Creates an account object that uses the new key
- **Automatic signing**: The SDK handles signing with the correct key
- **Address preservation**: Send from original address, sign with new key

## Step-by-Step Breakdown

### Step 1: Set Up Accounts

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()
const testAccount = algorand.account.random()

// Fund the test account
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: testAccount.addr,
  amount: (10).algos(),
})

// Create the rekey target (new signing authority)
const rekeyTarget = algorand.account.random()
```

### Step 2: Deploy Smart Contract

```typescript
const approvalProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

txn OnCompletion
int OptIn
==
bnz handle_opt_in

int 0
return

create:
int 1
return

handle_opt_in:
int 1
return`

const appResult = await algorand.send.appCreate({
  sender: testAccount.addr,
  approvalProgram,
  clearStateProgram,
  schema: {
    globalInts: 1,
    globalByteSlices: 0,
    localInts: 1,
    localByteSlices: 0,
  },
})
```

### Step 3: Check Account Before Rekeying

```typescript
const accountInfoBefore = await algorand.account.getInformation(testAccount.addr)

console.log('Address:', accountInfoBefore.address)
console.log('Auth Address:', accountInfoBefore.authAddr || '(none - using original key)')
console.log('Balance:', accountInfoBefore.balance.microAlgo, 'microALGOs')

// Output:
//   Address: ABC123...
//   Auth Address: (none - using original key)
//   Balance: 9999000n microALGOs
```

### Step 4: Opt-In with Rekey

```typescript
await algorand.send.appCall({
  sender: testAccount.addr,
  appId: appResult.appId,
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  rekeyTo: rekeyTarget.addr,  // Atomic rekey during opt-in
})
```

### Step 5: Verify Rekeying Succeeded

```typescript
const accountInfoAfter = await algorand.account.getInformation(testAccount.addr)

console.log('Address:', accountInfoAfter.address)
console.log('Auth Address:', accountInfoAfter.authAddr)
console.log('Balance:', accountInfoAfter.balance.microAlgo, 'microALGOs')

// Output:
//   Address: ABC123...
//   Auth Address: XYZ789...  ← Now shows the rekey target!
//   Balance: 9998000n microALGOs
```

### Step 6: Use the Rekeyed Account

```typescript
// Create a rekeyed account object
const rekeyedAccount = algorand.account.rekeyed(testAccount.addr, rekeyTarget)

// Send a payment from the rekeyed account
const result = await algorand.send.payment({
  sender: rekeyedAccount.addr,
  receiver: dispenser.addr,
  amount: (0.001).algos(),
})

// The transaction:
// - Sends FROM testAccount.addr (original address)
// - Signed WITH rekeyTarget's key (new authority)
```

## Use Cases

### 1. Key Rotation for Security

Regularly rotate keys without changing addresses:

```typescript
// Initial setup
const primaryAccount = algorand.account.fromMnemonic(mnemonic)
const newKey = algorand.account.random()

// Rotate to new key
await algorand.send.payment({
  sender: primaryAccount.addr,
  receiver: primaryAccount.addr,
  amount: (0).algos(),
  rekeyTo: newKey.addr,
})

// Archive old key securely
// Use new key for all future transactions
```

### 2. Upgrading to Multi-Signature

Convert a single-key account to multi-sig:

```typescript
const account = algorand.account.fromMnemonic(mnemonic)

// Create multi-sig address
const multiSigParams = {
  version: 1,
  threshold: 2,
  addrs: [addr1, addr2, addr3],
}
const multiSigAddr = algosdk.multisigAddress(multiSigParams)

// Rekey to multi-sig
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: (0).algos(),
  rekeyTo: multiSigAddr,
})

// Now requires 2-of-3 signatures
```

### 3. Account Recovery Pattern

Implement recoverable accounts:

```typescript
// Setup: Account with recovery key
const mainKey = algorand.account.random()
const recoveryKey = algorand.account.random() // Stored securely offline

// Normal operation: Use main key
// ...

// Recovery scenario: Main key compromised
// Use recovery key to rekey to new main key
const newMainKey = algorand.account.random()

await algorand.send.payment({
  sender: mainKey.addr,
  receiver: mainKey.addr,
  amount: (0).algos(),
  rekeyTo: newMainKey.addr,
  // This transaction signed by recovery key
})
```

### 4. Smart Contract Custody

Transfer control to a smart contract:

```typescript
const userAccount = algorand.account.random()
const custodyAppAddress = algosdk.getApplicationAddress(custodyAppId)

// Rekey to smart contract
await algorand.send.appCall({
  sender: userAccount.addr,
  appId: custodyAppId,
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  rekeyTo: custodyAppAddress,
})

// Now only the smart contract can authorize transactions
```

### 5. Temporary Delegation

Grant temporary access to another key:

```typescript
const owner = algorand.account.random()
const delegate = algorand.account.random()

// Delegate control
await algorand.send.payment({
  sender: owner.addr,
  receiver: owner.addr,
  amount: (0).algos(),
  rekeyTo: delegate.addr,
})

// Delegate performs operations...

// Revoke delegation
const rekeyed = algorand.account.rekeyed(owner.addr, delegate)
await algorand.send.payment({
  sender: rekeyed.addr,
  receiver: rekeyed.addr,
  amount: (0).algos(),
  rekeyTo: owner.addr,  // Rekey back to original
})
```

## Rekeying with Different Transaction Types

You can rekey with any transaction type:

### Payment Transaction

```typescript
await algorand.send.payment({
  sender: account.addr,
  receiver: someAddress,
  amount: (1).algos(),
  rekeyTo: newKey.addr,
})
```

### Asset Transfer

```typescript
await algorand.send.assetTransfer({
  sender: account.addr,
  receiver: someAddress,
  assetId: assetId,
  amount: 100n,
  rekeyTo: newKey.addr,
})
```

### Application Call

```typescript
await algorand.send.appCall({
  sender: account.addr,
  appId: appId,
  rekeyTo: newKey.addr,
})
```

### Application Opt-In (This Example)

```typescript
await algorand.send.appCall({
  sender: account.addr,
  appId: appId,
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  rekeyTo: newKey.addr,
})
```

## Best Practices

### 1. Verify Rekeying Succeeded

Always check the `authAddr` field after rekeying:

```typescript
const accountInfo = await algorand.account.getInformation(account.addr)

if (accountInfo.authAddr !== expectedRekeyTarget) {
  throw new Error('Rekeying failed or auth address unexpected!')
}
```

### 2. Secure Key Storage

```typescript
// ❌ Don't: Keep old keys accessible after rekeying
const oldKey = account
await rekeyToNewKey()
// oldKey still in memory!

// ✅ Do: Securely archive or destroy old keys
const oldKeyMnemonic = algosdk.secretKeyToMnemonic(account.sk)
await securelyArchive(oldKeyMnemonic)
account = null  // Clear from memory
```

### 3. Document Rekey Operations

```typescript
// Maintain audit log
const rekeyLog = {
  timestamp: Date.now(),
  accountAddress: account.addr,
  oldAuthAddr: accountInfoBefore.authAddr || account.addr,
  newAuthAddr: newKey.addr,
  reason: 'Scheduled key rotation',
  txId: result.txIds[0],
}
await saveAuditLog(rekeyLog)
```

### 4. Test Rekeyed Account

```typescript
// Verify the rekeyed account works before archiving old key
const rekeyedAccount = algorand.account.rekeyed(account.addr, newKey)

await algorand.send.payment({
  sender: rekeyedAccount.addr,
  receiver: rekeyedAccount.addr,
  amount: (0).algos(),
})

console.log('✅ Rekeyed account verified working')
```

### 5. Handle Rekey Reversal

```typescript
// Keep ability to rekey back if needed
async function rekeyBack(
  address: string,
  currentAuthKey: Account,
  targetAuthAddr: string
) {
  const rekeyed = algorand.account.rekeyed(address, currentAuthKey)

  await algorand.send.payment({
    sender: rekeyed.addr,
    receiver: rekeyed.addr,
    amount: (0).algos(),
    rekeyTo: targetAuthAddr,
  })
}
```

## Common Pitfalls

### 1. Forgetting to Use Rekeyed Account Object

```typescript
// ❌ Wrong: Using original account after rekeying
await algorand.send.payment({
  sender: originalAccount.addr,  // This still has old key!
  receiver: someAddress,
  amount: (1).algos(),
})
// May appear to work in SDK but is using wrong key

// ✅ Correct: Use rekeyed account object
const rekeyedAccount = algorand.account.rekeyed(
  originalAccount.addr,
  newKey
)
await algorand.send.payment({
  sender: rekeyedAccount.addr,
  receiver: someAddress,
  amount: (1).algos(),
})
```

### 2. Losing Access to New Key

```typescript
// ❌ Don't: Rekey without securing new key
const newKey = algorand.account.random()
await rekeyTransaction({ rekeyTo: newKey.addr })
// If newKey is lost, account is permanently inaccessible!

// ✅ Do: Secure new key before rekeying
const newKey = algorand.account.random()
const mnemonic = algosdk.secretKeyToMnemonic(newKey.sk)
await securelyStore(mnemonic)
await rekeyTransaction({ rekeyTo: newKey.addr })
```

### 3. Rekeying to Invalid Address

```typescript
// ❌ Wrong: Rekeying to zero address
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: (0).algos(),
  rekeyTo: algosdk.ALGORAND_ZERO_ADDRESS,
})
// Account becomes permanently unusable!

// ✅ Correct: Validate address before rekeying
if (!algosdk.isValidAddress(newKeyAddr)) {
  throw new Error('Invalid rekey target address')
}
```

### 4. Not Checking Transaction Confirmation

```typescript
// ❌ Don't: Assume rekey succeeded without checking
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: (0).algos(),
  rekeyTo: newKey.addr,
})
// Archive old key immediately - risky!

// ✅ Do: Verify before archiving old key
const result = await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: (0).algos(),
  rekeyTo: newKey.addr,
})

// Wait for confirmation and verify
const accountInfo = await algorand.account.getInformation(account.addr)
if (accountInfo.authAddr === newKey.addr) {
  await securelyArchiveOldKey()
}
```

### 5. Confusion Between Address and Auth Address

```typescript
// Account address: Never changes (ABC123...)
// Auth address: Changes when rekeyed (XYZ789...)

// ❌ Wrong understanding:
// "Rekeying changes the account address"

// ✅ Correct understanding:
// "Rekeying changes the signing authority while keeping the same address"

console.log('Address:', account.address)        // ABC123... (never changes)
console.log('Auth Addr:', accountInfo.authAddr) // XYZ789... (changes on rekey)
```

## Security Considerations

### 1. Irreversibility Without New Key

Once rekeyed, the original key becomes useless. **You must have access to the new key** to rekey back or perform any operations.

### 2. Phishing Risk

Bad actors may trick users into rekeying to attacker-controlled addresses:

```typescript
// Validate rekey target in UI
function validateRekeyTarget(targetAddr: string) {
  if (!algosdk.isValidAddress(targetAddr)) {
    throw new Error('Invalid address')
  }

  if (targetAddr === algosdk.ALGORAND_ZERO_ADDRESS) {
    throw new Error('Cannot rekey to zero address')
  }

  // Additional checks based on your application
}
```

### 3. Multi-Sig Threshold

When rekeying to multi-sig, ensure threshold is achievable:

```typescript
const multiSigParams = {
  version: 1,
  threshold: 2,
  addrs: [addr1, addr2, addr3],  // 3 addresses
}

// Ensure you control at least 'threshold' keys
// Otherwise account becomes inaccessible
```

### 4. Smart Contract Risks

Rekeying to a smart contract transfers complete control:

```typescript
// Ensure contract has proper safeguards
// - Ability to rekey back
// - Proper access controls
// - Audited logic
```

## Error Handling

### Rekey Transaction Failure

```typescript
try {
  await algorand.send.payment({
    sender: account.addr,
    receiver: account.addr,
    amount: (0).algos(),
    rekeyTo: newKey.addr,
  })
} catch (error) {
  console.error('Rekey failed:', error)

  if (error.message.includes('overspend')) {
    console.error('Insufficient balance for transaction fee')
  } else if (error.message.includes('invalid address')) {
    console.error('Invalid rekey target address')
  }

  // Old key still valid, can retry
}
```

### Verification Failure

```typescript
const accountInfo = await algorand.account.getInformation(account.addr)

if (accountInfo.authAddr !== expectedNewKey) {
  console.error('Rekey verification failed!')
  console.error('Expected:', expectedNewKey)
  console.error('Actual:', accountInfo.authAddr)

  // Decide on recovery strategy
}
```

## Related Examples

- [Example 10: Account Creation and Funding](../10-account-creation-and-funding/README.md) - Creating and managing accounts
- [Example 32: Fund App Account](../32-fund-app-account/README.md) - Funding application accounts
- [Example 118: Multi-Account Transaction Groups](../118-multi-account-transaction-groups-with-different-signers/README.md) - Multiple signers

## Running This Example

1. Ensure AlgoKit LocalNet is running:
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

The example will:
1. Create and fund a test account
2. Create a rekey target account
3. Deploy a simple smart contract
4. Show account info before rekeying (no `authAddr`)
5. Opt-in to the app with rekey parameter
6. Show account info after rekeying (`authAddr` is set)
7. Use the rekeyed account to send a payment
8. Demonstrate that rekeying succeeded

## Key Takeaways

1. **Rekeying changes signing authority, not address**: The account address stays the same forever
2. **Atomic operation**: Rekeying happens as part of any transaction (opt-in, payment, etc.)
3. **Check `authAddr` field**: Presence of `authAddr` indicates account is rekeyed
4. **Use `algorand.account.rekeyed()`**: Create account object that uses new signing key
5. **Available on all transactions**: Any transaction type can include `rekeyTo`
6. **Secure new key first**: Losing access to new key means losing account access
7. **Powerful security tool**: Enables key rotation, multi-sig upgrades, recovery patterns
8. **Reversible with new key**: Can rekey back or to another address if you control new key
9. **Test after rekeying**: Verify rekeyed account works before archiving old key
10. **Document operations**: Maintain audit logs for security and compliance

This pattern is essential for **production Algorand applications**, enabling robust security practices and flexible account management!
