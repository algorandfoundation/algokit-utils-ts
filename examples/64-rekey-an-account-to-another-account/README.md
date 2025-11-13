# Rekey an Account to Another Account

A comprehensive example demonstrating account rekeying on Algorand, showing how to transfer account control without changing the account address.

## What This Example Shows

This example demonstrates:

1. **Account Rekeying Process** - How to rekey one account to be controlled by another
2. **Zero-Amount Payment for Rekey** - Using a payment transaction with rekeyTo parameter
3. **Auth Address Verification** - Checking the authorization address after rekeying
4. **Account Control Transfer** - Understanding that the original address remains but control changes
5. **Security Implications** - Key rotation and account recovery patterns
6. **LocalNet Testing** - Testing rekeying operations in a local development environment
7. **Account Information Retrieval** - Verifying the auth-addr property after rekeying

## Why This Matters

Account rekeying is a critical security feature on Algorand that enables:

- **Key Rotation**: Periodically change controlling keys without changing account addresses
- **Account Recovery**: Implement recovery mechanisms for compromised accounts
- **Multi-Signature Upgrades**: Transition from single-key to multi-sig control
- **Custody Solutions**: Transfer control to cold storage or institutional custody
- **Smart Contract Control**: Allow smart contracts to control accounts
- **Address Stability**: Maintain the same address while updating security mechanisms

Unlike other blockchains where losing keys means losing account access forever, Algorand's rekeying allows you to change who controls an account while keeping the same public address.

## How It Works

### 1. Create Original Account

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const originalAccount = await algorand.account.random()
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: originalAccount.addr,
  amount: algo(1), // Fund with 1 ALGO
})
```

**Why**: The original account needs funds to pay for the rekey transaction fee.

### 2. Create New Authority Account

```typescript
const newAuthAccount = await algorand.account.random()
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: newAuthAccount.addr,
  amount: algo(0.1), // Fund with 0.1 ALGO
})
```

**Why**: The new authority account will control the original account after rekeying.

### 3. Perform Rekeying

```typescript
await algorand.send.payment({
  sender: originalAccount.addr,
  receiver: originalAccount.addr,
  amount: algo(0), // Zero-amount payment
  rekeyTo: newAuthAccount.addr,
  signer: originalAccount, // Must be signed by current controller
})
```

**Key Points**:
- Use a zero-amount payment transaction with `rekeyTo` parameter
- Sender and receiver are the same (the account being rekeyed)
- Must be signed by the current controller (originalAccount in this case)
- After this transaction, only newAuthAccount can authorize transactions

### 4. Verify Rekeying

```typescript
const accountInfo = await algorand.account.getInformation(originalAccount.addr)
const authAddr = accountInfo['auth-addr'] || accountInfo.authAddr

if (authAddr && authAddr.toString() === newAuthAccount.addr.toString()) {
  console.log('✓ Rekeying successful!')
}
```

**Why**: Verify the auth-addr property matches the new authority account.

## Prerequisites

- AlgoKit installed
- Docker Desktop (for LocalNet)
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
Creating two accounts for rekeying demonstration...

Original account address: HKDJJTPLGIHQVWVVYKJ6Y6NTCDKRC2RQU2YPOWO56VULKQTL2GIJ2VICTA
New auth account address: J362OZE6MPHKSPJR53AHXYFUXFNTGFIYH33V2GD75CSTGAKXAOON7I6I7Y

Rekeying account...
Rekey transaction completed!

Account information after rekeying:
- Account address: HKDJJTPLGIHQVWVVYKJ6Y6NTCDKRC2RQU2YPOWO56VULKQTL2GIJ2VICTA
- Auth address (controlling account): J362OZE6MPHKSPJR53AHXYFUXFNTGFIYH33V2GD75CSTGAKXAOON7I6I7Y

✓ Rekeying successful!

The original account is now controlled by the new auth account.
All future transactions from the original account must be signed
by the new auth account's private key.
```

## Common Patterns

### 1. Basic Account Rekeying

```typescript
// Rekey account A to be controlled by account B
await algorand.send.payment({
  sender: accountA.addr,
  receiver: accountA.addr,
  amount: algo(0),
  rekeyTo: accountB.addr,
  signer: accountA, // Must be current controller
})
```

### 2. Rekey Back to Original

```typescript
// After rekeying, rekey back to original owner
await algorand.send.payment({
  sender: originalAccount.addr,
  receiver: originalAccount.addr,
  amount: algo(0),
  rekeyTo: originalAccount.addr, // Rekey back to self
  signer: newAuthAccount, // Must be current controller
})
```

### 3. Verify Auth Address Before Rekeying

```typescript
const accountInfo = await algorand.account.getInformation(account.addr)
const authAddr = accountInfo['auth-addr'] || accountInfo.authAddr

if (authAddr) {
  console.log(`Account is currently controlled by: ${authAddr}`)
} else {
  console.log('Account controls itself (no rekey)')
}
```

### 4. Rekey to Multi-Signature Account

```typescript
import algosdk from 'algosdk'

// Create multi-sig params
const mparams = {
  version: 1,
  threshold: 2,
  addrs: [addr1, addr2, addr3],
}

const multisigAddr = algosdk.multisigAddress(mparams)

// Rekey to multi-sig
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: algo(0),
  rekeyTo: multisigAddr,
  signer: account,
})
```

### 5. Key Rotation Strategy

```typescript
// Implement periodic key rotation
async function rotateKeys(
  account: string,
  currentSigner: algosdk.Account,
  newSigner: algosdk.Account
) {
  // Rekey to new authority
  await algorand.send.payment({
    sender: account,
    receiver: account,
    amount: algo(0),
    rekeyTo: newSigner.addr,
    signer: currentSigner,
  })

  console.log(`Keys rotated for account: ${account}`)
  return newSigner
}
```

### 6. Account Recovery Pattern

```typescript
// Recovery account that can rekey in emergencies
async function setupRecovery(
  mainAccount: algosdk.Account,
  recoveryAccount: algosdk.Account
) {
  // In emergency, recovery account can rekey
  await algorand.send.payment({
    sender: mainAccount.addr,
    receiver: mainAccount.addr,
    amount: algo(0),
    rekeyTo: recoveryAccount.addr,
    signer: mainAccount,
  })

  console.log('Recovery mechanism activated')
}
```

### 7. Check If Account Is Rekeyed

```typescript
async function isAccountRekeyed(address: string): Promise<boolean> {
  const accountInfo = await algorand.account.getInformation(address)
  const authAddr = accountInfo['auth-addr'] || accountInfo.authAddr
  return authAddr !== undefined && authAddr !== null
}

// Usage
if (await isAccountRekeyed(someAccount.addr)) {
  console.log('Account has been rekeyed')
}
```

## Best Practices

### 1. Always Verify After Rekeying

**Good**:
```typescript
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: algo(0),
  rekeyTo: newAuth.addr,
  signer: account,
})

// Verify immediately
const info = await algorand.account.getInformation(account.addr)
const authAddr = info['auth-addr'] || info.authAddr
if (authAddr?.toString() !== newAuth.addr.toString()) {
  throw new Error('Rekeying verification failed')
}
```

**Avoid**:
```typescript
// Rekeying without verification
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: algo(0),
  rekeyTo: newAuth.addr,
  signer: account,
})
// No verification - risky!
```

### 2. Use Zero-Amount Transactions

**Good**:
```typescript
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: algo(0), // Zero amount - just for rekeying
  rekeyTo: newAuth.addr,
  signer: account,
})
```

**Avoid**:
```typescript
// Don't send unnecessary funds when rekeying
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: algo(1), // Wasteful
  rekeyTo: newAuth.addr,
  signer: account,
})
```

### 3. Secure Key Storage

**Good**:
```typescript
// Store new authority keys securely
const newAuth = await algorand.account.random()

// Immediately secure the keys
await secureKeyStorage.save(newAuth.sk)

// Then rekey
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: algo(0),
  rekeyTo: newAuth.addr,
  signer: account,
})
```

**Avoid**:
```typescript
// Don't rekey without securing the new keys first
const newAuth = await algorand.account.random()
await algorand.send.payment({ /* rekey */ })
// Keys not secured - if lost, account is locked!
```

### 4. Document Rekeying Operations

**Good**:
```typescript
// Keep audit trail
const rekeyLog = {
  timestamp: new Date().toISOString(),
  originalAccount: account.addr,
  newAuthority: newAuth.addr,
  reason: 'Periodic key rotation',
  txId: result.txId,
}
await auditLog.save(rekeyLog)
```

**Avoid**:
```typescript
// No documentation of who controls what
await algorand.send.payment({ /* rekey */ })
// No record - hard to track account control history
```

### 5. Test Rekey Before Production

**Good**:
```typescript
// Test on LocalNet first
if (process.env.NETWORK === 'localnet') {
  await testRekeyOperation()
}

// Only then use on MainNet
if (process.env.NETWORK === 'mainnet') {
  await performProductionRekey()
}
```

**Avoid**:
```typescript
// Don't test rekeying for the first time on MainNet
await algorand.send.payment({ /* rekey on mainnet */ })
// Untested - very risky!
```

### 6. Handle Auth Address Comparison Correctly

**Good**:
```typescript
const authAddr = accountInfo['auth-addr'] || accountInfo.authAddr
if (authAddr && authAddr.toString() === expected.toString()) {
  console.log('Match!')
}
```

**Avoid**:
```typescript
// Direct comparison may fail with Address objects
if (accountInfo['auth-addr'] === expected.addr) {
  // May fail due to object vs string comparison
}
```

### 7. Plan Recovery Mechanisms

**Good**:
```typescript
// Set up recovery before rekeying
const recoveryAccount = await setupRecoveryMechanism()

// Document the recovery process
console.log(`Recovery account: ${recoveryAccount.addr}`)

// Then rekey knowing you can recover
await performRekey()
```

**Avoid**:
```typescript
// Rekeying without recovery plan
await algorand.send.payment({ /* rekey */ })
// If new keys are lost, account is unrecoverable
```

## Understanding Account Rekeying

### What Happens When You Rekey?

1. **Account Address Stays Same**: The original account address never changes
2. **Auth Address Is Set**: The account's `auth-addr` field points to the new controller
3. **Signature Requirements Change**: All future transactions must be signed by the auth address
4. **Account Balance Remains**: All ALGOs and assets stay in the original account
5. **Reversible Operation**: You can rekey back to the original or to another account

### Rekey vs Transfer

| Aspect | Rekey | Transfer (Payment) |
|--------|-------|-------------------|
| Account Address | Stays the same | Receiver gets new address |
| Balance | Stays in original account | Moves to receiver |
| Control | Changes to new authority | Receiver controls their own account |
| Reversible | Yes, can rekey back | No, payment is final |
| Smart Contract Links | Maintained | Must update contracts |

### Security Considerations

1. **Key Custody**: Whoever controls the auth account controls the rekeyed account
2. **No Recovery by Default**: If auth account keys are lost, the rekeyed account is lost
3. **Audit Trail**: All rekey operations are recorded on-chain
4. **Multi-Sig Support**: Can rekey to multi-signature accounts for enhanced security
5. **Smart Contract Control**: Can rekey to smart contract addresses for programmable control

### When to Use Rekeying

- **Key Rotation**: Regular security practice to change keys periodically
- **Account Recovery**: Set up fallback accounts that can recover in emergencies
- **Custody Transitions**: Moving from hot wallet to cold storage
- **Multi-Sig Upgrades**: Transitioning single accounts to multi-signature control
- **Smart Contract Integration**: Allowing contracts to control accounts
- **Security Upgrades**: Implementing new security measures without address changes

## Key Takeaways

1. **Account rekeying** allows changing control of an account without changing its address
2. **Use zero-amount payments** with the `rekeyTo` parameter to perform rekeying
3. **Always verify** the auth-addr after rekeying to ensure it was successful
4. **Original address** remains the same - only the controlling keys change
5. **Secure the new keys** before rekeying - if lost, the account cannot be controlled
6. **Rekeying is reversible** - you can rekey back to the original or to another account
7. **Test thoroughly** on LocalNet before using rekeying in production environments
