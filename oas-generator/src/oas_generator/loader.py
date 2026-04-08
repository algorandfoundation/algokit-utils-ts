"""Spec loader with support for local paths and URLs."""

from __future__ import annotations

import tempfile
import urllib.error
import urllib.request
from pathlib import Path


def resolve_spec(spec: str) -> Path:
    """Resolve a spec reference to a local path, downloading if needed.

    Supports:
        - Local paths: "api/specs/algod.oas3.json"
        - Remote URLs: "https://example.com/spec.json"
    """
    # Remote URL
    if spec.startswith(("http://", "https://")):
        return _download_to_temp(spec)

    # Local path
    return Path(spec)


def _download_to_temp(url: str) -> Path:
    """Download URL to a temporary file and return the path."""
    tmp = tempfile.NamedTemporaryFile(suffix=".json", delete=False)  # noqa: SIM115
    try:
        urllib.request.urlretrieve(url, tmp.name)  # noqa: S310
    except urllib.error.URLError as e:
        msg = f"Failed to download spec from {url}: {e}"
        raise RuntimeError(msg) from e
    return Path(tmp.name)
