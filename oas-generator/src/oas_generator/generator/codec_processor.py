"""Codec expression generator for the codec-based metadata system.

This module generates TypeScript codec expressions from OpenAPI schema information.
It maps field descriptors to codec singleton references or codec constructors.
"""

from __future__ import annotations

from typing import Literal

from oas_generator.generator.models import FieldDescriptor

ModelKind = Literal["object", "array", "primitive"]

_MODEL_KIND_REGISTRY: dict[str, ModelKind] = {}


def register_model_kind(model_name: str, kind: ModelKind) -> None:
    """Register a model's metadata kind.

    Args:
        model_name: Name of the model
        kind: The kind of model metadata (object/array/primitive)
    """
    _MODEL_KIND_REGISTRY[model_name] = kind


def get_model_kind(model_name: str) -> ModelKind | None:
    """Get the registered kind for a model.

    Args:
        model_name: Name of the model

    Returns:
        The model's kind, or None if not registered
    """
    return _MODEL_KIND_REGISTRY.get(model_name)


class CodecProcessor:
    """Generates TypeScript codec expressions from field descriptors."""

    @staticmethod
    def field_codec_expr(field: FieldDescriptor, model_name: str) -> str:
        """Generate codec expression for a field.

        Args:
            field: Field descriptor containing type information
            model_name: Name of the parent model (for self-referential types)

        Returns:
            TypeScript codec expression (e.g., "stringCodec", "bytesArrayCodec")
        """
        # Handle empty object types (object with no properties)
        if field.is_empty_object:
            return "new RecordCodec(unknownCodec)"

        if field.is_array:
            array_codec = CodecProcessor._get_array_codec_singleton(
                ref_model=field.ref_model,
                is_signed_txn=field.is_signed_txn,
                is_box_reference=field.is_box_reference,
                is_holding_reference=field.is_holding_reference,
                is_locals_reference=field.is_locals_reference,
                is_bytes=field.is_bytes,
                is_bytes_b64=field.is_bytes_b64,
                is_bigint=field.is_bigint,
                is_number=field.is_number,
                is_boolean=field.is_boolean,
                is_address=field.is_address,
                byte_length=field.byte_length,
            )
            if array_codec:
                return array_codec

            # Fallback for model references that don't have singletons
            item_codec = CodecProcessor._base_codec_expr(
                ref_model=field.ref_model,
                is_signed_txn=field.is_signed_txn,
                is_box_reference=field.is_box_reference,
                is_holding_reference=field.is_holding_reference,
                is_locals_reference=field.is_locals_reference,
                is_bytes=field.is_bytes,
                is_bytes_b64=field.is_bytes_b64,
                is_bigint=field.is_bigint,
                is_number=field.is_number,
                is_boolean=field.is_boolean,
                is_address=field.is_address,
                model_name=model_name,
                inline_meta_name=None,
                ts_type=field.ts_type,
                byte_length=field.byte_length,
            )
            return f"new ArrayCodec({item_codec})"

        return CodecProcessor._base_codec_expr(
            ref_model=field.ref_model,
            is_signed_txn=field.is_signed_txn,
            is_box_reference=field.is_box_reference,
            is_holding_reference=field.is_holding_reference,
            is_locals_reference=field.is_locals_reference,
            is_bytes=field.is_bytes,
            is_bytes_b64=field.is_bytes_b64,
            is_bigint=field.is_bigint,
            is_number=field.is_number,
            is_boolean=field.is_boolean,
            is_address=field.is_address,
            model_name=model_name,
            inline_meta_name=field.inline_meta_name,
            ts_type=field.ts_type,
            byte_length=field.byte_length,
        )

    @staticmethod
    def _base_codec_expr(
        ref_model: str | None,
        is_signed_txn: bool,
        is_box_reference: bool,
        is_holding_reference: bool,
        is_locals_reference: bool,
        is_bytes: bool,
        is_bytes_b64: bool,
        is_bigint: bool,
        is_number: bool,
        is_boolean: bool,
        is_address: bool,
        model_name: str,
        inline_meta_name: str | None,
        ts_type: str = "",
        byte_length: int | None = None,
    ) -> str:
        """Generate base codec expression (without array wrapping).

        Args:
            ref_model: Referenced model name (for model references)
            is_signed_txn: Whether this is a SignedTransaction
            is_box_reference: Whether this is a BoxReference
            is_holding_reference: Whether this is a HoldingReference
            is_locals_reference: Whether this is a LocalsReference
            is_bytes: Whether this is a byte array (Uint8Array)
            is_bytes_b64: Whether this is explicitly a base64-encoded bytes field (x-algokit-bytes-base64)
            is_bigint: Whether this is a bigint
            is_number: Whether this is a number
            is_boolean: Whether this is a boolean
            is_address: Whether this is an address
            model_name: Name of the parent model (for self-referential types)
            inline_meta_name: Name of inline object metadata if applicable
            ts_type: TypeScript type string for fallback inference
            byte_length: Fixed byte length if specified via x-algokit-byte-length

        Returns:
            Codec expression string
        """
        # SignedTransaction uses metadata-based codec
        if is_signed_txn:
            return "new ObjectModelCodec(SignedTransactionMeta)"

        # BoxReference, HoldingReference, LocalsReference use metadata-based codec
        if is_box_reference:
            return "new ObjectModelCodec(BoxReferenceMeta)"
        if is_holding_reference:
            return "new ObjectModelCodec(HoldingReferenceMeta)"
        if is_locals_reference:
            return "new ObjectModelCodec(LocalsReferenceMeta)"

        # Model references
        if ref_model:
            # Determine the specific codec type based on the model's registered kind
            model_kind = get_model_kind(ref_model)

            if model_kind == "object":
                codec_class = "ObjectModelCodec"
            elif model_kind == "array":
                codec_class = "ArrayModelCodec"
            elif model_kind == "primitive":
                codec_class = "PrimitiveModelCodec"
            else:
                # Fallback to generic ModelCodec if kind is unknown
                codec_class = "ModelCodec"

            # Self-referential types need lazy evaluation
            if ref_model == model_name:
                return f"new {codec_class}(() => {ref_model}Meta)"
            return f"new {codec_class}({ref_model}Meta)"

        # Inline object schemas - these are always objects
        if inline_meta_name:
            return f"new ObjectModelCodec({inline_meta_name})"

        # Fixed-length bytes - use predefined singletons or create new codec
        if is_bytes and byte_length is not None:
            return CodecProcessor._get_fixed_bytes_codec(byte_length)

        # Base64-encoded bytes (x-algokit-bytes-base64) use bytesBase64Codec
        if is_bytes_b64:
            return "bytesBase64Codec"
        if is_bytes:
            return "bytesCodec"
        if is_bigint:
            return "bigIntCodec"
        if is_address:
            return "addressCodec"
        if is_number:
            return "numberCodec"
        if is_boolean:
            return "booleanCodec"

        # Fallback to type inference from TypeScript type
        if ts_type:
            return CodecProcessor.infer_primitive_codec(ts_type)

        # Final fallback
        return "stringCodec"

    @staticmethod
    def _get_fixed_bytes_codec(length: int) -> str:
        """Get the codec expression for fixed-length bytes.

        Args:
            length: The fixed byte length

        Returns:
            Codec expression string (singleton name or new constructor)
        """
        # Use predefined singletons for common lengths
        if length == 32:
            return "fixedBytes32Codec"
        if length == 64:
            return "fixedBytes64Codec"
        if length == 1793:
            return "fixedBytes1793Codec"

        # For other lengths, create a new FixedBytesCodec instance
        return f"new FixedBytesCodec({length})"

    @staticmethod
    def infer_primitive_codec(ts_type: str) -> str:
        """Infer codec from TypeScript type string.

        This is used as a fallback when we don't have specific flags.

        Args:
            ts_type: TypeScript type string

        Returns:
            Codec expression
        """
        ts_type = ts_type.strip()

        # Check for exact matches first
        if ts_type == "string":
            return "stringCodec"
        if ts_type == "number":
            return "numberCodec"
        if ts_type == "bigint":
            return "bigIntCodec"
        if ts_type == "boolean":
            return "booleanCodec"
        if ts_type == "Uint8Array":
            return "bytesCodec"

        # Default to string for unknown types
        return "stringCodec"

    @staticmethod
    def array_item_codec_expr(
        array_item_ref: str | None,
        array_item_is_signed_txn: bool,
        array_item_is_bytes: bool,
        array_item_is_bytes_b64: bool,
        array_item_is_bigint: bool,
        array_item_is_number: bool,
        array_item_is_boolean: bool,
        array_item_is_address: bool,
        array_item_is_box_reference: bool = False,
        array_item_is_holding_reference: bool = False,
        array_item_is_locals_reference: bool = False,
        array_item_byte_length: int | None = None,
    ) -> str:
        """Generate codec expression for array items (used for top-level array schemas).

        Args:
            array_item_ref: Referenced model name
            array_item_is_signed_txn: Whether items are SignedTransactions
            array_item_is_bytes: Whether items are byte arrays
            array_item_is_bytes_b64: Whether items are base64-encoded bytes (x-algokit-bytes-base64)
            array_item_is_bigint: Whether items are bigints
            array_item_is_number: Whether items are numbers
            array_item_is_boolean: Whether items are booleans
            array_item_is_address: Whether items are addresses
            array_item_is_box_reference: Whether items are BoxReferences
            array_item_is_holding_reference: Whether items are HoldingReferences
            array_item_is_locals_reference: Whether items are LocalsReferences
            array_item_byte_length: Fixed byte length for array items

        Returns:
            Codec expression string (singleton array codec name or new ArrayCodec(...))
        """
        # Try to get singleton array codec first
        array_codec = CodecProcessor._get_array_codec_singleton(
            ref_model=array_item_ref,
            is_signed_txn=array_item_is_signed_txn,
            is_box_reference=array_item_is_box_reference,
            is_holding_reference=array_item_is_holding_reference,
            is_locals_reference=array_item_is_locals_reference,
            is_bytes=array_item_is_bytes,
            is_bytes_b64=array_item_is_bytes_b64,
            is_bigint=array_item_is_bigint,
            is_number=array_item_is_number,
            is_boolean=array_item_is_boolean,
            is_address=array_item_is_address,
            byte_length=array_item_byte_length,
        )
        if array_codec:
            return array_codec

        # Fallback for model references - wrap in new ArrayCodec(...)
        item_codec = CodecProcessor._base_codec_expr(
            ref_model=array_item_ref,
            is_signed_txn=array_item_is_signed_txn,
            is_box_reference=array_item_is_box_reference,
            is_holding_reference=array_item_is_holding_reference,
            is_locals_reference=array_item_is_locals_reference,
            is_bytes=array_item_is_bytes,
            is_bytes_b64=array_item_is_bytes_b64,
            is_bigint=array_item_is_bigint,
            is_number=array_item_is_number,
            is_boolean=array_item_is_boolean,
            is_address=array_item_is_address,
            model_name="",  # Top-level arrays don't have a parent model
            inline_meta_name=None,
            byte_length=array_item_byte_length,
        )
        return f"new ArrayCodec({item_codec})"

    @staticmethod
    def _get_array_codec_singleton(
        ref_model: str | None,
        is_signed_txn: bool,
        is_box_reference: bool,
        is_holding_reference: bool,
        is_locals_reference: bool,
        is_bytes: bool,
        is_bytes_b64: bool,
        is_bigint: bool,
        is_number: bool,
        is_boolean: bool,
        is_address: bool,
        byte_length: int | None = None,
    ) -> str | None:
        """Get singleton array codec name for primitive types.

        Args:
            ref_model: Referenced model name (returns None if set)
            is_signed_txn: Whether items are SignedTransactions
            is_box_reference: Whether items are BoxReferences
            is_holding_reference: Whether items are HoldingReferences
            is_locals_reference: Whether items are LocalsReferences
            is_bytes: Whether items are byte arrays
            is_bytes_b64: Whether items are base64-encoded bytes
            is_bigint: Whether items are bigints
            is_number: Whether items are numbers
            is_boolean: Whether items are booleans
            is_address: Whether items are addresses
            byte_length: Fixed byte length for items (no singleton available)

        Returns:
            Singleton array codec name or None if not a primitive array
        """
        # Model references, signed transactions, vendor extension types, and fixed-length bytes don't have singleton array codecs
        if ref_model or is_signed_txn or is_box_reference or is_holding_reference or is_locals_reference:
            return None

        # Fixed-length bytes and bytesB64 don't have predefined array singletons
        if is_bytes and byte_length is not None:
            return None
        if is_bytes_b64:
            return None

        # Return singleton array codec names
        if is_bytes:
            return "bytesArrayCodec"
        if is_bigint:
            return "bigIntArrayCodec"
        if is_address:
            return "addressArrayCodec"
        if is_number:
            return "numberArrayCodec"
        if is_boolean:
            return "booleanArrayCodec"

        # String is the default
        return "stringArrayCodec"


def get_codec_imports(has_arrays: bool = False, has_models: bool = False) -> list[str]:
    """Get required imports for codec usage.

    Args:
        has_arrays: Whether ArrayCodec is used
        has_models: Whether model codecs (Object/Array/Primitive) are used

    Returns:
        List of import items to include
    """
    imports = []

    # Always import primitive codecs
    imports.extend([
        "stringCodec",
        "numberCodec",
        "bigIntCodec",
        "booleanCodec",
        "bytesCodec",
        "addressCodec",
    ])

    if has_arrays:
        imports.append("ArrayCodec")

    if has_models:
        imports.extend([
            "ObjectModelCodec",
            "ArrayModelCodec",
            "PrimitiveModelCodec",
        ])

    return imports
