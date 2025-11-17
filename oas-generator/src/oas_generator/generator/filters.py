"""TypeScript-specific Jinja2 filters and helpers.

Phase 2 adds OpenAPI -> TS type mapping and naming utilities.
"""

from __future__ import annotations

import re
from collections.abc import Callable, Iterable, Mapping
from functools import cache
from typing import Any

from oas_generator import constants
from oas_generator.constants import MediaType, OperationKey, SchemaKey, TypeScriptType
from oas_generator.generator.codec_processor import CodecProcessor

type Schema = Mapping[str, Any]
type Schemas = Mapping[str, Schema]

_IDENTIFIER_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


def ts_doc_comment(text: str | None) -> str:
    """Format text as a TypeScript doc comment."""
    if not text:
        return ""
    lines = [line.strip() for line in str(text).strip().splitlines()]
    body = "\n".join(f" * {line}" if line else " *" for line in lines)
    return f"/**\n{body}\n */"


def ts_string_literal(text: str) -> str:
    """Escape to a valid TypeScript string literal using backticks."""
    escaped = str(text).replace("`", "\\`").replace("\\", "\\\\")
    return f"`{escaped}`"


def ts_optional(type_str: str) -> str:
    """Return a TS optional type representation."""
    return f"{type_str} | undefined"


def ts_array(type_str: str) -> str:
    """Return a TS array type representation."""
    return f"Array<{type_str}>"


_WORD_BOUNDARY_RE = re.compile(r"([a-z0-9])([A-Z])")
_NON_ALNUM_RE = re.compile(r"[^A-Za-z0-9]+")
_SNAKE_CASE_DELIMITER_RE = re.compile(r"[\-\.\s]")
_ACRONYM_SPLIT_RE = re.compile(r"([A-Z])([A-Z][a-z])")
_LOWER_TO_UPPER_SPLIT_RE = re.compile(r"([a-z0-9])([A-Z])")

_U32_MAX_VALUE = 4294967295
_SMALL_INTEGER_MAX = 100
_ENUM_KEYWORDS = (
    "value `1`",
    "value `2`",
    "value 1",
    "value 2",
    "refers to",
    "type.",
    "action.",
    "enum",
)


@cache
def _split_words(name: str) -> tuple[str, ...]:
    """Split name into words for case conversion."""
    normalized = _NON_ALNUM_RE.sub(" ", _WORD_BOUNDARY_RE.sub(r"\1 \2", name)).strip()
    parts = tuple(part for part in normalized.split() if part)
    return parts or (name,)


def _snake_case_like_rust(name: str) -> str:
    """Convert a string to snake_case using the same rules as the Rust generator."""

    # Replace common delimiters with underscore
    s = _SNAKE_CASE_DELIMITER_RE.sub("_", name)
    # Split acronym sequences before CamelCase words (e.g., "EMultisig" -> "E_Multisig")
    s = _ACRONYM_SPLIT_RE.sub(r"\1_\2", s)
    # Split lower/digit to upper transitions (e.g., "v1Delete" -> "v1_Delete")
    s = _LOWER_TO_UPPER_SPLIT_RE.sub(r"\1_\2", s)
    return s.lower()


def ts_pascal_case(name: str) -> str:
    """Convert name to PascalCase (aligned with Rust pascalcase)."""
    snake = _snake_case_like_rust(name)
    return "".join(part.capitalize() for part in snake.split("_") if part)


def ts_camel_case(name: str) -> str:
    """Convert name to camelCase."""
    pascal = ts_pascal_case(name)
    return pascal[:1].lower() + pascal[1:] if pascal else pascal


def ts_kebab_case(name: str) -> str:
    """Convert name to kebab-case (aligned with Rust snakecase rules)."""
    return _snake_case_like_rust(name).replace("_", "-")


def ts_property_name(name: str) -> str:
    """Return a safe TS property name, quoting if necessary."""
    return name if _IDENTIFIER_RE.match(name) else f"'{name}'"


# ---------- OpenAPI -> TS type mapping ----------


def _extract_ref_name(ref_string: str) -> str:
    return ref_string.split("/")[-1]


def _union(types: Iterable[str]) -> str:
    """Create TypeScript union type from list of types."""
    uniqued = tuple(dict.fromkeys(t for t in types if t))
    return " | ".join(uniqued) if uniqued else TypeScriptType.NEVER


def _intersection(types: Iterable[str]) -> str:
    """Create TypeScript intersection type from list of types."""
    parts = [t for t in types if t and t != TypeScriptType.ANY]
    return " & ".join(parts) if parts else TypeScriptType.ANY


def _nullable(type_str: str, schema: Schema, schemas: Schemas | None) -> str:
    # OpenAPI 3.0 nullable flag
    if schema.get(SchemaKey.NULLABLE) is True:
        return _union((type_str, TypeScriptType.NULL))

    # OpenAPI 3.1 union type with null
    t = schema.get(SchemaKey.TYPE)
    if isinstance(t, list) and TypeScriptType.NULL in t:
        non_nulls = [x for x in t if x != TypeScriptType.NULL]
        # If there's exactly one non-null type, union with null
        if len(non_nulls) == 1:
            return _union((ts_type({SchemaKey.TYPE: non_nulls[0]}, schemas), TypeScriptType.NULL))
        # Else, build a union of all non-nulls + null
        inner = _union(ts_type({SchemaKey.TYPE: n}, schemas) for n in non_nulls)
        return _union((inner, TypeScriptType.NULL))

    return type_str


def _inline_object(schema: Schema, schemas: Schemas | None) -> str:
    properties: dict[str, Any] = schema.get(SchemaKey.PROPERTIES, {}) or {}
    required = set(schema.get(SchemaKey.REQUIRED, []) or [])
    parts: list[str] = []

    for prop_name, prop_schema in properties.items():
        canonical_name = prop_schema.get(constants.X_ALGOKIT_FIELD_RENAME) or prop_name
        # Add property description as doc comment
        description = prop_schema.get("description")
        if description:
            doc_comment = ts_doc_comment(description)
            indented_doc = "\n  ".join(doc_comment.split("\n"))
            parts.append(f"\n  {indented_doc}")

        # Generate camelCase TS property names for better DX
        ts_name = ts_camel_case(canonical_name)
        ts_t = ts_type(prop_schema, schemas)
        opt = "" if prop_name in required else "?"
        parts.append(f"{ts_name}{opt}: {ts_t};")

    # additionalProperties -> index signature
    if "additionalProperties" in schema:
        addl = schema["additionalProperties"]
        if addl is True:
            parts.append("[key: string]: unknown;")
        elif isinstance(addl, dict):
            parts.append(f"[key: string]: {ts_type(addl, schemas)};")

    if parts:
        # Format with proper indentation
        formatted_parts = []
        for part in parts:
            if part.startswith("\n"):
                formatted_parts.append(part)
            else:
                formatted_parts.append(f"  {part}")
        return "{\n" + "\n".join(formatted_parts) + "\n}"
    return "Record<string, unknown>"


def _map_primitive(schema_type: str, schema_format: str | None, schema: Schema) -> str:
    """Map OpenAPI primitive types to TypeScript types."""
    if schema_type == "integer":
        schema_format = schema.get(SchemaKey.FORMAT)
        is_declared_bigint = schema.get(constants.X_ALGOKIT_BIGINT) is True

        result = (
            TypeScriptType.BIGINT
            if is_declared_bigint
            else TypeScriptType.NUMBER
        )
    elif schema_type == "number":
        result = TypeScriptType.NUMBER
    elif schema_type == "string":
        is_byte = schema_format == "byte" or schema.get(constants.X_ALGOKIT_BYTES_BASE64) is True
        result = TypeScriptType.UINT8ARRAY if is_byte else TypeScriptType.STRING
    elif schema_type == "boolean":
        result = TypeScriptType.BOOLEAN
    else:
        result = TypeScriptType.ANY

    return result


def ts_enum_type(schema: Schema) -> str | None:
    if SchemaKey.ENUM not in schema:
        return None

    if schema.get(constants.X_ALGOKIT_BIGINT) is True:
        # For bigint-marked enums, use bigint type directly
        return TypeScriptType.BIGINT

    type_val = schema.get(SchemaKey.TYPE)
    values = schema.get(SchemaKey.ENUM, [])

    if type_val == "string":
        return " | ".join([f"'{v!s}'" for v in values])

    if type_val == "integer":
        # Integers used as enum discriminators are small; map to number
        return " | ".join([str(v) for v in values])

    # Fallback: treat as string literals
    return " | ".join([f"'{v!s}'" for v in values])


def ts_type(schema: Schema | None, schemas: Schemas | None = None) -> str:
    """Map OpenAPI schema to a TypeScript type string."""
    if not schema:
        return TypeScriptType.ANY

    if isinstance(schema, dict) and schema.get(constants.X_ALGOKIT_SIGNED_TXN) is True:
        return "SignedTransaction"

    if "$ref" in schema:
        ref_name = _extract_ref_name(schema["$ref"])
        return ts_pascal_case(ref_name)

    return _ts_type_inner(schema, schemas)


def _ts_type_inner(schema: Schema, schemas: Schemas | None) -> str:
    processors: list[tuple[str, _TypeProcessor]] = [
        (SchemaKey.ALL_OF, _process_all_of),
        (SchemaKey.ONE_OF, _process_one_of),
        (SchemaKey.ANY_OF, _process_any_of),
    ]

    for key, handler in processors:
        if key in schema:
            return handler(schema, schemas)

    enum_type = ts_enum_type(schema)
    if enum_type:
        return enum_type

    return _map_non_composite(schema, schemas)


def _map_non_composite(schema: Schema, schemas: Schemas | None) -> str:
    schema_type = schema.get(SchemaKey.TYPE)

    if schema_type == "array":
        items_schema = schema.get(SchemaKey.ITEMS, {})
        is_signed_txn = isinstance(items_schema, dict) and (items_schema.get(constants.X_ALGOKIT_SIGNED_TXN) is True)
        items_type = "SignedTransaction" if is_signed_txn else ts_type(items_schema, schemas)
        return f"{items_type}[]"

    if schema_type == TypeScriptType.OBJECT or (
        not schema_type and (SchemaKey.PROPERTIES in schema or SchemaKey.ADDITIONAL_PROPERTIES in schema)
    ):
        object_type = _inline_object(schema, schemas)
        return _nullable(object_type, schema, schemas)

    primitive_type = _map_primitive(str(schema_type), schema.get(SchemaKey.FORMAT), schema)
    return _nullable(primitive_type, schema, schemas)


_TypeProcessor = Callable[[Schema, Schemas | None], str]


def _process_all_of(schema: Schema, schemas: Schemas | None) -> str:
    parts = schema.get(SchemaKey.ALL_OF, [])
    return _intersection(ts_type(part, schemas) for part in parts)


def _process_one_of(schema: Schema, schemas: Schemas | None) -> str:
    options = schema.get(SchemaKey.ONE_OF, [])
    return _union(ts_type(option, schemas) for option in options)


def _process_any_of(schema: Schema, schemas: Schemas | None) -> str:
    options = schema.get(SchemaKey.ANY_OF, [])
    return _union(ts_type(option, schemas) for option in options)


# ---------- Response helpers ----------


def has_msgpack_2xx(responses: Schema) -> bool:
    for status, resp in (responses or {}).items():
        if not str(status).startswith(constants.SUCCESS_STATUS_PREFIX):
            continue
        content = (resp or {}).get(OperationKey.CONTENT, {})
        if any(ct in (content or {}) for ct in (MediaType.MSGPACK, MediaType.BINARY)):
            return True
    return False


def response_content_types(responses: Schema) -> list[str]:
    content_types: set[str] = set()
    for status, resp in (responses or {}).items():
        if not str(status).startswith(constants.SUCCESS_STATUS_PREFIX):
            continue
        content = (resp or {}).get(OperationKey.CONTENT, {})
        content_types.update(content)
    return sorted(content_types)


def collect_schema_refs(schema: Schema, current_schema_name: str | None = None) -> list[str]:
    """Collect referenced schema names, excluding self-references."""
    refs: set[str] = set()
    target_name = ts_pascal_case(current_schema_name) if current_schema_name else None
    stack: list[Any] = [schema]

    while stack:
        node = stack.pop()
        if not isinstance(node, dict):
            continue
        if "$ref" in node:
            ref_name = ts_pascal_case(_extract_ref_name(node["$ref"]))
            if target_name is None or ref_name != target_name:
                refs.add(ref_name)
            continue

        props = node.get(SchemaKey.PROPERTIES)
        if isinstance(props, dict):
            stack.extend(props.values())

        items = node.get(SchemaKey.ITEMS)
        if isinstance(items, dict):
            stack.append(items)

        for key in (SchemaKey.ALL_OF, SchemaKey.ONE_OF, SchemaKey.ANY_OF):
            collection = node.get(key)
            if isinstance(collection, list):
                stack.extend(child for child in collection if isinstance(child, dict))

        additional = node.get(SchemaKey.ADDITIONAL_PROPERTIES)
        if isinstance(additional, dict):
            stack.append(additional)

    return sorted(refs)


def schema_uses_signed_txn(schema: Schema) -> bool:
    """Detect if a schema (recursively) uses the x-algokit-signed-txn vendor extension."""
    stack: list[Any] = [schema]

    while stack:
        node = stack.pop()
        if not isinstance(node, dict):
            continue
        if node.get(constants.X_ALGOKIT_SIGNED_TXN) is True:
            return True
        if "$ref" in node:
            continue

        props = node.get(constants.SchemaKey.PROPERTIES)
        if isinstance(props, dict):
            stack.extend(props.values())

        items = node.get(constants.SchemaKey.ITEMS)
        if isinstance(items, dict):
            stack.append(items)

        for key in (constants.SchemaKey.ALL_OF, constants.SchemaKey.ONE_OF, constants.SchemaKey.ANY_OF):
            collection = node.get(key)
            if isinstance(collection, list):
                stack.extend(child for child in collection if isinstance(child, dict))

        addl = node.get(constants.SchemaKey.ADDITIONAL_PROPERTIES)
        if isinstance(addl, dict):
            stack.append(addl)

    return False


# ---------- Type string helpers for templates ----------


def ts_is_array_type(type_str: str) -> bool:
    t = (type_str or "").strip()
    return t.endswith("[]") or (t.startswith("Array<") and t.endswith(">"))


def ts_array_item_type(type_str: str) -> str:
    t = (type_str or "").strip()
    if t.endswith("[]"):
        return t[:-2]
    if t.startswith("Array<") and t.endswith(">"):
        return t[len("Array<") : -1]
    return t


def ts_is_builtin_or_primitive(type_str: str) -> bool:
    t = (type_str or "").strip()
    return t in constants.TS_BUILTIN_TYPES or t in {TypeScriptType.ANY, TypeScriptType.NULL, TypeScriptType.OBJECT}


def ts_is_model_type(type_str: str) -> bool:
    t = (type_str or "").strip()
    if ts_is_array_type(t):
        t = ts_array_item_type(t)
    # Treat PascalCase identifiers as model types and exclude TS builtins
    return bool(re.match(r"^[A-Z][A-Za-z0-9_]*$", t)) and not ts_is_builtin_or_primitive(t)


FILTERS: dict[str, Any] = {
    "ts_doc_comment": ts_doc_comment,
    "ts_string_literal": ts_string_literal,
    "ts_optional": ts_optional,
    "ts_array": ts_array,
    "ts_type": ts_type,
    "ts_pascal_case": ts_pascal_case,
    "ts_camel_case": ts_camel_case,
    "ts_kebab_case": ts_kebab_case,
    "ts_property_name": ts_property_name,
    "has_msgpack_2xx": has_msgpack_2xx,
    "response_content_types": response_content_types,
    "collect_schema_refs": collect_schema_refs,
    "schema_uses_signed_txn": schema_uses_signed_txn,
    "ts_is_array_type": ts_is_array_type,
    "ts_array_item_type": ts_array_item_type,
    "ts_is_builtin_or_primitive": ts_is_builtin_or_primitive,
    "ts_is_model_type": ts_is_model_type,
    # Codec generation filters
    "field_codec_expr": CodecProcessor.field_codec_expr,
    "array_item_codec_expr": CodecProcessor.array_item_codec_expr,
}
