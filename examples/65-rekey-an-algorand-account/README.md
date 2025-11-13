# Rekey an Algorand Account

A practical example demonstrating account rekeying on Algorand, showing how to change the controlling keys of an account while maintaining the same address.

## What This Example Shows

This example demonstrates:

1. **Account Creation and Funding** - Setting up a test account on LocalNet
2. **Account Rekeying** - Changing account control using a zero-amount payment with rekeyTo
3. **Rekey Verification** - Proving the rekey worked by signing with the new authority
4. **Post-Rekey Transaction** - Sending a transaction from the rekeyed account using the new signer
5. **Address Preservation** - Understanding that the account address remains unchanged
6. **Signer Requirements** - Demonstrating that the new account must sign all future transactions
7. **Security Pattern** - Implementing key rotation without disrupting account identity

## Why This Matters

Account rekeying is a powerful feature that enables:

- **Key Rotation**: Change controlling keys without changing account addresses
- **Security Upgrades**: Transition to more secure key storage without address changes
- **Account Recovery**: Implement fallback mechanisms for compromised accounts
- **Smooth Transitions**: Maintain the same address while updating security practices
- **Smart Contract Integration**: Allow contracts to control accounts programmatically
- **Custody Changes**: Move control between hot wallets, cold storage, or custodians

This is particularly valuable in production systems where account addresses are embedded in smart contracts, documentation, or user interfaces.

## How It Works

### 1. Setup and Fund Original Account

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const originalAccount = await algorand.account.random()
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: originalAccount.addr,
  amount: algo(10), // Fund with 10 ALGO
})
```

**Why**: Create and fund an account that we'll rekey. It needs funds to pay transaction fees.

### 2. Create New Authority Account

```typescript
const newAuthAccount = await algorand.account.random()
console.log('New authorization account address:', newAuthAccount.addr.toString())
```

**Why**: This account will become the new controller of the original account.

### 3. Perform Rekeying

```typescript
await algorand.send.payment({
  sender: originalAccount.addr,
  receiver: originalAccount.addr,
  amount: algo(0), // Zero-amount payment for rekey
  rekeyTo: newAuthAccount.addr,
  signer: originalAccount,
  note: 'Rekey for security purposes',
})
```

**Key Points**:
- Use zero-amount payment with `rekeyTo` parameter
- Sender and receiver are the same (the account being rekeyed)
- Must be signed by current controller (originalAccount before rekey)
- After this, only newAuthAccount can sign transactions for originalAccount

### 4. Verify Rekeying

```typescript
const txn = await algorand.send.payment({
  sender: originalAccount.addr, // Original address (unchanged)
  receiver: originalAccount.addr,
  amount: algo(0.001),
  signer: newAuthAccount, // NEW account must sign!
})

console.log('Payment successful! Transaction ID:', txn.transaction.txID())
```

**Why**: Prove the rekey worked by successfully signing a transaction with the new authority.

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
Original account address: CJRCKARIFDBSCJJ3NA2BAZGID7YVRBX7GQBIPXZMFW4N3VIZCCURORYJ2U
Original account can sign transactions with its own private key
New authorization account address: YWWE5DORVJLA2UQM7X7C7TJ4QLF6CXQOSE5FLEVNW3LGOCWIBVRVY2UELE

Rekeying the original account to be controlled by the new account...
Rekey successful!
The original account address is still: CJRCKARIFDBSCJJ3NA2BAZGID7YVRBX7GQBIPXZMFW4N3VIZCCURORYJ2U
But it must now use the new authorization account to sign transactions

Verifying rekey by sending a payment from the rekeyed account...
Payment successful! Transaction ID: RFLNTZGCHNHODTZP2TV7C23FMS2C7R33P5ZBY4LRVTQW5PHLILDQ

This confirms the rekey worked:
- Transaction was sent FROM the original account address
- But it was SIGNED by the new authorization account

Note: If you tried to sign with the original account's key, it would fail!
```

## Common Patterns

### 1. Basic Account Rekeying

```typescript
// Rekey accountA to be controlled by accountB
await algorand.send.payment({
  sender: accountA.addr,
  receiver: accountA.addr,
  amount: algo(0),
  rekeyTo: accountB.addr,
  signer: accountA, // Current controller
})

// Now accountB must sign all transactions for accountA
```

### 2. Periodic Key Rotation

```typescript
async function rotateAccountKeys(
  accountToRekey: string,
  currentAuth: algosdk.Account,
  newAuth: algosdk.Account
) {
  // Rekey to new authority
  await algorand.send.payment({
    sender: accountToRekey,
    receiver: accountToRekey,
    amount: algo(0),
    rekeyTo: newAuth.addr,
    signer: currentAuth,
    note: `Key rotation on ${new Date().toISOString()}`,
  })

  console.log(`Account ${accountToRekey} rekeyed to new authority`)
  return newAuth
}
```

### 3. Rekey to Multi-Signature

```typescript
import algosdk from 'algosdk'

// Create multi-sig parameters
const multisigParams = {
  version: 1,
  threshold: 2,
  addrs: [account1.addr, account2.addr, account3.addr],
}

const multisigAddr = algosdk.multisigAddress(multisigParams)

// Rekey to multi-sig for enhanced security
await algorand.send.payment({
  sender: singleAccount.addr,
  receiver: singleAccount.addr,
  amount: algo(0),
  rekeyTo: multisigAddr,
  signer: singleAccount,
})
```

### 4. Rekey Back to Original

```typescript
// Rekey back to original controller
await algorand.send.payment({
  sender: originalAccount.addr,
  receiver: originalAccount.addr,
  amount: algo(0),
  rekeyTo: originalAccount.addr, // Rekey back to self
  signer: currentAuthAccount, // Must be current controller
})
```

### 5. Conditional Rekey with Verification

```typescript
async function rekeyWithVerification(
  accountAddr: string,
  currentSigner: algosdk.Account,
  newAuth: algosdk.Account
) {
  // Perform rekey
  await algorand.send.payment({
    sender: accountAddr,
    receiver: accountAddr,
    amount: algo(0),
    rekeyTo: newAuth.addr,
    signer: currentSigner,
  })

  // Verify rekey succeeded
  const accountInfo = await algorand.account.getInformation(accountAddr)
  const authAddr = accountInfo['auth-addr'] || accountInfo.authAddr

  if (authAddr?.toString() !== newAuth.addr.toString()) {
    throw new Error('Rekey verification failed')
  }

  console.log('Rekey verified successfully')
}
```

### 6. Emergency Recovery Pattern

```typescript
// Set up recovery account during initial setup
async function setupRecoveryAccount(
  primaryAccount: algosdk.Account,
  recoveryAccount: algosdk.Account
) {
  // Store recovery account securely
  // In emergency, can rekey to recovery account
  console.log(`Recovery account set: ${recoveryAccount.addr}`)
  console.log('Keep recovery keys in secure, separate location')
}

// Emergency recovery
async function emergencyRecover(
  compromisedAccount: string,
  currentAuth: algosdk.Account,
  recoveryAccount: algosdk.Account
) {
  await algorand.send.payment({
    sender: compromisedAccount,
    receiver: compromisedAccount,
    amount: algo(0),
    rekeyTo: recoveryAccount.addr,
    signer: currentAuth,
    note: 'EMERGENCY RECOVERY',
  })
}
```

### 7. Smart Contract Control

```typescript
// Rekey account to be controlled by a smart contract
const appAddress = algosdk.getApplicationAddress(appId)

await algorand.send.payment({
  sender: userAccount.addr,
  receiver: userAccount.addr,
  amount: algo(0),
  rekeyTo: appAddress,
  signer: userAccount,
  note: 'Delegating control to smart contract',
})

// Now the smart contract can authorize transactions for userAccount
```

## Best Practices

### 1. Always Verify Rekey Success

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
  throw new Error('Rekey verification failed!')
}
```

**Avoid**:
```typescript
// No verification after rekey
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: algo(0),
  rekeyTo: newAuth.addr,
  signer: account,
})
// Hope it worked!
```

### 2. Secure New Keys Before Rekeying

**Good**:
```typescript
// Generate and secure new keys first
const newAuth = await algorand.account.random()
await secureKeyStorage.save(newAuth)
await backupKeys(newAuth)

// Only then rekey
await algorand.send.payment({ /* rekey */ })
```

**Avoid**:
```typescript
// Rekey first, secure later
const newAuth = await algorand.account.random()
await algorand.send.payment({ /* rekey */ })
// If this process crashes, keys may be lost!
await secureKeyStorage.save(newAuth)
```

### 3. Use Meaningful Transaction Notes

**Good**:
```typescript
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: algo(0),
  rekeyTo: newAuth.addr,
  signer: account,
  note: `Scheduled key rotation - ${new Date().toISOString()} - Reason: Monthly security update`,
})
```

**Avoid**:
```typescript
await algorand.send.payment({
  sender: account.addr,
  receiver: account.addr,
  amount: algo(0),
  rekeyTo: newAuth.addr,
  signer: account,
  // No note - hard to audit later
})
```

### 4. Test on LocalNet First

**Good**:
```typescript
if (process.env.NETWORK === 'localnet') {
  await testRekeyOperation()
  console.log('✓ LocalNet test passed')
}

// Only proceed to testnet/mainnet after thorough testing
if (process.env.NETWORK === 'mainnet') {
  await performProductionRekey()
}
```

**Avoid**:
```typescript
// Testing rekeying for the first time on mainnet
await algorand.send.payment({ /* rekey on mainnet */ })
// Very risky!
```

### 5. Maintain Audit Trail

**Good**:
```typescript
const rekeyRecord = {
  timestamp: new Date().toISOString(),
  accountRekeyed: account.addr.toString(),
  oldAuth: oldAuth.addr.toString(),
  newAuth: newAuth.addr.toString(),
  reason: 'Scheduled monthly rotation',
  txId: result.transaction.txID(),
}

await auditLog.append(rekeyRecord)
```

**Avoid**:
```typescript
// No record of rekeying operations
await algorand.send.payment({ /* rekey */ })
// Who controls what? When did it change?
```

### 6. Handle Address Display Consistently

**Good**:
```typescript
console.log('Account address:', account.addr.toString())
console.log('New auth:', newAuth.addr.toString())
// Clean, readable output
```

**Avoid**:
```typescript
console.log('Account address:', account.addr)
// Displays full Address object with internal structure
```

### 7. Document Control Changes

**Good**:
```typescript
/**
 * Account Control History:
 * - 2025-01-01: Created with original keys
 * - 2025-02-01: Rekeyed to multi-sig (2-of-3)
 * - 2025-03-01: Rekeyed to cold storage
 */
const accountControlMap = new Map()
accountControlMap.set(account.addr.toString(), {
  currentAuth: currentAuth.addr.toString(),
  history: [ /* ... */ ],
})
```

**Avoid**:
```typescript
// No documentation of who controls what
await algorand.send.payment({ /* rekey */ })
// Which account controls this now?
```

## Understanding Account Rekeying

### What Happens During Rekey?

1. **Address Remains Constant**: The account address (public key) never changes
2. **Auth Address Is Set**: The `auth-addr` field is set to the new controller's address
3. **Signature Authority Transfers**: All future transactions must be signed by the new auth address
4. **Balance Stays In Place**: ALGOs and assets remain in the original account
5. **On-Chain Record**: The rekey transaction is permanently recorded on the blockchain

### Rekey Transaction Structure

```typescript
{
  sender: accountBeingRekeyed.addr,      // Account to rekey
  receiver: accountBeingRekeyed.addr,    // Same as sender (self-payment)
  amount: algo(0),                        // Zero ALGOs (just for rekey)
  rekeyTo: newAuthority.addr,            // New controlling address
  signer: currentController,              // Must be current controller
  note: 'Optional note explaining why'    // Best practice: always include
}
```

### Common Use Cases

| Use Case | Before Rekey | After Rekey | Benefit |
|----------|--------------|-------------|---------|
| Key Rotation | Single key controls account | New single key controls account | Regular security updates |
| Multi-Sig Upgrade | Single key | Multi-sig address | Enhanced security |
| Cold Storage | Hot wallet key | Cold storage key | Improved key security |
| Smart Contract | User key | Contract address | Programmable control |
| Recovery | Compromised key | Recovery key | Account rescue |

### Security Implications

1. **Immediate Effect**: Rekey takes effect in the same round it's confirmed
2. **No Recovery If Keys Lost**: If new authority keys are lost, account is lost (unless rekeyed to recovery)
3. **Old Keys Become Invalid**: Original keys can no longer authorize transactions
4. **Reversible Process**: Can rekey back to original or to another account
5. **Audit Trail**: All rekey operations are visible on-chain

## Key Takeaways

1. **Rekeying changes control** without changing the account address
2. **Use zero-amount payments** with the `rekeyTo` parameter
3. **Always verify** the rekey succeeded by checking auth-addr
4. **Secure new keys first** before performing the rekey operation
5. **Test thoroughly** on LocalNet before production use
6. **Maintain audit trails** of all rekeying operations
7. **Document control changes** for operational clarity
8. **Use .toString()** when displaying Address objects for clean output
