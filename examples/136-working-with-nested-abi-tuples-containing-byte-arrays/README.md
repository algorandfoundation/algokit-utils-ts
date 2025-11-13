# Working with Nested ABI Tuples Containing Byte Arrays

Learn how to work with nested ABI tuples containing byte arrays. This example shows how to define complex nested tuple types and convert JavaScript values to properly typed ABI values for smart contract interactions.

## Example Details

```json
{
  "example_id": "136-working-with-nested-abi-tuples-containing-byte-arrays",
  "title": "Working with Nested ABI Tuples Containing Byte Arrays",
  "summary": "Learn how to work with nested ABI tuples containing byte arrays. This example shows how to define complex nested tuple types and convert JavaScript values to properly typed ABI values for smart contract interactions.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "ABI type conversion",
  "specific_use_case": "Convert nested tuples with byte arrays (byte[2],(byte[1],bool)) for smart contract data preparation",
  "target_users": [
    "Smart contract developers",
    "SDK developers"
  ],
  "features_tested": [
    "convertAbiByteArrays",
    "ABITupleType",
    "ABIArrayStaticType",
    "ABIByteType",
    "ABIBoolType",
    "nested tuple conversion"
  ],
  "feature_tags": [
    "abi",
    "tuples",
    "nested-structures",
    "byte-arrays",
    "type-conversion",
    "smart-contracts",
    "algosdk"
  ],
  "folder": "136-working-with-nested-abi-tuples-containing-byte-arrays",
  "prerequisites": {
    "tools": [
      "node",
      "npm"
    ],
    "libraries": [
      "@algorandfoundation/algokit-utils"
    ],
    "environment": []
  },
  "run_instructions": {
    "setup": [],
    "install": [
      "npm install @algorandfoundation/algokit-utils"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Nested tuple structure created successfully",
    "Outer tuple: byte[2] + (byte[1], bool)",
    "First element (byte[2]): Uint8Array containing [1, 2]",
    "Second element is a nested tuple with byte[1] and bool",
    "Nested tuple first element (byte[1]): Uint8Array containing [3]",
    "Nested tuple second element (bool): true"
  ],
  "source_tests": [
    {
      "file": "src/util.spec.ts",
      "test_name": "should handle nested tuples with byte arrays"
    }
  ],
  "artifacts_plan": [],
  "notes": "This example demonstrates recursive tuple processing, which is essential for working with complex smart contract data structures. The convertAbiByteArrays function properly handles nested structures by recursively converting number arrays to Uint8Array instances.",
  "generated_code": "import {\n  ABIByteType,\n  ABIArrayStaticType,\n  ABITupleType,\n  ABIBoolType,\n  convertAbiByteArrays,\n  type ABIValue,\n} from '@algorandfoundation/algokit-utils'\n\n/**\n * Demonstrates working with nested ABI tuples containing byte arrays.\n * \n * This example shows how to:\n * 1. Define nested tuple types with byte arrays\n * 2. Convert JavaScript values to ABI-compatible types\n * 3. Handle complex nested structures for smart contract interactions\n * \n * The structure being created is: (byte[2],(byte[1],bool))\n * - Outer tuple contains a byte array and an inner tuple\n * - Inner tuple contains a byte array and a boolean\n */\n\nfunction main() {\n  console.log('=== Working with Nested ABI Tuples and Byte Arrays ===\\n')\n\n  // Step 1: Define the ABI types\n  console.log('Step 1: Defining ABI types...')\n  \n  // Basic byte type\n  const byteType = new ABIByteType()\n  \n  // Static array of 2 bytes: byte[2]\n  const byteArray2Type = new ABIArrayStaticType(byteType, 2)\n  \n  // Static array of 1 byte: byte[1]\n  const byteArray1Type = new ABIArrayStaticType(byteType, 1)\n  \n  // Boolean type\n  const boolType = new ABIBoolType()\n  \n  console.log('✓ Created basic types: byte, byte[2], byte[1], bool\\n')\n\n  // Step 2: Create nested tuple structure\n  console.log('Step 2: Creating nested tuple structure...')\n  \n  // Inner tuple: (byte[1], bool)\n  const innerTupleType = new ABITupleType([byteArray1Type, boolType])\n  console.log('✓ Created inner tuple type: (byte[1], bool)')\n  \n  // Outer tuple: (byte[2], (byte[1], bool))\n  const outerTupleType = new ABITupleType([byteArray2Type, innerTupleType])\n  console.log('✓ Created outer tuple type: (byte[2], (byte[1], bool))\\n')\n\n  // Step 3: Prepare the data\n  console.log('Step 3: Preparing data...')\n  const value = [\n    [1, 2],           // byte[2] - outer array\n    [[3], true],      // (byte[1], bool) - inner tuple\n  ]\n  console.log('Original value:', JSON.stringify(value), '\\n')\n\n  // Step 4: Convert to ABI format\n  console.log('Step 4: Converting to ABI format...')\n  const result = convertAbiByteArrays(value, outerTupleType) as ABIValue[]\n  console.log('✓ Conversion complete\\n')\n\n  // Step 5: Inspect the results\n  console.log('Step 5: Inspecting converted results...')\n  console.log('Result is an array:', Array.isArray(result))\n  console.log('Result length:', result.length)\n  console.log()\n\n  // Check first element (byte[2])\n  console.log('First element (byte[2]):')\n  console.log('  Type:', result[0].constructor.name)\n  console.log('  Values:', Array.from(result[0] as Uint8Array))\n  console.log('  ✓ Correctly converted to Uint8Array')\n  console.log()\n\n  // Check second element (nested tuple)\n  const nestedTuple = result[1] as ABIValue[]\n  console.log('Second element (nested tuple):')\n  console.log('  Is array:', Array.isArray(nestedTuple))\n  console.log('  Length:', nestedTuple.length)\n  console.log()\n\n  // Check nested tuple elements\n  console.log('  First element of nested tuple (byte[1]):')\n  console.log('    Type:', nestedTuple[0].constructor.name)\n  console.log('    Values:', Array.from(nestedTuple[0] as Uint8Array))\n  console.log('    ✓ Correctly converted to Uint8Array')\n  console.log()\n\n  console.log('  Second element of nested tuple (bool):')\n  console.log('    Type:', typeof nestedTuple[1])\n  console.log('    Value:', nestedTuple[1])\n  console.log('    ✓ Boolean value preserved')\n  console.log()\n\n  console.log('=== Summary ===')\n  console.log('✓ Successfully created and converted nested tuple structure')\n  console.log('✓ Byte arrays properly converted to Uint8Array instances')\n  console.log('✓ Nested structure maintained with correct types')\n  console.log('✓ Ready for smart contract interactions')\n}\n\n// Run the example\nmain()"
}
```
