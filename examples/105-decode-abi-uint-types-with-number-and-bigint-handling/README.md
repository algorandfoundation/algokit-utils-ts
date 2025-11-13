# Decode ABI Uint Types with Number and BigInt Handling

Demonstrates how to decode all valid ABI uint types (uint8 through uint512) and understand when values are returned as number vs bigint based on bit length.

## Example Details

```json
{
  "example_id": "105-decode-abi-uint-types-with-number-and-bigint-handling",
  "title": "Decode ABI Uint Types with Number and BigInt Handling",
  "summary": "Demonstrates how to decode all valid ABI uint types (uint8 through uint512) and understand when values are returned as number vs bigint based on bit length.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "ABI decoding",
  "specific_use_case": "Decode all valid uint types with proper type mapping (number vs bigint)",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "getABIDecodedValue",
    "uint decoding",
    "ARC-56",
    "ABIUintType",
    "number vs bigint conversion"
  ],
  "feature_tags": [
    "abi-decoding",
    "uint-types",
    "number-vs-bigint",
    "arc-56",
    "type-safety",
    "data-encoding",
    "smart-contracts"
  ],
  "folder": "105-decode-abi-uint-types-with-number-and-bigint-handling",
  "prerequisites": {
    "tools": [
      "node",
      "npm"
    ],
    "libraries": [
      "@algorandfoundation/algokit-utils",
      "algosdk"
    ],
    "environment": []
  },
  "run_instructions": {
    "setup": [],
    "install": [
      "npm install",
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Complete list of all uint types (uint8 through uint512)",
    "Decoded values with their JavaScript types",
    "Clear indication of the number/bigint boundary at 53 bits",
    "Detailed examples showing arithmetic operations with both types",
    "Boundary case comparison between uint48 and uint56"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "correctly decodes a uint%i"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "package.json",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "Package configuration with required dependencies"
    },
    {
      "target_file": "README.md",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "Documentation explaining uint types and the number/bigint distinction"
    }
  ],
  "notes": "This example is crucial for developers to understand type handling when working with smart contracts. The 53-bit boundary (Number.MAX_SAFE_INTEGER) is a JavaScript limitation that affects how uint values are returned.",
  "generated_code": "import { getABIDecodedValue } from '@algorandfoundation/algokit-utils/types/app-arc56'\nimport { ABIUintType } from 'algosdk'\n\n/**\n * This example demonstrates how to decode ABI uint types and understand\n * the automatic type conversion between JavaScript number and bigint.\n * \n * Key insight: JavaScript numbers can safely represent integers up to 2^53 - 1.\n * Therefore:\n * - uint8 through uint48 (< 53 bits) are decoded as number\n * - uint56 through uint512 (>= 53 bits) are decoded as bigint\n */\n\nfunction main() {\n  console.log('=== ABI Uint Type Decoding Example ===')\n  console.log()\n  console.log('JavaScript safe integer range: -(2^53 - 1) to (2^53 - 1)')\n  console.log('Threshold: uint types < 53 bits → number, >= 53 bits → bigint')\n  console.log()\n\n  // Generate all valid ABI uint bit lengths (uint8, uint16, uint24, ..., uint512)\n  const validBitLengths = Array.from({ length: 64 }, (_, i) => (i + 1) * 8)\n\n  console.log('Decoding uint types across all valid bit lengths:')\n  console.log('==================================================')\n  console.log()\n\n  // Test decoding for each uint type\n  validBitLengths.forEach((bitLength) => {\n    // Encode the value 1 using the appropriate uint type\n    const abiType = new ABIUintType(bitLength)\n    const encoded = abiType.encode(1)\n\n    // Decode the value back\n    const decoded = getABIDecodedValue(encoded, `uint${bitLength}`, {})\n\n    // Determine expected type based on bit length\n    const expectedType = bitLength < 53 ? 'number' : 'bigint'\n    const actualType = typeof decoded\n    const typeMatch = expectedType === actualType ? '✓' : '✗'\n\n    console.log(\n      `uint${bitLength.toString().padStart(3, ' ')}: ` +\n      `${decoded.toString().padStart(2, ' ')} ` +\n      `(${actualType.padEnd(6, ' ')}) ${typeMatch}`\n    )\n  })\n\n  console.log()\n  console.log('Detailed examples:')\n  console.log('------------------')\n\n  // Example 1: uint32 (will be a number)\n  console.log()\n  console.log('Example 1: uint32 (32 bits < 53 bits)')\n  const uint32Type = new ABIUintType(32)\n  const encodedUint32 = uint32Type.encode(42)\n  const decodedUint32 = getABIDecodedValue(encodedUint32, 'uint32', {})\n  console.log(`  Encoded value: 42`)\n  console.log(`  Decoded value: ${decodedUint32}`)\n  console.log(`  Type: ${typeof decodedUint32}`)\n  console.log(`  Can use arithmetic: ${decodedUint32} + 8 = ${(decodedUint32 as number) + 8}`)\n\n  // Example 2: uint64 (will be a bigint)\n  console.log()\n  console.log('Example 2: uint64 (64 bits >= 53 bits)')\n  const uint64Type = new ABIUintType(64)\n  const encodedUint64 = uint64Type.encode(1000000000000)\n  const decodedUint64 = getABIDecodedValue(encodedUint64, 'uint64', {})\n  console.log(`  Encoded value: 1000000000000`)\n  console.log(`  Decoded value: ${decodedUint64}`)\n  console.log(`  Type: ${typeof decodedUint64}`)\n  console.log(`  Can use BigInt arithmetic: ${decodedUint64} + 8n = ${(decodedUint64 as bigint) + 8n}`)\n\n  // Example 3: Boundary case - uint48 (number) vs uint56 (bigint)\n  console.log()\n  console.log('Example 3: Boundary between number and bigint')\n  const uint48Type = new ABIUintType(48)\n  const uint56Type = new ABIUintType(56)\n  const encodedUint48 = uint48Type.encode(1)\n  const encodedUint56 = uint56Type.encode(1)\n  const decodedUint48 = getABIDecodedValue(encodedUint48, 'uint48', {})\n  const decodedUint56 = getABIDecodedValue(encodedUint56, 'uint56', {})\n  console.log(`  uint48 (48 bits): type = ${typeof decodedUint48} ← last uint as number`)\n  console.log(`  uint56 (56 bits): type = ${typeof decodedUint56} ← first uint as bigint`)\n\n  console.log()\n  console.log('=== Example Complete ===')\n  console.log('Key takeaway: Always check the bit length of uint types to know')\n  console.log('whether to expect number or bigint in your TypeScript code.')\n}\n\nmain()"
}
```
