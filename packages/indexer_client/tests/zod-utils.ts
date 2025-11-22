import { z } from 'zod'
import type { FieldType, ModelMetadata } from '../src/core/model-runtime'

/**
 * Cache to store schemas for reuse and circular reference handling.
 * Maps model name to its Zod schema (or lazy wrapper for circular refs).
 */
type SchemaCache = Map<string, z.ZodTypeAny>

/**
 * Converts a ModelMetadata field type to a Zod schema
 */
function fieldTypeToZodSchema(fieldType: FieldType, cache: SchemaCache): z.ZodTypeAny {
  if (fieldType.kind === 'scalar') {
    if (fieldType.isBigint) {
      return z.bigint()
    }
    if (fieldType.isBytes) {
      return z.instanceof(Uint8Array)
    }
    // Scalar could be string, number, or boolean
    return z.union([z.string(), z.number(), z.boolean()])
  }

  if (fieldType.kind === 'model') {
    const meta = typeof fieldType.meta === 'function' ? fieldType.meta() : fieldType.meta
    return modelMetadataToZodSchemaInternal(meta, cache)
  }

  if (fieldType.kind === 'array') {
    const itemSchema = fieldTypeToZodSchema(fieldType.item, cache)
    return z.array(itemSchema)
  }

  if (fieldType.kind === 'map' || fieldType.kind === 'record') {
    const valueSchema = fieldTypeToZodSchema(fieldType.value, cache)
    return z.record(z.string(), valueSchema)
  }

  if (fieldType.kind === 'codec') {
    // Codec types are complex, treat as unknown for now
    return z.unknown()
  }

  // Fallback for unknown types
  return z.unknown()
}

/**
 * Internal implementation that handles caching and circular references
 */
function modelMetadataToZodSchemaInternal(meta: ModelMetadata, cache: SchemaCache): z.ZodTypeAny {
  const modelName = meta.name

  // If already in cache, return it (handles both completed schemas and circular refs)
  if (cache.has(modelName)) {
    return cache.get(modelName)!
  }

  // For circular references: Add a lazy placeholder FIRST, then build the actual schema
  // This breaks the recursion cycle
  const lazySchema = z.lazy(() => cache.get(modelName)!)
  cache.set(modelName, lazySchema)

  // Handle array metadata (e.g., TealKeyValueStore)
  if (meta.kind === 'array') {
    if (!meta.arrayItems) {
      throw new Error(`Array type must have arrayItems defined`)
    }
    const itemSchema = fieldTypeToZodSchema(meta.arrayItems, cache)
    const arraySchema = z.array(itemSchema)
    cache.set(modelName, arraySchema)
    return arraySchema
  }

  if (meta.kind !== 'object') {
    throw new Error(`Only object and array types supported, got: ${meta.kind}`)
  }

  if (!meta.fields) {
    throw new Error(`Object type must have fields defined`)
  }

  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of meta.fields) {
    let fieldSchema = fieldTypeToZodSchema(field.type, cache)

    // Handle optional fields
    if (field.optional) {
      fieldSchema = fieldSchema.optional()
    }

    // Handle nullable fields
    if (field.nullable) {
      fieldSchema = fieldSchema.nullable()
    }

    shape[field.name] = fieldSchema
  }

  // Use strict mode to reject extra properties not in the schema
  const objectSchema = z.object(shape).strict()

  // Replace the lazy placeholder with the actual schema
  cache.set(modelName, objectSchema)

  return objectSchema
}

/**
 * Converts ModelMetadata to a Zod schema for runtime validation
 *
 * Handles circular references by using z.lazy() placeholders during construction.
 *
 * @example
 * ```typescript
 * import { RawTransactionMeta } from '../src/models/raw-transaction'
 *
 * const schema = modelMetadataToZodSchema(RawTransactionMeta)
 * const result = schema.parse(data) // validates at runtime
 * ```
 */
export function modelMetadataToZodSchema(meta: ModelMetadata): z.ZodTypeAny {
  const cache = new Map<string, z.ZodTypeAny>()
  return modelMetadataToZodSchemaInternal(meta, cache)
}
