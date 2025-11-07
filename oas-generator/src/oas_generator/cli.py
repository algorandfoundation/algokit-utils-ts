#!/usr/bin/env python3
"""Command-line interface for the TypeScript OAS Generator (Phase 2)."""

from __future__ import annotations

import argparse
import contextlib
import json
import shutil
import sys
import tempfile
import traceback
from collections.abc import Generator
from pathlib import Path

from oas_generator import constants
from oas_generator.generator.template_engine import CodeGenerator
from oas_generator.utils.file_utils import write_files_to_disk

# Exit codes for better error reporting
EXIT_SUCCESS = 0
EXIT_FILE_NOT_FOUND = 1
EXIT_INVALID_JSON = 2
EXIT_GENERATION_ERROR = 3


def parse_command_line_args(args: list[str] | None = None) -> argparse.Namespace:
    """Create and configure the command line argument parser for TS generator."""
    parser = argparse.ArgumentParser(
        description="Generate TypeScript client from OpenAPI specification",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s ../specs/algod.oas3.json --output ./packages/algod_client --package-name algod_client
  %(prog)s ../specs/indexer.oas3.json -o ./packages/indexer_client -p indexer_client
        """,
    )

    parser.add_argument(
        "spec_file",
        type=Path,
        help="Path to OpenAPI specification file (JSON or YAML)",
        metavar="SPEC_FILE",
    )
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        default=Path(constants.DEFAULT_OUTPUT_DIR),
        help="Output directory for generated files (default: %(default)s)",
        dest="output_dir",
    )
    parser.add_argument(
        "--package-name",
        "-p",
        default=constants.DEFAULT_PACKAGE_NAME,
        help="Name for the generated TypeScript package (default: %(default)s)",
        dest="package_name",
    )
    parser.add_argument(
        "--template-dir",
        "-t",
        type=Path,
        help="Custom template directory (optional)",
        dest="template_dir",
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Enable verbose output",
    )
    parser.add_argument(
        "--description",
        "-d",
        help="Custom description for the generated package (overrides spec description)",
        dest="custom_description",
    )

    parsed_args = parser.parse_args(args)

    # Validate inputs
    if not parsed_args.spec_file.exists():
        parser.error(f"Specification file not found: {parsed_args.spec_file!s}")

    return parsed_args


def print_generation_summary(*, file_count: int, files: dict[Path, str], output_dir: Path) -> None:
    """Print summary of generated files."""
    print(f"Generated {file_count} files:")
    for file_path in sorted(files.keys()):
        print(f"  {file_path!s}")
    print(f"\nTypeScript client generated successfully in {output_dir!s}")


@contextlib.contextmanager
def backup_and_prepare_output_dir(output_dir: Path) -> Generator[None, None, None]:
    """Backup and ensure the output directory exists before generation."""
    backup_dir: Path | None = None

    # Create a backup of the existing directory if it exists and is non-empty
    if output_dir.exists() and any(output_dir.iterdir()):
        backup_dir = Path(tempfile.mkdtemp(prefix=constants.BACKUP_DIR_PREFIX))
        shutil.copytree(output_dir, backup_dir, dirs_exist_ok=True)

    # Ensure directory exists
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        yield
    except Exception:
        if backup_dir:
            print(
                "Error: Generation failed. Restoring original content.",
                file=sys.stderr,
            )
            # Restore backup
            if output_dir.exists():
                shutil.rmtree(output_dir)
            shutil.copytree(backup_dir, output_dir, dirs_exist_ok=True)
        raise
    finally:
        if backup_dir and backup_dir.exists():
            shutil.rmtree(backup_dir)


def main(args: list[str] | None = None) -> int:
    parsed_args = parse_command_line_args(args)

    try:
        with backup_and_prepare_output_dir(parsed_args.output_dir):
            generator = CodeGenerator(template_dir=parsed_args.template_dir)

            generated_files = generator.generate(
                parsed_args.spec_file,
                parsed_args.output_dir,
                parsed_args.package_name,
                custom_description=parsed_args.custom_description,
            )

            # Write files to disk (overwrite safely)
            write_files_to_disk(generated_files)

            if parsed_args.verbose:
                print_generation_summary(
                    file_count=len(generated_files),
                    files=generated_files,
                    output_dir=parsed_args.output_dir,
                )
            else:
                print(f"TypeScript client generated successfully in {parsed_args.output_dir!s}")

        return EXIT_SUCCESS

    except FileNotFoundError:
        print(
            f"Error: Specification file not found: {parsed_args.spec_file!s}",
            file=sys.stderr,
        )
        return EXIT_FILE_NOT_FOUND
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in specification file: {e!s}", file=sys.stderr)
        return EXIT_INVALID_JSON
    except Exception as e:
        print(f"Error: {e!s}", file=sys.stderr)
        if parsed_args.verbose:
            traceback.print_exc()
        return EXIT_GENERATION_ERROR


if __name__ == "__main__":
    sys.exit(main())
