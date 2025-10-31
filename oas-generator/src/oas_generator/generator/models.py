from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

Schema = dict[str, Any]
Operation = dict[str, Any]
TemplateContext = dict[str, Any]
FileMap = dict[Path, str]


@dataclass
class Parameter:
    """Represents an API parameter."""

    name: str
    var_name: str
    location: str
    required: bool
    ts_type: str
    description: str | None = None
    stringify_bigint: bool = False


@dataclass
class RequestBody:
    """Represents a request body specification."""

    media_type: str
    ts_type: str
    required: bool
    supports_msgpack: bool = False
    supports_json: bool = False


@dataclass
class OperationContext:
    """Complete context for an API operation."""

    operation_id: str
    method: str
    path: str
    description: str | None
    parameters: list[Parameter]
    request_body: RequestBody | None
    response_type: str
    import_types: set[str]
    tags: list[str] | None = None
    returns_msgpack: bool = False
    has_format_param: bool = False
    format_var_name: str | None = None
    # When the original spec had a query param `format` with enum ['msgpack'] only,
    # we don't expose it to callers but still need to set it implicitly on requests
    force_msgpack_query: bool = False
    error_types: list[ErrorDescriptor] | None = None

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary for template rendering."""
        return {
            "operationId": self.operation_id,
            "method": self.method,
            "path": self.path,
            "description": self.description,
            "parameters": [self._param_to_dict(p) for p in self.parameters],
            "pathParameters": [self._param_to_dict(p) for p in self.parameters if p.location == "path"],
            "otherParameters": [self._param_to_dict(p) for p in self.parameters if p.location in {"query", "header"}],
            "requestBody": self._request_body_to_dict(self.request_body) if self.request_body else None,
            "responseTsType": self.response_type,
            "returnsMsgpack": self.returns_msgpack,
            "hasFormatParam": self.has_format_param,
            "formatVarName": self.format_var_name,
            "forceMsgpackQuery": self.force_msgpack_query,
            "errorTypes": [self._error_to_dict(e) for e in (self.error_types or [])],
        }

    @staticmethod
    def _error_to_dict(error: ErrorDescriptor) -> dict[str, Any]:
        return {
            "errorName": error.error_name,
            "statusCodes": error.status_codes,
            "errorType": error.error_type,
            "description": error.description,
            "isArray": error.is_array,
            "arrayItemType": error.array_item_type,
        }

    @staticmethod
    def _param_to_dict(param: Parameter) -> dict[str, Any]:
        return {
            "name": param.name,
            "varName": param.var_name,
            "in": param.location,
            "required": param.required,
            "tsType": param.ts_type,
            "description": param.description,
            "stringifyBigInt": param.stringify_bigint,
        }

    @staticmethod
    def _request_body_to_dict(body: RequestBody) -> dict[str, Any]:
        return {
            "mediaType": body.media_type,
            "tsType": body.ts_type,
            "required": body.required,
            "supportsMsgpack": body.supports_msgpack,
            "supportsJson": body.supports_json,
        }


@dataclass
class FieldDescriptor:
    """Descriptor for a single model field used by templates."""

    name: str
    wire_name: str
    ts_type: str
    is_array: bool
    ref_model: str | None
    is_bytes: bool
    is_bigint: bool
    is_signed_txn: bool
    is_optional: bool
    is_nullable: bool


@dataclass
class ErrorDescriptor:
    """Descriptor for error response handling with structured error types."""

    error_name: str
    status_codes: list[str]
    error_type: str
    description: str | None = None
    is_array: bool = False
    array_item_type: str | None = None


@dataclass
class ModelDescriptor:
    """Descriptor for a schema model including field metadata."""

    model_name: str
    fields: list[FieldDescriptor]
    is_object: bool
    is_array: bool = False
    array_item_ref: str | None = None
    array_item_is_bytes: bool = False
    array_item_is_bigint: bool = False
    array_item_is_signed_txn: bool = False
