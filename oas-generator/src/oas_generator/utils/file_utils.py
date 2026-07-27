"""File utilities for the TS OAS generator.

Provides safe write operations similar to rust_oas_generator.utils.file_utils.
"""

from __future__ import annotations

from pathlib import Path


def write_files_to_disk(files: dict[Path, str]) -> None:
    """Write generated files to disk, creating parent directories.

    Existing files are overwritten. Parent directories are created as needed.
    """
    for path, content in files.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
