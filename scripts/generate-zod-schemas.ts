#!/usr/bin/env npx ts-node

/**
 * Generate Zod schemas from OpenAPI 3.x specification files.
 *
 * Usage:
 *   npx ts-node scripts/generate-zod-schemas.ts \
 *     --spec .algokit-oas-generator/specs/algod.oas3.json \
 *     --output packages/algod_client/tests/schemas.ts
 *
 * Features:
 *   - Auto-detects bigint fields via x-algokit-bigint
 *   - Handles recursive schemas with z.lazy()
 *   - Topologically sorts schemas for correct dependency order
 *   - Supports all common OpenAPI types
 */

import * as fs from 'fs'
import * as path from 'path'

// =============================================================================
// Types
// =============================================================================

interface OpenAPISpec {
  components?: {
    schemas?: Record<string, SchemaObject>
  }
}

interface SchemaObject {
  type?: string
  format?: string
  properties?: Record<string, SchemaObject>
  required?: string[]
  items?: SchemaObject
  $ref?: string
  enum?: (string | number)[]
  allOf?: SchemaObject[]
  oneOf?: SchemaObject[]
  anyOf?: SchemaObject[]
  additionalProperties?: boolean | SchemaObject
  description?: string
  pattern?: string
  minimum?: number
  maximum?: number
  'x-algokit-bigint'?: boolean
  'x-algorand-format'?: string
  'x-algokit-bytes-base64'?: boolean
  'x-algokit-field-rename'?: string
}

interface SchemaInfo {
  name: string
  schema: SchemaObject
  dependencies: Set<string>
  isRecursive: boolean
  isSelfRecursive: boolean
  bigintFields: Set<string>
}

interface GeneratorOptions {
  spec: string
  output: string
  strict?: boolean
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (!args.spec || !args.output) {
    console.error('Usage: npx ts-node generate-zod-schemas.ts --spec <path> --output <path>')
    process.exit(1)
  }

  console.log(`Reading spec: ${args.spec}`)
  const spec = JSON.parse(fs.readFileSync(args.spec, 'utf-8')) as OpenAPISpec

  if (!spec.components?.schemas) {
    console.error('No schemas found in spec')
    process.exit(1)
  }

  const schemas = spec.components.schemas
  console.log(`Found ${Object.keys(schemas).length} schemas`)

  // Analyze schemas
  const schemaInfos = analyzeSchemas(schemas)

  // Find recursive schemas
  const recursiveSchemas = findRecursiveSchemas(schemaInfos)
  console.log(`Found ${recursiveSchemas.size} recursive schemas: ${Array.from(recursiveSchemas).join(', ')}`)

  // Topologically sort schemas
  const sortedNames = topologicalSort(schemaInfos)
  console.log(`Sorted ${sortedNames.length} schemas by dependencies`)

  // Generate Zod code
  const zodCode = generateZodCode(sortedNames, schemaInfos, recursiveSchemas, args.strict ?? false)

  // Write output
  const outputDir = path.dirname(args.output)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(args.output, zodCode)
  console.log(`Generated: ${args.output}`)
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Convert kebab-case and snake_case to camelCase
 * e.g., "last-round" -> "lastRound"
 *       "genesis_hash_b64" -> "genesisHashB64"
 *       "build_number" -> "buildNumber"
 */
function toCamelCase(str: string): string {
  // Handle both kebab-case (dashes) and snake_case (underscores)
  return str.replace(/[-_]([a-z0-9])/g, (_, letter) => letter.toUpperCase())
}

// =============================================================================
// Argument Parsing
// =============================================================================

function parseArgs(args: string[]): GeneratorOptions {
  const result: GeneratorOptions = { spec: '', output: '' }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--spec' && args[i + 1]) {
      result.spec = args[++i]
    } else if (args[i] === '--output' && args[i + 1]) {
      result.output = args[++i]
    } else if (args[i] === '--strict') {
      result.strict = true
    }
  }

  return result
}

// =============================================================================
// Schema Analysis
// =============================================================================

function analyzeSchemas(schemas: Record<string, SchemaObject>): Map<string, SchemaInfo> {
  const infos = new Map<string, SchemaInfo>()

  for (const [name, schema] of Object.entries(schemas)) {
    const dependencies = new Set<string>()
    const bigintFields = new Set<string>()

    const isSelfRecursive = collectDependencies(schema, dependencies, name)
    collectBigintFields(schema, bigintFields, '')

    infos.set(name, {
      name,
      schema,
      dependencies,
      isRecursive: false,
      isSelfRecursive,
      bigintFields,
    })
  }

  return infos
}

function collectDependencies(schema: SchemaObject, deps: Set<string>, currentSchema: string): boolean {
  let hasSelfRef = false

  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop()!
    if (refName === currentSchema) {
      hasSelfRef = true
    } else {
      deps.add(refName)
    }
  }

  if (schema.properties) {
    for (const prop of Object.values(schema.properties)) {
      if (collectDependencies(prop, deps, currentSchema)) {
        hasSelfRef = true
      }
    }
  }

  if (schema.items) {
    if (collectDependencies(schema.items, deps, currentSchema)) {
      hasSelfRef = true
    }
  }

  if (schema.allOf) {
    for (const s of schema.allOf) {
      if (collectDependencies(s, deps, currentSchema)) {
        hasSelfRef = true
      }
    }
  }

  if (schema.oneOf) {
    for (const s of schema.oneOf) {
      if (collectDependencies(s, deps, currentSchema)) {
        hasSelfRef = true
      }
    }
  }

  if (schema.anyOf) {
    for (const s of schema.anyOf) {
      if (collectDependencies(s, deps, currentSchema)) {
        hasSelfRef = true
      }
    }
  }

  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    if (collectDependencies(schema.additionalProperties, deps, currentSchema)) {
      hasSelfRef = true
    }
  }

  return hasSelfRef
}

function collectBigintFields(schema: SchemaObject, fields: Set<string>, prefix: string): void {
  if (schema['x-algokit-bigint']) {
    if (prefix) {
      fields.add(prefix)
    }
  }

  if (schema.properties) {
    for (const [name, prop] of Object.entries(schema.properties)) {
      const camelName = toCamelCase(name)
      const fieldPath = prefix ? `${prefix}.${camelName}` : camelName
      if (prop['x-algokit-bigint']) {
        fields.add(camelName)
      }
      collectBigintFields(prop, fields, fieldPath)
    }
  }

  if (schema.items) {
    collectBigintFields(schema.items, fields, prefix)
  }
}

// =============================================================================
// Recursive Schema Detection
// =============================================================================

function findRecursiveSchemas(schemaInfos: Map<string, SchemaInfo>): Set<string> {
  const recursive = new Set<string>()

  for (const [name, info] of schemaInfos) {
    // Check for self-recursive schemas first
    if (info.isSelfRecursive) {
      recursive.add(name)
      info.isRecursive = true
    }
    // Then check for mutual recursion through dependencies
    else if (isRecursive(name, info, schemaInfos, new Set())) {
      recursive.add(name)
      info.isRecursive = true
    }
  }

  return recursive
}

function isRecursive(targetName: string, info: SchemaInfo, allInfos: Map<string, SchemaInfo>, visited: Set<string>): boolean {
  if (visited.has(info.name)) {
    return info.name === targetName
  }

  visited.add(info.name)

  for (const dep of info.dependencies) {
    if (dep === targetName) {
      return true
    }

    const depInfo = allInfos.get(dep)
    if (depInfo && isRecursive(targetName, depInfo, allInfos, new Set(visited))) {
      return true
    }
  }

  return false
}

// =============================================================================
// Topological Sort
// =============================================================================

function topologicalSort(schemaInfos: Map<string, SchemaInfo>): string[] {
  const sorted: string[] = []
  const visited = new Set<string>()
  const visiting = new Set<string>()

  function visit(name: string): void {
    if (visited.has(name)) return
    if (visiting.has(name)) {
      // Circular dependency - will be handled with z.lazy()
      return
    }

    visiting.add(name)

    const info = schemaInfos.get(name)
    if (info) {
      for (const dep of info.dependencies) {
        if (schemaInfos.has(dep)) {
          visit(dep)
        }
      }
    }

    visiting.delete(name)
    visited.add(name)
    sorted.push(name)
  }

  for (const name of schemaInfos.keys()) {
    visit(name)
  }

  return sorted
}

// =============================================================================
// Zod Code Generation
// =============================================================================

function generateZodCode(
  sortedNames: string[],
  schemaInfos: Map<string, SchemaInfo>,
  recursiveSchemas: Set<string>,
  strict: boolean,
): string {
  const lines: string[] = [
    '/**',
    ' * Auto-generated Zod schemas from OpenAPI specification.',
    ' * Do not edit manually.',
    ' *',
    ` * Generated: ${new Date().toISOString()}`,
    ' */',
    '',
    "import { z } from 'zod'",
    "import { Address } from '@algorandfoundation/algokit-common'",
    '',
  ]

  // Forward declarations for recursive schemas
  if (recursiveSchemas.size > 0) {
    lines.push('// Forward declarations for recursive schemas')
    for (const name of recursiveSchemas) {
      lines.push(`export type ${name}Type = z.infer<typeof ${name}>`)
    }
    lines.push('')
  }

  // Generate each schema
  for (const name of sortedNames) {
    const info = schemaInfos.get(name)!
    const zodSchema = generateSchemaZod(name, info, recursiveSchemas, strict)
    lines.push(zodSchema)
    lines.push('')
  }

  return lines.join('\n')
}

function generateSchemaZod(name: string, info: SchemaInfo, recursiveSchemas: Set<string>, strict: boolean): string {
  const schema = info.schema
  const isRecursive = recursiveSchemas.has(name)

  let zodExpr = schemaToZod(schema, info.bigintFields, recursiveSchemas, strict, name)

  // Wrap recursive schemas with z.lazy()
  if (isRecursive) {
    return `export const ${name}: z.ZodType<any> = z.lazy(() => ${zodExpr})`
  }

  return `export const ${name} = ${zodExpr}`
}

function schemaToZod(
  schema: SchemaObject,
  bigintFields: Set<string>,
  recursiveSchemas: Set<string>,
  strict: boolean,
  currentField?: string,
): string {
  // Handle $ref
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop()!
    return refName
  }

  // Handle allOf (intersection)
  if (schema.allOf && schema.allOf.length > 0) {
    const parts = schema.allOf.map((s) => schemaToZod(s, bigintFields, recursiveSchemas, strict))
    if (parts.length === 1) return parts[0]
    return `z.intersection(${parts.join(', ')})`
  }

  // Handle oneOf/anyOf (union)
  if (schema.oneOf && schema.oneOf.length > 0) {
    const parts = schema.oneOf.map((s) => schemaToZod(s, bigintFields, recursiveSchemas, strict))
    return `z.union([${parts.join(', ')}])`
  }

  if (schema.anyOf && schema.anyOf.length > 0) {
    const parts = schema.anyOf.map((s) => schemaToZod(s, bigintFields, recursiveSchemas, strict))
    return `z.union([${parts.join(', ')}])`
  }

  // Handle enum
  if (schema.enum) {
    if (schema.type === 'string') {
      const values = schema.enum.map((v) => `'${v}'`).join(', ')
      return `z.enum([${values}])`
    } else {
      return `z.union([${schema.enum.map((v) => `z.literal(${typeof v === 'string' ? `'${v}'` : v})`).join(', ')}])`
    }
  }

  // Handle by type
  switch (schema.type) {
    case 'string':
      return stringToZod(schema)

    case 'integer':
    case 'number':
      return numberToZod(schema, bigintFields, currentField)

    case 'boolean':
      return 'z.boolean()'

    case 'array':
      return arrayToZod(schema, bigintFields, recursiveSchemas, strict)

    case 'object':
      return objectToZod(schema, bigintFields, recursiveSchemas, strict)

    default:
      // No type specified - could be a free-form object or any
      if (schema.properties || schema.additionalProperties) {
        return objectToZod(schema, bigintFields, recursiveSchemas, strict)
      }
      return 'z.any()'
  }
}

function stringToZod(schema: SchemaObject): string {
  // Handle Address format - AlgodClient returns Address object instead of string
  if (schema['x-algorand-format'] === 'Address') {
    return 'z.instanceof(Address)'
  }

  // Handle byte format - AlgodClient returns Uint8Array instead of base64 string
  if (schema.format === 'byte' || schema['x-algokit-bytes-base64']) {
    return 'z.instanceof(Uint8Array)'
  }

  let zod = 'z.string()'

  if (schema.pattern) {
    // Escape the pattern for use in a regex literal
    const escapedPattern = schema.pattern.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    zod += `.regex(/${escapedPattern}/)`
  }

  return zod
}

function numberToZod(schema: SchemaObject, bigintFields: Set<string>, currentField?: string): string {
  // Check if this field should be bigint
  if (schema['x-algokit-bigint'] || (currentField && bigintFields.has(currentField))) {
    return 'z.bigint()'
  }

  let zod = 'z.number()'

  if (schema.type === 'integer') {
    zod += '.int()'
  }

  if (schema.minimum !== undefined) {
    zod += `.gte(${schema.minimum})`
  }

  if (schema.maximum !== undefined) {
    zod += `.lte(${schema.maximum})`
  }

  return zod
}

function arrayToZod(schema: SchemaObject, bigintFields: Set<string>, recursiveSchemas: Set<string>, strict: boolean): string {
  if (!schema.items) {
    return 'z.array(z.any())'
  }

  const itemsZod = schemaToZod(schema.items, bigintFields, recursiveSchemas, strict)
  return `z.array(${itemsZod})`
}

function objectToZod(schema: SchemaObject, bigintFields: Set<string>, recursiveSchemas: Set<string>, strict: boolean): string {
  // Handle additionalProperties with no fixed properties (Record type)
  if (!schema.properties && schema.additionalProperties) {
    if (typeof schema.additionalProperties === 'boolean') {
      return 'z.record(z.string(), z.any())'
    }
    const valueZod = schemaToZod(schema.additionalProperties, bigintFields, recursiveSchemas, strict)
    return `z.record(z.string(), ${valueZod})`
  }

  // Handle object with no properties or empty properties
  if (!schema.properties || Object.keys(schema.properties).length === 0) {
    return 'z.record(z.string(), z.any())'
  }

  const required = new Set(schema.required || [])
  const fields: string[] = []

  for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
    const fieldZod = schemaToZod(fieldSchema, bigintFields, recursiveSchemas, strict, fieldName)
    const isOptional = !required.has(fieldName)

    // Use x-algokit-field-rename if present, otherwise convert kebab-case/snake_case to camelCase
    const outputFieldName = fieldSchema['x-algokit-field-rename']
      ? toCamelCase(fieldSchema['x-algokit-field-rename'])
      : toCamelCase(fieldName)

    // Use quotes for field names with special characters (though camelCase shouldn't have them)
    const quotedName = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(outputFieldName) ? outputFieldName : `'${outputFieldName}'`

    if (isOptional) {
      fields.push(`  ${quotedName}: ${fieldZod}.optional()`)
    } else {
      fields.push(`  ${quotedName}: ${fieldZod}`)
    }
  }

  let result = `z.object({\n${fields.join(',\n')}\n})`

  if (strict) {
    result += '.strict()'
  }

  return result
}

// =============================================================================
// Run
// =============================================================================

main().catch((err) => {
  console.error(err)
  process.exit(1)
})