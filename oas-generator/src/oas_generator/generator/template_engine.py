from __future__ import annotations

import re
from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, select_autoescape

from oas_generator import constants
from oas_generator.generator.codec_processor import CodecProcessor, register_model_kind
from oas_generator.generator.filters import (
    FILTERS,
    is_array_of_uint8_schema,
    ts_camel_case,
    ts_kebab_case,
    ts_pascal_case,
    ts_type,
)
from oas_generator.generator.models import (
    FieldDescriptor,
    ModelDescriptor,
    OperationContext,
    Parameter,
    RequestBody,
)
from oas_generator.parser.oas_parser import OASParser

# Type aliases for clarity
type Schema = dict[str, Any]
type Schemas = Mapping[str, Schema]
type TemplateContext = dict[str, Any]
type FileMap = dict[Path, str]

_TYPE_TOKEN_RE = re.compile(r"\b[A-Z][A-Za-z0-9_]*\b")


@dataclass
class OperationInput:
    """Inputs required to build an `OperationContext`."""

    operation_id: str
    method: str
    path: str
    operation: Schema
    path_params: list[Schema]
    spec: Schema


class TemplateRenderer:
    """Handles template rendering operations."""

    def __init__(self, template_dir: Path | None = None) -> None:
        if template_dir is None:
            template_dir = Path(__file__).parent.parent / constants.DEFAULT_TEMPLATE_DIR

        self.template_dir = Path(template_dir)
        self.env = self._create_environment()

    def _create_environment(self) -> Environment:
        env = Environment(
            loader=FileSystemLoader(str(self.template_dir)),
            autoescape=select_autoescape(["html", "xml"]),
            trim_blocks=constants.TEMPLATE_TRIM_BLOCKS,
            lstrip_blocks=constants.TEMPLATE_LSTRIP_BLOCKS,
        )
        env.filters.update(FILTERS)
        # Add codec processor functions as globals for template use
        env.globals['array_item_codec_expr'] = CodecProcessor.array_item_codec_expr
        return env

    def render(self, template_name: str, context: TemplateContext) -> str:
        template = self.env.get_template(template_name)
        return template.render(**context)

    def render_batch(self, template_map: dict[Path, tuple[str, TemplateContext]]) -> FileMap:
        return {path: self.render(template, context) for path, (template, context) in template_map.items()}


class SchemaProcessor:
    """Processes OpenAPI schemas and generates TypeScript models."""

    def __init__(self, renderer: TemplateRenderer) -> None:
        self.renderer = renderer
        self._wire_to_canonical: dict[str, str] = {}
        self._camel_to_wire: dict[str, str] = {}

    def generate_models(self, output_dir: Path, schemas: Schemas) -> FileMap:
        models_dir = output_dir / constants.DirectoryName.SRC / constants.DirectoryName.MODELS
        files: FileMap = {}

        # Filter out schemas that are just arrays of uint8 (these should be inlined)
        filtered_schemas = {
            name: schema
            for name, schema in schemas.items()
            if not is_array_of_uint8_schema(schema, schemas)
        }

        # First pass: Register all model kinds for the codec processor
        for name, schema in filtered_schemas.items():
            descriptor = self._build_model_descriptor(name, schema, schemas)
            model_name = ts_pascal_case(name)

            # Determine and register the model kind
            if descriptor.is_array:
                register_model_kind(model_name, "array")
            elif descriptor.is_object:
                register_model_kind(model_name, "object")
            else:
                register_model_kind(model_name, "primitive")

        # Second pass: Generate individual model files
        for name, schema in filtered_schemas.items():
            descriptor = self._build_model_descriptor(name, schema, schemas)
            context = self._create_model_context(name, schema, schemas, descriptor)
            content = self.renderer.render(constants.MODEL_TEMPLATE, context)
            file_name = f"{ts_kebab_case(name)}{constants.MODEL_FILE_EXTENSION}"
            files[models_dir / file_name] = content

        files[models_dir / constants.INDEX_FILE] = self.renderer.render(
            constants.MODELS_INDEX_TEMPLATE,
            {"schemas": filtered_schemas},
        )

        return files

    def _create_model_context(
        self, name: str, schema: Schema, all_schemas: Schemas, descriptor: ModelDescriptor
    ) -> TemplateContext:
        is_object = self._is_object_schema(schema)
        properties = self._extract_properties(schema) if is_object else []

        return {
            "schema_name": name,
            "schema": schema,
            "schemas": all_schemas,
            "is_object": is_object,
            "properties": properties,
            "has_additional_properties": schema.get(constants.SchemaKey.ADDITIONAL_PROPERTIES) is not None,
            "additional_properties_type": schema.get(constants.SchemaKey.ADDITIONAL_PROPERTIES),
            "descriptor": descriptor,
        }

    @staticmethod
    def _is_object_schema(schema: Schema) -> bool:
        is_type_object = schema.get(constants.SchemaKey.TYPE) == constants.TypeScriptType.OBJECT
        has_properties = constants.SchemaKey.PROPERTIES in schema
        has_composition = any(
            k in schema for k in [constants.SchemaKey.ALL_OF, constants.SchemaKey.ONE_OF, constants.SchemaKey.ANY_OF]
        )
        return (is_type_object or has_properties) and not has_composition

    def _extract_properties(self, schema: Schema) -> list[dict[str, Any]]:
        properties = []
        required_fields = set(schema.get(constants.SchemaKey.REQUIRED, []))

        for prop_name, prop_schema in (schema.get(constants.SchemaKey.PROPERTIES) or {}).items():
            self._register_rename(prop_name, prop_schema)
            properties.append(
                {
                    "name": prop_name,
                    "schema": prop_schema,
                    "is_required": prop_name in required_fields,
                }
            )

        return properties

    def _register_rename(self, wire_name: str, schema: Schema) -> None:
        rename_value = schema.get(constants.X_ALGOKIT_FIELD_RENAME)
        if not isinstance(rename_value, str) or not rename_value:
            return

        # Preserve first occurrence to avoid accidental overrides from conflicting specs
        self._wire_to_canonical.setdefault(wire_name, rename_value)
        self._camel_to_wire.setdefault(ts_camel_case(rename_value), wire_name)

    @property
    def rename_mappings(self) -> tuple[dict[str, str], dict[str, str]]:
        return self._wire_to_canonical, self._camel_to_wire

    def _build_model_descriptor(self, name: str, schema: Schema, all_schemas: Schemas) -> ModelDescriptor:
        """Build a per-model descriptor from OAS schema and vendor extensions."""
        model_name = ts_pascal_case(name)

        # Top-level array schema support
        if isinstance(schema, dict) and schema.get(constants.SchemaKey.TYPE) == "array":
            items = schema.get(constants.SchemaKey.ITEMS, {}) or {}
            ref_model = None
            if isinstance(items, dict) and "$ref" in items:
                ref = items["$ref"].split("/")[-1]
                ref_model = ts_pascal_case(ref)
            fmt = items.get(constants.SchemaKey.FORMAT)
            item_type = items.get(constants.SchemaKey.TYPE)
            algorand_format = items.get(constants.X_ALGORAND_FORMAT)
            is_bytes = fmt == "byte" or items.get(constants.X_ALGOKIT_BYTES_BASE64) is True
            is_bigint = bool(items.get(constants.X_ALGOKIT_BIGINT) is True)
            is_address = algorand_format == "Address"
            is_number = item_type in ("number", "integer") and not is_bigint
            is_boolean = item_type == "boolean"
            is_signed_txn = bool(items.get(constants.X_ALGOKIT_SIGNED_TXN) is True)
            return ModelDescriptor(
                model_name=model_name,
                fields=[],
                is_object=False,
                is_array=True,
                array_item_ref=ref_model,
                array_item_is_bytes=is_bytes,
                array_item_is_bigint=is_bigint,
                array_item_is_number=is_number,
                array_item_is_boolean=is_boolean,
                array_item_is_address=is_address,
                array_item_is_signed_txn=is_signed_txn,
            )

        # Object schema descriptor
        fields: list[FieldDescriptor] = []
        is_object = self._is_object_schema(schema)
        required_fields = set(schema.get(constants.SchemaKey.REQUIRED, []) or [])
        props = schema.get(constants.SchemaKey.PROPERTIES) or {}
        for prop_name, prop_schema in props.items():
            wire_name = prop_name
            canonical = prop_schema.get(constants.X_ALGOKIT_FIELD_RENAME) or prop_name
            name_camel = ts_camel_case(canonical)

            # Resolve $ref and check if it's an array of uint8 that should be inlined
            resolved_schema = prop_schema
            if "$ref" in prop_schema:
                ref_name = prop_schema["$ref"].split("/")[-1]
                if ref_name in all_schemas:
                    ref_schema = all_schemas[ref_name]
                    # If the referenced schema is an array of uint8, inline it
                    if is_array_of_uint8_schema(ref_schema, all_schemas):
                        resolved_schema = {"type": "string", "format": "byte"}

            ts_t = ts_type(resolved_schema, all_schemas)
            is_array = resolved_schema.get(constants.SchemaKey.TYPE) == "array"
            items = resolved_schema.get(constants.SchemaKey.ITEMS, {}) if is_array else None
            ref_model = None
            signed_txn = False
            bytes_flag = False
            bigint_flag = False
            number_flag = False
            boolean_flag = False
            address_flag = False
            inline_object_schema = None

            if is_array and isinstance(items, dict):
                if "$ref" in items:
                    ref_name = items["$ref"].split("/")[-1]
                    # Check if the referenced schema is an array of uint8
                    if ref_name in all_schemas and is_array_of_uint8_schema(all_schemas[ref_name], all_schemas):
                        # This is an array of Uint8Array (bytes), not a model reference
                        bytes_flag = True
                        ref_model = None
                    else:
                        ref_model = ts_pascal_case(ref_name)
                else:
                    fmt = items.get(constants.SchemaKey.FORMAT)
                    item_type = items.get(constants.SchemaKey.TYPE)
                    algorand_format = items.get(constants.X_ALGORAND_FORMAT)
                    bytes_flag = fmt == "byte" or items.get(constants.X_ALGOKIT_BYTES_BASE64) is True
                    bigint_flag = bool(items.get(constants.X_ALGOKIT_BIGINT) is True)
                    address_flag = algorand_format == "Address"
                    number_flag = item_type in ("number", "integer") and not bigint_flag
                    boolean_flag = item_type == "boolean"
                    signed_txn = bool(items.get(constants.X_ALGOKIT_SIGNED_TXN) is True)
            else:
                if "$ref" in resolved_schema and resolved_schema is prop_schema:
                    # Only set ref_model if we didn't inline the schema
                    ref_model = ts_pascal_case(resolved_schema["$ref"].split("/")[-1])
                # Check for special codec flags first
                elif bool(resolved_schema.get(constants.X_ALGOKIT_SIGNED_TXN) is True):
                    signed_txn = True
                # For inline nested objects, store the schema for inline metadata generation
                elif (resolved_schema.get(constants.SchemaKey.TYPE) == "object" and
                      "properties" in resolved_schema and
                      "$ref" not in resolved_schema and
                      resolved_schema.get(constants.X_ALGOKIT_SIGNED_TXN) is not True):
                    # Check if it's an empty object (no properties or empty properties dict)
                    props_inner = resolved_schema.get(constants.SchemaKey.PROPERTIES, {})
                    if not props_inner or (isinstance(props_inner, dict) and len(props_inner) == 0):
                        # Empty object - treat as Record<string, unknown>
                        # Don't set inline_object_schema, but mark as empty object
                        pass  # Will be handled by is_empty_object flag
                    else:
                        # Store the inline object schema for metadata generation
                        inline_object_schema = resolved_schema
                else:
                    fmt = resolved_schema.get(constants.SchemaKey.FORMAT)
                    prop_type = resolved_schema.get(constants.SchemaKey.TYPE)
                    algorand_format = resolved_schema.get(constants.X_ALGORAND_FORMAT)
                    bytes_flag = fmt == "byte" or resolved_schema.get(constants.X_ALGOKIT_BYTES_BASE64) is True
                    bigint_flag = bool(resolved_schema.get(constants.X_ALGOKIT_BIGINT) is True)
                    address_flag = algorand_format == "Address"
                    number_flag = prop_type in ("number", "integer") and not bigint_flag
                    boolean_flag = prop_type == "boolean"
                    signed_txn = bool(resolved_schema.get(constants.X_ALGOKIT_SIGNED_TXN) is True)

            is_optional = prop_name not in required_fields
            # Nullable per OpenAPI
            is_nullable = bool(resolved_schema.get(constants.SchemaKey.NULLABLE) is True)

            # Check if this is an empty object type (no properties and no special x-algokit-* or x-algorand-* attributes)
            has_special_attributes = any(
                key.startswith("x-algokit-") or key.startswith("x-algorand-")
                for key in resolved_schema.keys()
            )
            is_empty_object = (
                resolved_schema.get(constants.SchemaKey.TYPE) == "object" and
                "properties" in resolved_schema and
                not resolved_schema.get(constants.SchemaKey.PROPERTIES, {}) and
                not has_special_attributes
            )

            # Generate inline metadata name for nested objects
            inline_meta_name = None
            if inline_object_schema:
                inline_meta_name = f"{model_name}{ts_pascal_case(canonical)}Meta"

            fields.append(
                FieldDescriptor(
                    name=name_camel,
                    wire_name=wire_name,
                    ts_type=ts_t,
                    is_array=is_array,
                    ref_model=ref_model,
                    is_bytes=bytes_flag,
                    is_bigint=bigint_flag,
                    is_number=number_flag,
                    is_boolean=boolean_flag,
                    is_address=address_flag,
                    is_signed_txn=signed_txn,
                    is_optional=is_optional,
                    is_nullable=is_nullable,
                    inline_object_schema=inline_object_schema,
                    inline_meta_name=inline_meta_name,
                    is_empty_object=is_empty_object,
                )
            )

        return ModelDescriptor(model_name=model_name, fields=fields, is_object=is_object)

    def _extract_types_from_schema(self, schema: Schema, all_schemas: Schemas) -> set[str]:
        """Extract all type names referenced in a schema."""
        referenced_types = set()

        # Handle $ref directly
        if isinstance(schema, dict) and "$ref" in schema:
            ref = schema["$ref"].split("/")[-1]
            referenced_types.add(ts_pascal_case(ref))

        # Handle arrays
        if isinstance(schema, dict) and schema.get("type") == "array":
            items = schema.get("items", {})
            if isinstance(items, dict):
                referenced_types.update(self._extract_types_from_schema(items, all_schemas))

        # Handle object properties
        if isinstance(schema, dict) and "properties" in schema:
            for prop_schema in schema["properties"].values():
                if isinstance(prop_schema, dict):
                    referenced_types.update(self._extract_types_from_schema(prop_schema, all_schemas))

        # Handle allOf, oneOf, anyOf
        for key in ["allOf", "oneOf", "anyOf"]:
            if isinstance(schema, dict) and key in schema:
                items = schema[key]
                if isinstance(items, list):
                    for item in items:
                        if isinstance(item, dict):
                            referenced_types.update(self._extract_types_from_schema(item, all_schemas))

        # Convert to TypeScript type and extract model names using the same logic as in operations
        if isinstance(schema, dict):
            ts_type_str = ts_type(schema, all_schemas)
            tokens = set(_TYPE_TOKEN_RE.findall(ts_type_str))
            model_names = {ts_pascal_case(name) for name in all_schemas.keys()}
            referenced_types.update(tok for tok in tokens if tok in model_names)

        return referenced_types

    def collect_transitive_dependencies(self, used_types: set[str], all_schemas: Schemas) -> set[str]:
        """Collect all types transitively referenced by the given used_types."""
        all_used_types = set(used_types)
        to_process = set(used_types)

        while to_process:
            current_type = to_process.pop()

            # Convert from TypeScript type name back to schema name
            schema_name = None
            for name in all_schemas.keys():
                if ts_pascal_case(name) == current_type:
                    schema_name = name
                    break

            if schema_name and schema_name in all_schemas:
                schema = all_schemas[schema_name]
                referenced_types = self._extract_types_from_schema(schema, all_schemas)

                # Add any new types to the processing queue
                for ref_type in referenced_types:
                    if ref_type not in all_used_types:
                        all_used_types.add(ref_type)
                        to_process.add(ref_type)

        return all_used_types




class OperationProcessor:
    """Processes OpenAPI operations and generates API services."""

    def __init__(self, renderer: TemplateRenderer) -> None:
        self.renderer = renderer
        self._model_names: set[str] = set()
        self._synthetic_models: dict[str, Schema] = {}

    def process_spec(self, spec: Schema) -> tuple[dict[str, list[OperationContext]], set[str], dict[str, Schema]]:
        """Process entire OpenAPI spec and return operations by tag."""
        self._initialize_model_names(spec)

        operations_by_tag: dict[str, list[OperationContext]] = {}
        tags: set[str] = set()

        paths = spec.get(constants.SchemaKey.PATHS, {})
        for path, path_item in paths.items():
            if not isinstance(path_item, dict):
                continue

            operations = self._process_path_operations(path, path_item, spec)
            for op in operations:
                for tag in op.tags:
                    tags.add(tag)
                    operations_by_tag.setdefault(tag, []).append(op)

        # Sort operations by ID for stability
        for ops in operations_by_tag.values():
            ops.sort(key=lambda o: o.operation_id)

        return operations_by_tag, tags, self._synthetic_models

    def generate_service(
        self,
        output_dir: Path,
        operations_by_tag: dict[str, list[OperationContext]],
        tags: set[str],
        service_class_name: str,
    ) -> tuple[FileMap, set[str]]:
        """Generate API service files."""
        apis_dir = output_dir / constants.DirectoryName.SRC / constants.DirectoryName.APIS
        files: FileMap = {}

        # Collect unique operations
        all_operations = self._collect_unique_operations(operations_by_tag, tags)

        # Get private method configurations for this service
        private_methods = self._get_private_methods(service_class_name)

        # Mark operations as private or skipped, where required
        for operation in all_operations:
            if operation.operation_id in private_methods:
                operation.is_private = True

        # Filter out operations marked for skipping
        all_operations = [op for op in all_operations if not op.skip_generation]

        # Convert to template context
        operations_context = [op.to_dict() for op in all_operations]
        import_types = set().union(*(op.import_types for op in all_operations))

        # Get custom imports and methods for this service
        custom_imports, custom_methods = self._get_custom_service_extensions(service_class_name)

        # Add custom model imports for AlgodApi
        if service_class_name == "AlgodApi":
            import_types.add("SuggestedParams")

        # Generate service file
        files[apis_dir / constants.API_SERVICE_FILE] = self.renderer.render(
            constants.API_SERVICE_TEMPLATE,
            {
                "tag_name": constants.DEFAULT_API_TAG,
                "operations": operations_context,
                "import_types": sorted(import_types),
                "service_class_name": service_class_name,
                "custom_imports": custom_imports,
                "custom_methods": custom_methods,
            },
        )

        # Generate barrel export
        files[apis_dir / constants.INDEX_FILE] = self.renderer.render(
            constants.APIS_INDEX_TEMPLATE, {"service_class_name": service_class_name}
        )

        return files, import_types

    def _get_custom_service_extensions(self, service_class_name: str) -> tuple[list[str], list[str]]:
        """Get custom imports and methods for specific service classes."""
        custom_imports: list[str] = []
        custom_methods: list[str] = []

        if service_class_name == "AlgodApi":
            custom_imports = [
                "import { concatArrays } from '@algorandfoundation/algokit-common';",
                "import { decodeSignedTransaction } from '@algorandfoundation/algokit-transact';",
            ]
            send_raw_transaction_method = '''/**
   * Send a signed transaction or array of signed transactions to the network.
   */
  async sendRawTransaction(stxOrStxs: Uint8Array | Uint8Array[]): Promise<PostTransactionsResponse> {
    let rawTransactions = stxOrStxs;
    if (Array.isArray(stxOrStxs)) {
      if (!stxOrStxs.every((a) => a instanceof Uint8Array)) {
        throw new Error('Array elements must be byte arrays');
      }
      rawTransactions = concatArrays(...stxOrStxs);
    } else if (!(rawTransactions instanceof Uint8Array)) {
      throw new Error('Argument must be byte array');
    }
    return this._rawTransaction(rawTransactions);
  }'''
            create_wallet = '''/**
   * Given an application ID and box name, it returns the round, box name, and value.
   */
  async getApplicationBoxByName(applicationId: number | bigint, boxName: Uint8Array): Promise<Box> {
    const name = `b64:${Buffer.from(boxName).toString('base64')}`;
    return this._getApplicationBoxByName(applicationId, { name });
  }
'''
            suggested_params_method = '''/**
   * Returns the common needed parameters for a new transaction.
   */
  async suggestedParams(): Promise<SuggestedParams> {
    const txnParams = await this._transactionParams();

    return {
      flatFee: false,
      fee: txnParams.fee,
      firstValid: txnParams.lastRound,
      lastValid: txnParams.lastRound + 1000n,
      genesisHash: txnParams.genesisHash,
      genesisId: txnParams.genesisId,
      minFee: txnParams.minFee,
      consensusVersion: txnParams.consensusVersion,
    };
  }'''
            get_transaction_params_method = '''/**
   * Returns the common needed parameters for a new transaction.
   */
  async getTransactionParams(): Promise<SuggestedParams> {
    return await this.suggestedParams();
  }'''
            simulate_raw_transactions_method = '''/**
   * Simulate an encoded signed transaction or array of encoded signed transactions.
   */
  async simulateRawTransactions(stxOrStxs: Uint8Array | Uint8Array[]): Promise<SimulateResponse> {
    const txns = Array.isArray(stxOrStxs) ? stxOrStxs.map((stxn) => decodeSignedTransaction(stxn)) : [decodeSignedTransaction(stxOrStxs)];
    return this.simulateTransactions({
      txnGroups: [
        {
          txns,
        },
      ],
    });
  }'''

            custom_methods = [send_raw_transaction_method, create_wallet, suggested_params_method, get_transaction_params_method, simulate_raw_transactions_method]

        if service_class_name == "IndexerApi":
            create_wallet = '''/**
   * Given an application ID and box name, it returns the round, box name, and value.
   */
  async lookupApplicationBoxByIdAndName(applicationId: number | bigint, boxName: Uint8Array): Promise<Box> {
    const name = `b64:${Buffer.from(boxName).toString('base64')}`;
    return this._lookupApplicationBoxByIdAndName(applicationId, { name });
  }
'''

            custom_methods = [create_wallet]

        if service_class_name == "KmdApi":
            create_wallet = '''/**
   * Create a new wallet (collection of keys) with the given parameters.
   */
  async createWallet(body: CreateWalletRequest): Promise<CreateWalletResponse> {
    const requestBody = {
      ...body,
      walletDriverName: body.walletDriverName ?? 'sqlite',
    }
    return await this._createWallet(requestBody)
  }
'''

            custom_methods = [create_wallet]

        return custom_imports, custom_methods

    def _get_private_methods(self, service_class_name: str) -> set[str]:
        """Get set of operation IDs that should be marked as private for specific service classes."""
        # Default configuration for private methods by service class
        private_method_config = {
            "AlgodApi": {
                "RawTransaction",  # Wrapped by custom method
                "GetApplicationBoxByName", # Wrapped by custom method
                "TransactionParams" # Wrapped by custom method
            },
            "IndexerApi": {
                "lookupApplicationBoxByIDAndName" # Wrapped by custom method
            },
            "KmdApi": {
                'CreateWallet'  # Wrapped by custom method
            },
        }

        return private_method_config.get(service_class_name, set())

    def _initialize_model_names(self, spec: Schema) -> None:
        """Initialize set of model names from spec."""

        components = spec.get(constants.SchemaKey.COMPONENTS, {})
        schemas = components.get(constants.SchemaKey.COMPONENTS_SCHEMAS, {})
        self._model_names = {ts_pascal_case(name) for name in schemas}

    def _process_path_operations(self, path: str, path_item: Schema, spec: Schema) -> list[OperationContext]:
        """Process all operations for a given path."""

        operations = []
        path_params = path_item.get(constants.OperationKey.PARAMETERS, [])

        for method, operation in path_item.items():
            if method.lower() not in constants.HTTP_METHODS or not isinstance(operation, dict):
                continue

            # Generate operation ID if missing
            operation_id = operation.get(constants.OperationKey.OPERATION_ID) or ts_camel_case(
                f"{method.lower()}_{path}"
            )

            op_input = OperationInput(
                operation_id=operation_id,
                method=method.upper(),
                path=path,
                operation=operation,
                path_params=path_params,
                spec=spec,
            )

            # Process operation
            context = self._create_operation_context(op_input)

            context.tags = operation.get(constants.OperationKey.TAGS, [constants.DEFAULT_TAG])

            # Skip generation for operations tagged with "private" or "experimental"
            # or with specific operation IDs
            if (any(tag in context.tags for tag in ("private", "experimental")) or
                context.operation_id in ("Metrics", "SwaggerJSON", "GetBlockLogs", "SwaggerHandler")):
                context.skip_generation = True

            operations.append(context)

        return operations

    def _create_operation_context(self, op_input: OperationInput) -> OperationContext:
        """Create complete operation context."""
        # Merge path and operation parameters
        all_params = [*op_input.path_params, *op_input.operation.get(constants.OperationKey.PARAMETERS, [])]

        # Process components
        parameters = self._process_parameters(all_params, op_input.spec)
        request_body = self._process_request_body(
            op_input.operation.get(constants.OperationKey.REQUEST_BODY), op_input.spec
        )
        response_type, returns_msgpack = self._process_responses(
            op_input.operation.get(constants.OperationKey.RESPONSES, {}), op_input.operation_id, op_input.spec
        )

        # Build context
        context = OperationContext(
            operation_id=op_input.operation_id,
            method=op_input.method,
            path=op_input.path,
            description=op_input.operation.get(constants.OperationKey.DESCRIPTION),
            parameters=parameters,
            request_body=request_body,
            response_type=response_type,
            import_types=set(),
            tags=[],
            returns_msgpack=returns_msgpack,
        )

        # Compute additional properties
        self._compute_force_msgpack_query(context, op_input.operation, op_input.spec)
        self._compute_import_types(context)

        return context

    def _process_parameters(self, params: list[Schema], spec: Schema) -> list[Parameter]:
        """Process operation parameters."""

        parameters = []
        used_names: set[str] = set()
        schemas = self._get_schemas(spec)

        for param_def in params:
            # Resolve $ref if present
            param = self._resolve_ref(param_def, spec) if "$ref" in param_def else param_def

            # Extract parameter details
            raw_name = str(param.get("name"))
            # Check for custom parameter rename via x-algokit-field-rename
            canonical_param_name = param.get(constants.X_ALGOKIT_FIELD_RENAME) or raw_name
            # Always skip `format` query param - we default to JSON and don't expose format selection
            location_candidate = param.get(constants.OperationKey.IN, constants.ParamLocation.QUERY)
            if location_candidate == constants.ParamLocation.QUERY and raw_name == constants.FORMAT_PARAM_NAME:
                # Skip format parameter entirely - always default to JSON
                continue
            var_name = self._sanitize_variable_name(ts_camel_case(canonical_param_name), used_names)
            used_names.add(var_name)

            schema = param.get("schema", {})
            ts_type_str = ts_type(schema, schemas)

            # Allow both number and bigint inputs for ergonomics
            if ts_type_str == constants.TypeScriptType.BIGINT:
                ts_type_str = constants.TypeScriptType.NUMBER_OR_BIGINT

            # Allow both string and Address inputs for ergonomics
            if constants.TypeScriptType.ADDRESS in ts_type_str:
                ts_type_str = ts_type_str.replace(constants.TypeScriptType.ADDRESS, "ReadableAddress")

            location = location_candidate
            required = param.get(constants.SchemaKey.REQUIRED, False) or location == constants.ParamLocation.PATH

            parameters.append(
                Parameter(
                    name=raw_name,
                    var_name=var_name,
                    location=location,
                    required=required,
                    ts_type=ts_type_str,
                    description=param.get(constants.OperationKey.DESCRIPTION),
                )
            )

        return parameters

    def _process_request_body(self, request_body: Schema | None, spec: Schema) -> RequestBody | None:
        """Process request body specification."""

        if not isinstance(request_body, dict):
            return None

        content = request_body.get("content", {})
        schemas = self._get_schemas(spec)

        # Check content type support
        supports_msgpack = constants.MediaType.MSGPACK in content
        supports_json = constants.MediaType.JSON in content
        required = request_body.get(constants.SchemaKey.REQUIRED, False)

        # Determine media type and TypeScript type
        if supports_json or supports_msgpack:
            media_type = (
                constants.MediaType.MSGPACK if supports_msgpack and not supports_json else constants.MediaType.JSON
            )
            schema = content.get(media_type, {}).get("schema", {})
            ts_type_str = ts_type(schema, schemas)
        elif constants.MediaType.TEXT in content:
            media_type = constants.MediaType.TEXT
            schema = content[constants.MediaType.TEXT].get("schema", {})
            ts_type_str = ts_type(schema, schemas)
            supports_msgpack = supports_json = False
        elif constants.MediaType.BINARY in content or constants.MediaType.OCTET_STREAM in content:
            media_type = (
                constants.MediaType.BINARY
                if constants.MediaType.BINARY in content
                else constants.MediaType.OCTET_STREAM
            )
            ts_type_str = constants.TypeScriptType.UINT8ARRAY
            supports_msgpack = supports_json = False
        else:
            return None

        return RequestBody(
            media_type=media_type,
            ts_type=ts_type_str,
            required=required,
            supports_msgpack=supports_msgpack,
            supports_json=supports_json,
        )

    def _process_responses(self, responses: Schema, operation_id: str, spec: Schema) -> tuple[str, bool]:
        """Process response specifications."""

        return_types: list[str] = []
        returns_msgpack = False
        schemas = self._get_schemas(spec)

        for status, response in responses.items():
            if not str(status).startswith(constants.SUCCESS_STATUS_PREFIX):
                continue

            content = (response or {}).get("content", {})
            if constants.MediaType.MSGPACK in content:
                returns_msgpack = True

            for _, media_details in content.items():
                schema = (media_details or {}).get("schema")
                if not schema:
                    continue

                type_name = self._resolve_response_type(schema, operation_id, schemas)
                if type_name:
                    return_types.append(type_name)

        # Determine final response type
        if return_types:
            response_type = " | ".join(dict.fromkeys(return_types))
        elif returns_msgpack:
            response_type = constants.TypeScriptType.UINT8ARRAY
        else:
            response_type = constants.TypeScriptType.VOID

        return response_type, returns_msgpack

    def _compute_force_msgpack_query(self, context: OperationContext, raw_operation: Schema, spec: Schema) -> None:
        """Detect if the raw spec constrains query format to only 'msgpack' and mark for implicit query injection."""
        params = raw_operation.get(constants.OperationKey.PARAMETERS, []) or []
        for param_def in params:
            param = (
                self._resolve_ref(param_def, spec) if isinstance(param_def, dict) and "$ref" in param_def else param_def
            )
            if not isinstance(param, dict):
                continue
            name = param.get("name")
            location = param.get(constants.OperationKey.IN, constants.ParamLocation.QUERY)
            if location == constants.ParamLocation.QUERY and name == constants.FORMAT_PARAM_NAME:
                schema_obj = param.get("schema", {}) or {}
                enum_vals = schema_obj.get(constants.SchemaKey.ENUM)
                if isinstance(enum_vals, list) and len(enum_vals) == 1 and enum_vals[0] == "msgpack":
                    context.force_msgpack_query = True
                    return

    def _compute_import_types(self, context: OperationContext) -> None:
        """Collect model types that need importing."""
        builtin_types = constants.TS_BUILTIN_TYPES

        def extract_types(type_str: str) -> set[str]:
            if not type_str:
                return set()
            tokens = set(_TYPE_TOKEN_RE.findall(type_str))
            types: set[str] = {tok for tok in tokens if tok in self._model_names and tok not in builtin_types}
            # Include synthetic models that aren't part of _model_names
            return types

        # Collect from all type references
        context.import_types = extract_types(context.response_type)

        # Only include request body types if the method actually uses a body
        if context.request_body and context.method.upper() not in ["GET", "HEAD"]:
            context.import_types |= extract_types(context.request_body.ts_type)

        for param in context.parameters:
            context.import_types |= extract_types(param.ts_type)

    def _collect_unique_operations(
        self, operations_by_tag: dict[str, list[OperationContext]], tags: set[str]
    ) -> list[OperationContext]:
        """Collect unique operations across all tags."""
        seen_keys: set[tuple[str, str]] = set()
        unique_operations = []

        for tag in sorted(tags):
            for op in operations_by_tag.get(tag, []):
                key = (op.method, op.path)
                if key not in seen_keys:
                    seen_keys.add(key)
                    unique_operations.append(op)

        return sorted(unique_operations, key=lambda o: o.operation_id)

    @staticmethod
    def _should_synthesize_model(schema: Schema) -> bool:
        """Check if schema should become a synthetic model."""
        return (
            isinstance(schema, dict)
            and "$ref" not in schema
            and (schema.get("type") == "object" or "properties" in schema or "additionalProperties" in schema)
        )

    def _resolve_response_type(self, schema: Schema, operation_id: str, schemas: Schema) -> str:
        """Ensure response schemas are represented by concrete TypeScript types."""
        if "$ref" in schema:
            return ts_type(schema, schemas)

        if self._should_synthesize_model(schema):
            base_name = ts_pascal_case(operation_id)
            if base_name in self._model_names and base_name not in self._synthetic_models:
                return base_name
            if base_name in self._synthetic_models:
                return base_name
            model_name = self._allocate_synthetic_model_name(operation_id)
            if model_name not in self._synthetic_models:
                self._synthetic_models[model_name] = schema
                self._model_names.add(model_name)
            return model_name

        return ts_type(schema, schemas)

    def _allocate_synthetic_model_name(self, operation_id: str) -> str:
        """Generate a unique model name for an inline response schema."""

        base_name = ts_pascal_case(operation_id)
        candidate = base_name

        if candidate in self._model_names or candidate in self._synthetic_models:
            candidate = f"{candidate}Response"

        counter = 2
        while candidate in self._model_names or candidate in self._synthetic_models:
            candidate = f"{base_name}Response{counter}"
            counter += 1

        return candidate

    @staticmethod
    def _sanitize_variable_name(base_name: str, used_names: set[str]) -> str:
        """Ensure variable name is valid and unique."""
        # Handle reserved words
        if base_name in constants.TS_RESERVED_WORDS:
            base_name = f"{base_name}_"

        # Ensure uniqueness
        if base_name not in used_names:
            return base_name

        counter = 2
        while f"{base_name}{counter}" in used_names:
            counter += 1
        return f"{base_name}{counter}"

    @staticmethod
    def _resolve_ref(ref_obj: Schema, spec: Schema) -> Schema:
        """Resolve a $ref pointer in the spec."""
        ref = ref_obj.get("$ref", "")
        parts = ref.split("/")[1:]  # Skip leading #

        node = spec
        for part in parts:
            node = node.get(part, {})
        return node

    @staticmethod
    def _get_schemas(spec: Schema) -> Schema:
        """Extract schemas from spec components."""
        components = spec.get(constants.SchemaKey.COMPONENTS, {})
        return components.get(constants.SchemaKey.COMPONENTS_SCHEMAS, {})


class CodeGenerator:
    """Main code generator orchestrating the generation process."""

    def __init__(self, template_dir: Path | None = None) -> None:
        self.renderer = TemplateRenderer(template_dir)
        self.schema_processor = SchemaProcessor(self.renderer)
        self.operation_processor = OperationProcessor(self.renderer)

    def generate(
        self,
        spec_path: Path,
        output_dir: Path,
        package_name: str,
        *,
        custom_description: str | None = None,
    ) -> FileMap:
        """Generate complete TypeScript client from OpenAPI spec."""
        # Parse specification
        parser = OASParser()
        parser.parse_file(spec_path)
        spec = parser.spec_data or {}

        # Extract class names
        client_class, service_class = self._extract_class_names(package_name)

        # Generate base runtime
        files = self._generate_runtime(output_dir, package_name, client_class, service_class, custom_description)

        # Process operations and schemas
        ops_by_tag, tags, synthetic_models = self.operation_processor.process_spec(spec)

        # Generate service first to get the used types
        service_files, used_types = self.operation_processor.generate_service(output_dir, ops_by_tag, tags, service_class)
        files.update(service_files)

        # Merge schemas
        components = spec.get(constants.SchemaKey.COMPONENTS, {})
        base_schemas = components.get(constants.SchemaKey.COMPONENTS_SCHEMAS, {})
        all_schemas = {**base_schemas, **synthetic_models}

        # Collect all transitive dependencies of used types
        all_used_types = self.schema_processor.collect_transitive_dependencies(used_types, all_schemas)

        # Filter schemas to only include those used by non-skipped operations
        used_schemas = {name: schema for name, schema in all_schemas.items()
                       if ts_pascal_case(name) in all_used_types}


        # Generate components (only used schemas)
        files.update(self.schema_processor.generate_models(output_dir, used_schemas))

        if service_class == "AlgodApi":
            models_dir = output_dir / constants.DirectoryName.SRC / constants.DirectoryName.MODELS

            # Generate the custom typed models
            files[models_dir / "suggested-params.ts"] = self.renderer.render(
                "models/custom/suggested-params.ts.j2",
                {"spec": spec},
            )
            files[models_dir / "block.ts"] = self.renderer.render(
                "models/custom/block.ts.j2",
                {"spec": spec},
            )
            files[models_dir / "block-response.ts"] = self.renderer.render(
                "models/custom/block-response.ts.j2",
                {"spec": spec},
            )
            files[models_dir / "ledger-state-delta.ts"] = self.renderer.render(
                "models/custom/ledger-state-delta.ts.j2",
                {"spec": spec},
            )

            # Ensure index exports include the custom models
            index_path = models_dir / constants.INDEX_FILE
            base_index = self.renderer.render(constants.MODELS_INDEX_TEMPLATE, {"schemas": used_schemas})
            extras = (
                "\n"
                "export type { SuggestedParams, SuggestedParamsMeta } from './suggested-params';\n"
                "export type { Block } from './block';\n"
                "export { BlockMeta } from './block';\n"
            )
            files[index_path] = base_index + extras
        files.update(self._generate_client_files(output_dir, client_class, service_class))

        return files

    def _generate_runtime(
        self,
        output_dir: Path,
        package_name: str,
        client_class: str,
        service_class: str,
        custom_description: str | None,
    ) -> FileMap:
        """Generate runtime support files."""
        src_dir = output_dir / constants.DirectoryName.SRC
        core_dir = src_dir / constants.DirectoryName.CORE

        context = {
            "package_name": package_name,
            "custom_description": custom_description,
            "client_class_name": client_class,
            "service_class_name": service_class,
        }

        template_map = {
            # Core runtime
            core_dir / "client-config.ts": ("base/src/core/client-config.ts.j2", context),
            core_dir / "base-http-request.ts": ("base/src/core/base-http-request.ts.j2", context),
            core_dir / "fetch-http-request.ts": ("base/src/core/fetch-http-request.ts.j2", context),
            core_dir / "api-error.ts": ("base/src/core/api-error.ts.j2", context),
            core_dir / "request.ts": ("base/src/core/request.ts.j2", context),
            core_dir / "model-runtime.ts": ("base/src/core/model-runtime.ts.j2", context),
            # Project files
            src_dir / "index.ts": ("base/src/index.ts.j2", context),
        }

        return self.renderer.render_batch(template_map)

    def _generate_client_files(self, output_dir: Path, client_class: str, service_class: str) -> FileMap:
        """Generate client wrapper files."""
        src_dir = output_dir / constants.DirectoryName.SRC

        template_map = {
            src_dir / "client.ts": (
                "client.ts.j2",
                {
                    "service_class_name": service_class,
                    "client_class_name": client_class,
                },
            ),
        }

        return self.renderer.render_batch(template_map)

    # Centralized transformers/maps removed; per-model codecs handle all transforms.

    @staticmethod
    def _extract_class_names(package_name: str) -> tuple[str, str]:
        """Extract client and service class names from package name."""

        base_name = ts_pascal_case(package_name)
        base_core = base_name[:-6] if base_name.lower().endswith("client") else base_name
        return f"{base_core}Client", f"{base_core}Api"
