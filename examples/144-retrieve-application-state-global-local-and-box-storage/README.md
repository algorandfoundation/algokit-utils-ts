# Retrieve Application State (Global, Local, and Box Storage)

Comprehensive example demonstrating how to retrieve and decode all types of application state: global state, local state, and box storage with various data types including ABI-encoded values

## Example Details

```json
{
  "example_id": "144-retrieve-application-state-global-local-and-box-storage",
  "title": "Retrieve Application State (Global, Local, and Box Storage)",
  "summary": "Comprehensive example demonstrating how to retrieve and decode all types of application state: global state, local state, and box storage with various data types including ABI-encoded values",
  "language": "typescript",
  "complexity": "complex",
  "example_potential": "high",
  "use_case_category": "transaction management",
  "specific_use_case": "Retrieve and decode global state, local state, and box storage",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "client.getGlobalState",
    "client.getLocalState",
    "client.getBoxValues",
    "client.getBoxValue",
    "client.getBoxValuesFromABIType",
    "client.getBoxValueFromABIType"
  ],
  "feature_tags": [
    "state-retrieval",
    "global-state",
    "local-state",
    "box-storage",
    "abi-decoding",
    "state-management"
  ],
  "folder": "144-retrieve-application-state-global-local-and-box-storage",
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
        "name": "TEST_ACCOUNT",
        "required": true,
        "example": "Your test account mnemonic or private key"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet: algokit localnet start",
      "Deploy your smart contract with global state, local state, and box storage support"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Global state values displayed (integers and byte arrays)",
    "Local state values displayed after opt-in",
    "Box storage values retrieved and displayed (both raw and string representations)",
    "ABI-encoded box values decoded and displayed as numbers",
    "Success message confirming all state retrieval operations"
  ],
  "source_tests": [
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "Retrieve state"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "TestApp.algo.ts",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Smart contract with methods: set_global, set_local, opt_in, set_box and appropriate state schema"
    }
  ],
  "notes": "This comprehensive example shows all state management patterns in Algorand smart contracts. Understanding these patterns is crucial for building data-driven applications.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport * as algokit from '@algorandfoundation/algokit-utils'\nimport { ABIUintType } from 'algosdk'\nimport { TestAppClient } from './artifacts/TestApp/client' // Adjust import based on your app\n\n/**\n * Example: Retrieve Application State\n * \n * This example demonstrates comprehensive state management including:\n * 1. Reading and decoding global state\n * 2. Reading and decoding local state (per-account)\n * 3. Working with box storage (raw and ABI-encoded values)\n */\nasync function retrieveAppState() {\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.fromEnvironment()\n  \n  // Get a test account\n  const testAccount = await algorand.account.fromEnvironment('TEST_ACCOUNT')\n  \n  console.log('\\n--- Retrieve Application State Example ---\\n')\n  \n  // Assume we have a deployed app client\n  const client = new TestAppClient(\n    {\n      sender: testAccount,\n      resolveBy: 'id',\n      id: 0, // Your app ID\n    },\n    algorand.client.algod\n  )\n  \n  // ========================================\n  // 1. GLOBAL STATE EXAMPLE\n  // ========================================\n  console.log('\\n1. Working with Global State:')\n  console.log('Setting global state values...')\n  \n  // Set global state with various data types\n  await client.send.call({ \n    method: 'set_global', \n    args: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] \n  })\n  \n  // Retrieve global state\n  const globalState = await client.getGlobalState()\n  \n  console.log('\\nGlobal State Retrieved:')\n  console.log(`  int1: ${globalState.int1?.value}`)\n  console.log(`  int2: ${globalState.int2?.value}`)\n  console.log(`  bytes1 (string): ${globalState.bytes1?.value}`)\n  console.log(`  bytes2 (raw): [${globalState.bytes2?.valueRaw}]`)\n  console.log(`  Available keys: ${Object.keys(globalState).sort().join(', ')}`)\n  \n  // ========================================\n  // 2. LOCAL STATE EXAMPLE\n  // ========================================\n  console.log('\\n\\n2. Working with Local State:')\n  console.log('Opting in to the application...')\n  \n  // Opt-in is required before setting local state\n  await client.send.optIn({ method: 'opt_in' })\n  \n  console.log('Setting local state values...')\n  await client.send.call({ \n    method: 'set_local', \n    args: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] \n  })\n  \n  // Retrieve local state for the test account\n  const localState = await client.getLocalState(testAccount.addr)\n  \n  console.log('\\nLocal State Retrieved:')\n  console.log(`  local_int1: ${localState.local_int1?.value}`)\n  console.log(`  local_int2: ${localState.local_int2?.value}`)\n  console.log(`  local_bytes1 (string): ${localState.local_bytes1?.value}`)\n  console.log(`  local_bytes2 (raw): [${localState.local_bytes2?.valueRaw}]`)\n  console.log(`  Available keys: ${Object.keys(localState).sort().join(', ')}`)\n  \n  // ========================================\n  // 3. BOX STORAGE EXAMPLE\n  // ========================================\n  console.log('\\n\\n3. Working with Box Storage:')\n  \n  // Define box names\n  const boxName1 = new Uint8Array([0, 0, 0, 1])\n  const boxName1Base64 = Buffer.from(boxName1).toString('base64')\n  const boxName2 = new Uint8Array([0, 0, 0, 2])\n  const boxName2Base64 = Buffer.from(boxName2).toString('base64')\n  \n  // Fund the app account to cover box storage minimum balance\n  console.log('Funding app account for box storage...')\n  await client.fundAppAccount({ amount: algokit.algo(1) })\n  \n  // Create boxes with string values\n  console.log('Creating boxes with string values...')\n  await client.send.call({\n    method: 'set_box',\n    args: [boxName1, 'value1'],\n    boxReferences: [boxName1],\n  })\n  await client.send.call({\n    method: 'set_box',\n    args: [boxName2, 'value2'],\n    boxReferences: [boxName2],\n  })\n  \n  // Retrieve all box values\n  const boxValues = await client.getBoxValues()\n  console.log(`\\nTotal boxes found: ${boxValues.length}`)\n  \n  // Retrieve a specific box value\n  const box1Value = await client.getBoxValue(boxName1)\n  console.log(`\\nBox 1 (${boxName1Base64}):`, Buffer.from(box1Value).toString())\n  \n  const box1 = boxValues.find((b) => b.name.nameBase64 === boxName1Base64)\n  const box2 = boxValues.find((b) => b.name.nameBase64 === boxName2Base64)\n  console.log(`Box 2 (${boxName2Base64}):`, Buffer.from(box2!.value).toString())\n  \n  // ========================================\n  // 4. BOX STORAGE WITH ABI TYPES\n  // ========================================\n  console.log('\\n\\n4. Working with ABI-Encoded Box Values:')\n  \n  const expectedValue = 1234524352\n  console.log(`Setting box with ABI-encoded uint32 value: ${expectedValue}`)\n  \n  // Set box with ABI-encoded value\n  await client.send.call({\n    method: 'set_box',\n    args: [boxName1, new ABIUintType(32).encode(expectedValue)],\n    boxReferences: [boxName1],\n  })\n  \n  // Retrieve and decode box value using ABI type\n  const boxes = await client.getBoxValuesFromABIType(\n    new ABIUintType(32), \n    (n) => n.nameBase64 === boxName1Base64\n  )\n  \n  const box1AbiValue = await client.getBoxValueFromABIType(boxName1, new ABIUintType(32))\n  \n  console.log(`\\nABI-Decoded box value: ${Number(box1AbiValue)}`)\n  console.log(`Filtered boxes count: ${boxes.length}`)\n  console.log(`First box decoded value: ${Number(boxes[0].value)}`)\n  \n  console.log('\\n✅ Successfully demonstrated all state retrieval methods!')\n}\n\n// Run the example\nretrieveAppState().catch(console.error)"
}
```
