# Deploy Immutable and Permanent Application

This example demonstrates deploying an application that is both immutable (cannot be updated) and permanent (cannot be deleted).

## What This Example Shows

- Deploying immutable applications (TMPL_UPDATABLE=0)
- Deploying permanent applications (TMPL_DELETABLE=0)
- Understanding the implications of immutability
- Using deploy-time parameters to control app mutability
- Production-ready deployment patterns

## Why This Matters

Immutable and permanent applications provide the highest level of trust and security:

1. **Trust**: Users can verify the contract will never change
2. **Security**: No risk of malicious updates
3. **Transparency**: Contract behavior is guaranteed forever
4. **Compliance**: Meets regulatory requirements for immutability
5. **Decentralization**: Truly trustless smart contracts

## Key Concepts

- **Immutable**: `TMPL_UPDATABLE=0` - App logic cannot be changed
- **Permanent**: `TMPL_DELETABLE=0` - App cannot be removed from blockchain
- **Deploy-time Parameters**: Set at creation, enforce immutability
- **Production Pattern**: Ideal for production contracts

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
=== Deploy Immutable and Permanent Application ===

⚠️  WARNING: This app cannot be updated or deleted after deployment!

Test account address: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

Step 1: Deploying immutable and permanent application...
✓ App deployed with ID: 1076

Step 2: Verifying app configuration...
✓ App exists on blockchain

Step 3: Configuration details...
  Updatable: false (IMMUTABLE)
  Deletable: false (PERMANENT)

💡 Implications:
   • This app is now locked and cannot be modified
   • The app cannot be deleted from the blockchain
   • Ideal for production contracts requiring immutability
   • Ensures contract logic cannot change after deployment
   • Users can trust the contract will always behave the same way

⚠️  Note: Test this carefully before deploying to production!
   Once deployed, there is no way to change or remove the app.

✅ Example completed successfully
```

## Important Warnings

⚠️ **CRITICAL**: Once deployed with these settings:
- The app **CANNOT** be updated - no bug fixes possible
- The app **CANNOT** be deleted - stays on blockchain forever
- Test thoroughly before production deployment
- Consider upgrade patterns if updates might be needed

## Use Cases

**When to use immutable and permanent apps:**
- Production DeFi protocols requiring trust
- Voting systems needing guaranteed integrity
- Token contracts that must never change
- Audit-critical applications
- Regulatory compliance requiring immutability

**When NOT to use:**
- During development and testing
- If future updates might be needed
- For experimental features
- When upgrade paths are necessary

## Key Takeaways

- Deploy-time parameters control app mutability
- Immutable apps provide maximum trust and security
- Permanent apps cannot be removed from blockchain
- Test extensively before deploying to production
- This pattern is ideal for production contracts
- Users can verify contract behavior will never change

This example demonstrates production-ready deployment patterns for applications requiring the highest level of immutability and permanence.
