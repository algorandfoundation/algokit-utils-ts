# Create an Asset with Full Configuration

Demonstrates how to create an Algorand Standard Asset (ASA) with all possible configuration options including metadata, role accounts (manager, reserve, freeze, clawback), and default frozen state.

## Example Details

```json
{
  "example_id": "101-create-an-asset-with-full-configuration",
  "title": "Create an Asset with Full Configuration",
  "summary": "Demonstrates how to create an Algorand Standard Asset (ASA) with all possible configuration options including metadata, role accounts (manager, reserve, freeze, clawback), and default frozen state.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "asset creation",
  "specific_use_case": "Create a new asset with full configuration including metadata, role accounts, and default frozen state",
  "target_users": [
    "SDK developers",
    "Smart contract developers",
    "Asset creators"
  ],
  "features_tested": [
    "algorand.send.assetCreate",
    "algorand.asset.getById",
    "algorand.account.random"
  ],
  "feature_tags": [
    "asset-creation",
    "asa",
    "metadata",
    "role-accounts",
    "manager",
    "reserve",
    "freeze",
    "clawback",
    "asset-configuration"
  ],
  "folder": "101-create-an-asset-with-full-configuration",
  "prerequisites": {
    "tools": [
      "algokit",
      "docker"
    ],
    "libraries": [
      "@algorandfoundation/algokit-utils",
      "algosdk"
    ],
    "environment": [
      {
        "name": "ALGOD_SERVER",
        "required": true,
        "example": "http://localhost"
      },
      {
        "name": "ALGOD_PORT",
        "required": true,
        "example": "4001"
      },
      {
        "name": "ALGOD_TOKEN",
        "required": true,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet: algokit localnet start"
    ],
    "install": [
      "npm install"
    ],
    "execute": [
      "npm run build",
      "node dist/main.js"
    ]
  },
  "expected_output": [
    "Creating asset with full configuration...",
    "Asset created successfully!",
    "Asset ID: <asset-id>",
    "Asset Details:",
    "- Creator: <creator-address>",
    "- Total supply: 1000",
    "- Decimals: 0",
    "- Unit name: TEST",
    "- Asset name: Test Asset",
    "- URL: https://example.com",
    "- Metadata hash: <hash>",
    "- Manager: <manager-address>",
    "- Reserve: <reserve-address>",
    "- Freeze: <freeze-address>",
    "- Clawback: <clawback-address>",
    "- Default frozen: true"
  ],
  "source_tests": [
    {
      "file": "src/types/algorand-client.asset.spec.ts",
      "test_name": "Create an asset succeeds"
    }
  ],
  "artifacts_plan": [],
  "notes": "This example shows all configuration options available when creating an Algorand Standard Asset. Role accounts provide fine-grained control over asset management, and the default frozen state can prevent transfers until accounts are unfrozen.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { microAlgos } from '@algorandfoundation/algokit-utils'\n\n/**\n * This example demonstrates how to create an Algorand Standard Asset (ASA)\n * with all possible configuration options.\n * \n * Key concepts:\n * - Asset creation with metadata (name, unit name, URL, metadata hash)\n * - Role accounts for asset management:\n *   - Manager: Can reconfigure the asset's role accounts\n *   - Reserve: Account holding non-minted assets (informational)\n *   - Freeze: Can freeze/unfreeze asset holdings in accounts\n *   - Clawback: Can revoke assets from accounts\n * - Default frozen state: If true, accounts must be unfrozen before transfers\n * - Total supply and decimals configuration\n */\n\nasync function main() {\n  // Initialize the Algorand client for LocalNet\n  const algorand = AlgorandClient.fromEnvironment()\n\n  // Get a funded test account to create the asset\n  const creator = algorand.account.localNet().dispenser\n\n  console.log('Creating asset with full configuration...\\n')\n\n  // Step 1: Generate accounts for each role\n  // These accounts will have different management capabilities for the asset\n  const managerAccount = algorand.account.random()\n  const reserveAccount = algorand.account.random()\n  const freezeAccount = algorand.account.random()\n  const clawbackAccount = algorand.account.random()\n\n  console.log('Role accounts:')\n  console.log(`- Manager: ${managerAccount.addr}`)\n  console.log(`- Reserve: ${reserveAccount.addr}`)\n  console.log(`- Freeze: ${freezeAccount.addr}`)\n  console.log(`- Clawback: ${clawbackAccount.addr}\\n`)\n\n  // Step 2: Create metadata hash (32 bytes)\n  // In production, this would typically be a hash of asset metadata stored off-chain\n  const metadataHash = new Uint8Array(32).fill(1)\n\n  // Step 3: Create the asset with full configuration\n  const result = await algorand.send.assetCreate({\n    sender: creator,\n    total: 1000n, // Total supply of 1000 units\n    decimals: 0, // No decimal places (whole units only)\n    assetName: 'Test Asset', // Full asset name (up to 32 bytes)\n    unitName: 'TEST', // Short ticker symbol (up to 8 bytes)\n    url: 'https://example.com', // URL with more info about the asset\n    metadataHash: metadataHash, // 32-byte hash of asset metadata\n    manager: managerAccount, // Can change role addresses\n    reserve: reserveAccount, // Holds non-minted assets (informational)\n    freeze: freezeAccount, // Can freeze/unfreeze holdings\n    clawback: clawbackAccount, // Can revoke assets from accounts\n    defaultFrozen: true, // Accounts must be unfrozen before transfers\n  })\n\n  console.log('Asset created successfully!')\n  console.log(`Asset ID: ${result.assetId}\\n`)\n\n  // Step 4: Retrieve and display the asset information\n  const assetData = await algorand.asset.getById(result.assetId)\n\n  console.log('Asset Details:')\n  console.log(`- Creator: ${assetData.creator}`)\n  console.log(`- Total supply: ${assetData.total}`)\n  console.log(`- Decimals: ${assetData.decimals}`)\n  console.log(`- Unit name: ${assetData.unitName}`)\n  console.log(`- Asset name: ${assetData.assetName}`)\n  console.log(`- URL: ${assetData.url}`)\n  console.log(`- Metadata hash: ${Buffer.from(assetData.metadataHash || []).toString('hex')}`)\n  console.log(`- Manager: ${assetData.manager}`)\n  console.log(`- Reserve: ${assetData.reserve}`)\n  console.log(`- Freeze: ${assetData.freeze}`)\n  console.log(`- Clawback: ${assetData.clawback}`)\n  console.log(`- Default frozen: ${assetData.defaultFrozen}\\n`)\n\n  console.log('✓ Asset created with all configuration options!')\n  console.log('\\nRole account capabilities:')\n  console.log('- Manager can update the manager, reserve, freeze, and clawback addresses')\n  console.log('- Reserve address is purely informational (no special permissions)')\n  console.log('- Freeze can freeze/unfreeze asset holdings in specific accounts')\n  console.log('- Clawback can revoke assets from accounts and send to another account')\n  console.log('- Default frozen means new opt-ins start frozen until explicitly unfrozen')\n}\n\nmain().catch(console.error)\n"
}
```
