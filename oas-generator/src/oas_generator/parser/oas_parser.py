"""Lightweight OpenAPI Specification Parser for TypeScript Client Generation.

This module provides a minimal parser that loads OpenAPI 3.x specifications
for use by the TypeScript generator. It focuses only on loading the spec
data, leaving all processing to the template engine.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


class OASParser:
    """Simple parser for OpenAPI 3.x specifications."""

    def __init__(self) -> None:
        """Initialize the parser with no loaded data."""
        self.spec_data: dict[str, Any] | None = None

    def parse_file(self, file_path: str | Path) -> None:
        """Parse OpenAPI specification from a JSON file.

        Args:
            file_path: Path to the OpenAPI specification file (JSON format)

        Raises:
            FileNotFoundError: If the file doesn't exist
            json.JSONDecodeError: If the file is not valid JSON
        """
        path = Path(file_path)
        if not path.exists():
            msg = f"OpenAPI spec file not found: {file_path}"
            raise FileNotFoundError(msg)

        with path.open(encoding="utf-8") as f:
            self.spec_data = json.load(f)

    def parse_dict(self, spec_dict: dict[str, Any]) -> None:
        """Parse OpenAPI specification from a dictionary.

        Args:
            spec_dict: The OpenAPI specification as a dictionary
        """
        self.spec_data = spec_dict
