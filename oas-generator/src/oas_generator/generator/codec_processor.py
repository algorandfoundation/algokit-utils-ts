"""Codec expression generator for the new codec-based metadata system.

This module generates TypeScript codec expressions from OpenAPI schema information.
It maps field descriptors to codec singleton references or codec constructors.
"""

from __future__ import annotations

from typing import Any

from oas_generator.generator.models import FieldDescriptor


class CodecProcessor:
    """Generates TypeScript codec expressions from field descriptors."""

    @staticmethod
    def field_codec_expr(field: FieldDescriptor, model_name: str) -> str:
        """Generate codec expression for a field.

        Args:
            field: Field descriptor containing type information
            model_name: Name of the parent model (for self-referential types)

        Returns:
            TypeScript codec expression (e.g., "stringCodec", "new ArrayCodec(...)")
        """
        if field.is_array:
            item_codec = CodecProcessor._base_codec_expr(
                ref_model=field.ref_model,
                is_signed_txn=field.is_signed_txn,
                is_bytes=field.is_bytes,
                is_bigint=field.is_bigint,
                model_name=model_name,
                inline_meta_name=None,  # Arrays don't have inline objects as items in current schema
                ts_type=field.ts_type,
            )
            return f"new ArrayCodec({item_codec})"

        return CodecProcessor._base_codec_expr(
            ref_model=field.ref_model,
            is_signed_txn=field.is_signed_txn,
            is_bytes=field.is_bytes,
            is_bigint=field.is_bigint,
            model_name=model_name,
            inline_meta_name=field.inline_meta_name,
            ts_type=field.ts_type,
        )

    @staticmethod
    def _base_codec_expr(
        ref_model: str | None,
        is_signed_txn: bool,
        is_bytes: bool,
        is_bigint: bool,
        model_name: str,
        inline_meta_name: str | None,
        ts_type: str = "",
    ) -> str:
        """Generate base codec expression (without array wrapping).

        Args:
            ref_model: Referenced model name (for model references)
            is_signed_txn: Whether this is a SignedTransaction
            is_bytes: Whether this is a byte array (Uint8Array)
            is_bigint: Whether this is a bigint
            model_name: Name of the parent model (for self-referential types)
            inline_meta_name: Name of inline object metadata if applicable
            ts_type: TypeScript type string for fallback inference

        Returns:
            Codec expression string
        """
        # SignedTransaction uses metadata-based codec
        if is_signed_txn:
            return "new ModelCodec(SignedTransactionMeta)"

        # Model references
        if ref_model:
            # Self-referential types need lazy evaluation
            if ref_model == model_name:
                return f"new ModelCodec(() => {ref_model}Meta)"
            return f"new ModelCodec({ref_model}Meta)"

        # Inline object schemas
        if inline_meta_name:
            return f"new ModelCodec({inline_meta_name})"

        # Primitive codecs based on flags
        if is_bytes:
            return "bytesCodec"
        if is_bigint:
            return "bigIntCodec"

        # Fallback to type inference from TypeScript type
        if ts_type:
            return CodecProcessor.infer_primitive_codec(ts_type)

        # Ultimate fallback
        return "stringCodec"

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

        # Check for union types that might include null
        if " | null" in ts_type:
            # Strip null and try again
            base_type = ts_type.replace(" | null", "").strip()
            inner_codec = CodecProcessor.infer_primitive_codec(base_type)
            return f"new NullableCodec({inner_codec})"

        # Default to string for unknown types
        return "stringCodec"

    @staticmethod
    def array_item_codec_expr(
        array_item_ref: str | None,
        array_item_is_signed_txn: bool,
        array_item_is_bytes: bool,
        array_item_is_bigint: bool,
    ) -> str:
        """Generate codec expression for array items (used for top-level array schemas).

        Args:
            array_item_ref: Referenced model name
            array_item_is_signed_txn: Whether items are SignedTransactions
            array_item_is_bytes: Whether items are byte arrays
            array_item_is_bigint: Whether items are bigints

        Returns:
            Codec expression string
        """
        return CodecProcessor._base_codec_expr(
            ref_model=array_item_ref,
            is_signed_txn=array_item_is_signed_txn,
            is_bytes=array_item_is_bytes,
            is_bigint=array_item_is_bigint,
            model_name="",  # Top-level arrays don't have a parent model
            inline_meta_name=None,
        )


def get_codec_imports(has_arrays: bool = False, has_models: bool = False) -> list[str]:
    """Get required imports for codec usage.

    Args:
        has_arrays: Whether ArrayCodec is used
        has_models: Whether ModelCodec is used

    Returns:
        List of import items to include
    """
    imports = []

    # Always import primitive codecs
    imports.extend([
        "stringCodec",
        "numberCodec",
        "bigintCodec",
        "booleanCodec",
        "bytesCodec",
    ])

    if has_arrays:
        imports.append("ArrayCodec")

    if has_models:
        imports.append("ModelCodec")

    return imports
