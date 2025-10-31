"""Constants for the TypeScript OAS generator using Enums for better organization."""

from __future__ import annotations

from enum import StrEnum
from typing import Final


class MediaType(StrEnum):
    """Content types for request/response handling."""

    JSON = "application/json"
    MSGPACK = "application/msgpack"
    TEXT = "text/plain"
    BINARY = "application/x-binary"
    OCTET_STREAM = "application/octet-stream"


class ParamLocation(StrEnum):
    """OpenAPI parameter locations."""

    PATH = "path"
    QUERY = "query"
    HEADER = "header"


class TypeScriptType(StrEnum):
    """TypeScript type literals."""

    UINT8ARRAY = "Uint8Array"
    VOID = "void"
    STRING = "string"
    NUMBER = "number"
    BIGINT = "bigint"
    BOOLEAN = "boolean"
    ANY = "any"
    NULL = "null"
    OBJECT = "object"
    NUMBER_OR_BIGINT = "number | bigint"
    NEVER = "never"


class SchemaKey(StrEnum):
    """OpenAPI schema object keys."""

    TYPE = "type"
    PROPERTIES = "properties"
    REQUIRED = "required"
    ADDITIONAL_PROPERTIES = "additionalProperties"
    ALL_OF = "allOf"
    ONE_OF = "oneOf"
    ANY_OF = "anyOf"
    ITEMS = "items"
    ENUM = "enum"
    NULLABLE = "nullable"
    FORMAT = "format"
    COMPONENTS = "components"
    COMPONENTS_SCHEMAS = "schemas"
    PATHS = "paths"
    MAXIMUM = "maximum"
    MINIMUM = "minimum"


class OperationKey(StrEnum):
    """OpenAPI operation object keys."""

    OPERATION_ID = "operationId"
    PARAMETERS = "parameters"
    REQUEST_BODY = "requestBody"
    RESPONSES = "responses"
    TAGS = "tags"
    CONTENT = "content"
    IN = "in"
    NAME = "name"
    DESCRIPTION = "description"


class DirectoryName(StrEnum):
    """Generated code directory structure."""

    SRC = "src"
    MODELS = "models"
    APIS = "apis"
    CORE = "core"


class HttpMethod(StrEnum):
    """HTTP methods supported by the generator."""

    GET = "get"
    POST = "post"
    PUT = "put"
    DELETE = "delete"
    PATCH = "patch"
    HEAD = "head"
    OPTIONS = "options"


# TypeScript reserved words (kept as frozenset for performance in lookups)
TS_RESERVED_WORDS: Final[frozenset[str]] = frozenset(
    [
        "abstract",
        "any",
        "as",
        "boolean",
        "break",
        "case",
        "catch",
        "class",
        "const",
        "continue",
        "debugger",
        "default",
        "delete",
        "do",
        "else",
        "enum",
        "export",
        "extends",
        "false",
        "finally",
        "for",
        "from",
        "function",
        "if",
        "implements",
        "import",
        "in",
        "instanceof",
        "interface",
        "let",
        "new",
        "null",
        "number",
        "package",
        "private",
        "protected",
        "public",
        "return",
        "static",
        "string",
        "super",
        "switch",
        "symbol",
        "this",
        "throw",
        "true",
        "try",
        "type",
        "typeof",
        "undefined",
        "var",
        "void",
        "while",
        "with",
        "yield",
        "await",
        "async",
        "constructor",
    ]
)

# Builtin TypeScript types (derived from enum for consistency)
TS_BUILTIN_TYPES: Final[frozenset[str]] = frozenset(
    [
        TypeScriptType.UINT8ARRAY,
        TypeScriptType.VOID,
        TypeScriptType.STRING,
        TypeScriptType.NUMBER,
        TypeScriptType.BIGINT,
        TypeScriptType.BOOLEAN,
        TypeScriptType.NEVER,
    ]
)

# HTTP methods as frozenset (for performance in lookups)
HTTP_METHODS: Final[frozenset[str]] = frozenset(m.value for m in HttpMethod)

# Default values
DEFAULT_OUTPUT_DIR: Final[str] = "./generated_ts"
DEFAULT_PACKAGE_NAME: Final[str] = "api_ts_client"
DEFAULT_TEMPLATE_DIR: Final[str] = "templates"

# File names
INDEX_FILE: Final[str] = "index.ts"
API_SERVICE_FILE: Final[str] = "api.service.ts"
MODEL_FILE_EXTENSION: Final[str] = ".ts"

# Template file names
MODEL_TEMPLATE: Final[str] = "models/model.ts.j2"
MODELS_INDEX_TEMPLATE: Final[str] = "models/index.ts.j2"
API_SERVICE_TEMPLATE: Final[str] = "apis/service.ts.j2"
APIS_INDEX_TEMPLATE: Final[str] = "apis/index.ts.j2"

# Status code prefixes
SUCCESS_STATUS_PREFIX: Final[str] = "2"

# Special parameter values
FORMAT_PARAM_NAME: Final[str] = "format"

# Default values for operations
DEFAULT_TAG: Final[str] = "default"
DEFAULT_API_TAG: Final[str] = "api"


# Vendor extensions
X_ALGOKIT_FIELD_RENAME: Final[str] = "x-algokit-field-rename"

# Backup directory prefix
BACKUP_DIR_PREFIX: Final[str] = "tsgen_bak_"

# Custom extension
X_ALGOKIT_BIGINT: Final[str] = "x-algokit-bigint"
X_ALGOKIT_SIGNED_TXN: Final[str] = "x-algokit-signed-txn"
X_ALGOKIT_BYTES_BASE64: Final[str] = "x-algokit-bytes-base64"

# Template configuration
TEMPLATE_TRIM_BLOCKS: Final[bool] = True
TEMPLATE_LSTRIP_BLOCKS: Final[bool] = True
