# Account Rekeying with Application Opt-In

This example demonstrates how to **rekey an account** during an application opt-in transaction. Account rekeying is a powerful security feature that allows you to change the signing authority for an account without changing its address.

## Overview

**Account rekeying** on Algorand allows you to transfer signing authority from one private key to another while keeping the same account address. This is different from transferring funds—the account address stays the same, but a different private key gains control over transactions.

### What is Rekeying?

When you rekey an account:
- **The account address stays the same** - All assets, apps, and state remain at the original address
- **The signing authority changes** - A different private key can now authorize transactions
- **It's reversible** - You can rekey back using the new authority
- **It's atomic** - Can be combined with other transactions (like app opt-in)

### When to Use Rekeying

- **Key Rotation**: Periodically change signing keys for security
- **Multi-Sig Setup**: Transfer control to a multi-signature account
- **Security Upgrades**: Move from single-sig to multi-sig without changing address
- **Account Recovery**: Transfer control if you need to change key management
- **Smart Contract Control**: Give a smart contract authority over an account

## Code Walkthrough

### Step 1: Initialize and Create Accounts

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

// Create and fund the account we'll rekey
const testAccount = algorand.account.random()
await algorand.account.ensureFunded(testAccount, dispenser, (10).algos())
console.log('Main account address:', testAccount.addr)

// Create the account that will gain signing authority
const rekeyTo = algorand.account.random()
console.log('Rekey target address:', rekeyTo.addr)
```

**Key Points**:
- `testAccount` is the account we'll rekey (will retain its address)
- `rekeyTo` is the account that will gain signing authority
- Fund `testAccount` because it needs ALGO for transactions

### Step 2: Deploy Application

```typescript
const factory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: testAccount.addr,
})

const { appClient } = await factory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 0,
    TMPL_DELETABLE: 0,
    TMPL_VALUE: 1,
  },
})
console.log('Application deployed with ID:', appClient.appId)
```

**Why Deploy an App**:
- This example shows rekeying during an app operation
- You can rekey during any transaction type (payment, asset transfer, app call, etc.)
- Combining rekey with another operation is more efficient than separate transactions

### Step 3: Opt-In and Rekey in Single Transaction

```typescript
await appClient.send.optIn.optIn({
  args: [],
  rekeyTo, // This is the key parameter!
})
console.log('✓ Account opted in and rekeyed successfully')
```

**Critical Parameters**:
- `rekeyTo`: The account that will gain signing authority
- This is a **single transaction** that:
  1. Opts the account into the application
  2. Rekeys the account to `rekeyTo`

**What Happens On-Chain**:
1. Transaction is submitted with `rekeyTo` field set
2. Algorand processes the app opt-in
3. Algorand updates the account's auth-addr to `rekeyTo.addr`
4. Future transactions from `testAccount.addr` must be signed by `rekeyTo`'s private key

### Step 4: Create Rekeyed Account Object

```typescript
const rekeyedAccount = algorand.account.rekeyed(testAccount, rekeyTo)
console.log('Rekeyed account created:')
console.log('  Address:', rekeyedAccount.addr, '(original address)')
console.log('  Signer:', 'rekeyTo private key')
```

**What is `algorand.account.rekeyed()`**:
- Creates an account object that represents the rekeyed state
- Uses `testAccount.addr` as the address
- Uses `rekeyTo` private key for signing
- This is how you interact with the rekeyed account

### Step 5: Verify Rekeying Works

```typescript
const result = await algorand.send.payment({
  amount: (0).algos(), // Zero-amount payment to test signing
  sender: rekeyedAccount,
  receiver: testAccount.addr,
})
console.log('✓ Payment successful with transaction ID:', result.txIds[0])
```

**Why This Test Matters**:
- If rekeying didn't work, this transaction would **fail**
- The transaction is signed by `rekeyTo`'s private key
- But it appears to come from `testAccount.addr`
- This confirms the rekey was successful

## API Patterns (AlgoKit Utils v9.1.2)

### Rekeying During App Opt-In

```typescript
await appClient.send.optIn.optIn({
  args: [],
  rekeyTo: Account | SigningAccount, // Account to rekey to
})
```

### Rekeying During Any Transaction

You can add `rekeyTo` to any transaction type:

```typescript
// During payment
await algorand.send.payment({
  sender: account,
  receiver: recipientAddr,
  amount: (1).algos(),
  rekeyTo: newAuthorityAccount,
})

// During asset transfer
await algorand.send.assetTransfer({
  sender: account,
  receiver: recipientAddr,
  assetId: assetId,
  amount: 10n,
  rekeyTo: newAuthorityAccount,
})

// During app creation
await algorand.send.appCreate({
  sender: account,
  approvalProgram: program,
  clearStateProgram: clearProgram,
  schema: { globalInts: 1, globalBytes: 1 },
  rekeyTo: newAuthorityAccount,
})
```

### Creating Rekeyed Account Object

```typescript
const rekeyedAccount = algorand.account.rekeyed(
  originalAccount,  // Account with the original address
  authAccount      // Account with signing authority
)
```

**Returns**: An account object with:
- `addr`: The original account's address
- `signer`: A signer that uses the auth account's private key

### Rekeying Back

To reverse a rekey, the current authority must sign:

```typescript
// Use the rekeyed account (which has signing authority)
await algorand.send.payment({
  amount: (0).algos(),
  sender: rekeyedAccount,
  receiver: rekeyedAccount.addr,
  rekeyTo: testAccount, // Rekey back to original
})
```

## Important Security Considerations

### 1. Loss of Control

Once you rekey, **the original private key loses all control**:
- The original key **cannot** sign any transactions
- Only the new key has signing authority
- **Keep the new key safe** - losing it means losing the account

### 2. Rekeying is Permanent (Until Reversed)

- Rekeying persists until you rekey again
- You must use the current authority to reverse a rekey
- There's no "undo" button - you need the new key to rekey back

### 3. Auth-Addr Field

```typescript
const accountInfo = await algorand.account.getInformation(testAccount.addr)
console.log('Auth address:', accountInfo.authAddr)
// If rekeyed: shows rekeyTo.addr
// If not rekeyed: undefined or same as account address
```

### 4. Multi-Sig Rekeying

You can rekey to a multi-signature account for enhanced security:

```typescript
const multiSigAccount = algorand.account.multiSig(
  {
    version: 1,
    threshold: 2,
    addrs: [addr1, addr2, addr3],
  },
  [signer1, signer2]
)

await appClient.send.optIn.optIn({
  args: [],
  rekeyTo: multiSigAccount,
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
Main account address: 2I2IP7MEYF7G26TB3O6RC2HBAUTTNCSI4ZYDVUKZJJZQBO5QNK5I3UNNTU
Rekey target address: BXVJGOZUTJYKYTUMEHTRZAUM...

Deploying application...
Application deployed with ID: 1284n

Opting into application and rekeying account...
✓ Account opted in and rekeyed successfully
  The testAccount is now controlled by rekeyTo's private key

Rekeyed account created:
  Address: 2I2IP7MEYF7G26TB3O6RC2HBAUTTNCSI4ZYDVUKZJJZQBO5QNK5I3UNNTU (original address)
  Signer: rekeyTo private key

Testing rekeyed account by sending a payment...
✓ Payment successful with transaction ID: Q5CHOOFLGH67XWT4JWLNHWEUIDJTUI4ZSUVQ65BAJWBPEBMQOUUA

✓ Account rekeying confirmed working!
The rekeyed account can now sign transactions for the original address.

📝 Important Notes:
  - The account address never changes (still testAccount.addr)
  - Only the signing authority changes (now rekeyTo's key)
  - All assets and apps remain at the original address
  - To rekey back, use the rekeyTo account to sign a rekey transaction
```

## Real-World Use Cases

### 1. Periodic Key Rotation

```typescript
// Rotate keys every 30 days for security
const newKey = algorand.account.random()
await algorand.send.payment({
  amount: (0).algos(),
  sender: currentAuthAccount,
  receiver: accountAddress,
  rekeyTo: newKey,
})
```

### 2. Upgrading to Multi-Sig

```typescript
// Start with single key, upgrade to multi-sig
const multiSig = algorand.account.multiSig({
  version: 1,
  threshold: 2,
  addrs: [admin1, admin2, admin3],
}, [signer1, signer2])

await algorand.send.payment({
  amount: (0).algos(),
  sender: singleKeyAccount,
  receiver: singleKeyAccount.addr,
  rekeyTo: multiSig,
})
```

### 3. Smart Contract Custody

```typescript
// Let a smart contract control the account
// (contract address becomes the authority)
await algorand.send.payment({
  amount: (0).algos(),
  sender: userAccount,
  receiver: userAccount.addr,
  rekeyTo: smartContractAddress,
})
```

### 4. Account Recovery

```typescript
// User lost access, admin helps recover
// (requires user to have previously rekeyed to recovery address)
const recoveredAccount = algorand.account.rekeyed(
  lostAccount,
  recoveryAuthority
)

// Can now rekey to user's new key
await algorand.send.payment({
  amount: (0).algos(),
  sender: recoveredAccount,
  receiver: lostAccount.addr,
  rekeyTo: userNewKey,
})
```

## Comparison: Rekeying vs Transferring

| Aspect | Rekeying | Transferring Assets |
|--------|----------|---------------------|
| **Address** | Stays the same | Changes to new account |
| **Assets** | Remain at address | Must be transferred |
| **App State** | Remains at address | Lost (must opt-in again) |
| **Signing Key** | Changes | Stays with each account |
| **Gas Cost** | Low (one transaction) | High (transfer each asset) |
| **Reversibility** | Easy (just rekey back) | Complex (transfer everything back) |

## Key Takeaways

1. **Address Stays Same**: Rekeying changes signing authority, not the address
2. **Use `rekeyTo` Parameter**: Can be added to any transaction type
3. **Create Rekeyed Object**: Use `algorand.account.rekeyed()` to interact with rekeyed accounts
4. **Security Critical**: Losing the new key means losing the account
5. **Reversible**: Can rekey back using current authority
6. **Efficient**: Combine with other operations (opt-in, payment, etc.)
7. **Check Auth-Addr**: Use `getInformation()` to verify rekey status

## Learn More

- [Algorand Rekeying Documentation](https://developer.algorand.org/docs/get-details/accounts/rekey/)
- [AlgoKit Utils TypeScript Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Account Security Best Practices](https://developer.algorand.org/docs/get-details/accounts/#security-considerations)
- [Multi-Signature Accounts](https://developer.algorand.org/docs/get-details/accounts/create/#multisignature)
