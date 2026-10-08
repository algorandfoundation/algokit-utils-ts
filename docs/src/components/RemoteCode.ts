import fs from 'fs/promises';
import { URL } from 'url';

export interface CodeResult {
  content: string;
  line: number | null;
  githubUrl: URL | string;
}

export async function getSelectedCode(
  src: string,
  snippet: string | undefined,
): Promise<CodeResult> {
  const code = await getCode(src);
  let githubUrl: URL | string;
  let lineNumber: number | null = null;

  try {
    if (src.includes('raw.githubusercontent.com')) {
      githubUrl = convertRawToGitHubUrl(src);
    } else {
      githubUrl = src;
    }
  } catch (error) {
    console.warn('Error converting to GitHub URL, using original URL:', error);
    githubUrl = src;
  }

  if (!snippet) {
    return {
      content: code,
      line: null,
      githubUrl,
    };
  }

  const pattern = `^\\s*(//|#) example: ${snippet}$`;
  const regex = new RegExp(pattern, 'g');
  const codeLines = code.split('\n');

  const occurrenceIndexes = codeLines.reduce<number[]>(
    (indexes, line, index) => {
      if (regex.test(line)) {
        indexes.push(index);
      }
      return indexes;
    },
    [],
  );

  if (occurrenceIndexes.length !== 2) {
    throw new Error(
      `Error: Pattern "${pattern}" must occur exactly twice. Found: ${occurrenceIndexes.length}`,
    );
  }

  const [startIndex, endIndex] = occurrenceIndexes;
  lineNumber = startIndex + 1; // First line after the starting comment
  const selectedLines = codeLines.slice(startIndex + 1, endIndex);
  const selectedContent = dedentCode(selectedLines);

  return {
    content: selectedContent,
    line: lineNumber,
    githubUrl,
  };
}

/**
 * Removes common leading whitespace from code lines.
 */
export function dedentCode(lines: string[]): string {
  if (lines.length === 0) return '';

  const minIndent = lines.reduce((min, line) => {
    if (line.trim().length === 0) return min;
    const leadingWhitespace = line.match(/^\s*/)?.[0].length ?? 0;
    return Math.min(min, leadingWhitespace);
  }, Infinity);

  // Infinity means every line was blank
  if (minIndent === Infinity || minIndent === 0) {
    return lines.join('\n');
  }

  const dedentedLines = lines.map(line => {
    if (line.trim().length === 0) return line;
    return line.slice(minIndent);
  });

  return dedentedLines.join('\n');
}

const LOCAL_REPO_RAW_PREFIX =
  'https://raw.githubusercontent.com/algorandfoundation/algokit-utils-ts/';

// Resolved relative to this file, so it breaks if RemoteCode.ts moves
const REPO_ROOT_URL = new URL('../../../', import.meta.url);

/**
 * Maps a raw.githubusercontent.com URL for this repository to the same file
 * in the local checkout, so the docs build renders the code as of the current
 * commit (and PR builds work before the referenced branch has the file).
 * Returns null if src points outside this repository.
 */
export function localPathForRepoUrl(src: string): URL | null {
  if (!src.startsWith(LOCAL_REPO_RAW_PREFIX)) {
    return null;
  }
  const segments = src.slice(LOCAL_REPO_RAW_PREFIX.length).split('/');
  // The ref is either a single segment (`main`) or a triple (`refs/heads/main`)
  const refSegmentCount = segments[0] === 'refs' ? 3 : 1;
  const filePath = segments.slice(refSegmentCount).join('/');
  if (!filePath) {
    return null;
  }
  return new URL(filePath, REPO_ROOT_URL);
}

async function getCode(src: string): Promise<string> {
  const localPath = localPathForRepoUrl(src);
  if (localPath) {
    try {
      return await fs.readFile(localPath, 'utf-8');
    } catch {
      // Fall back to fetching the remote URL
    }
  }
  try {
    new URL(src);
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    if (error instanceof TypeError) {
      try {
        return await fs.readFile(src, 'utf-8');
      } catch (fsError) {
        if (fsError instanceof Error) {
          throw new Error(`Error reading file: ${fsError.message}`);
        }
        throw new Error(`Unknown error reading file: ${fsError}`);
      }
    } else {
      throw new Error(`RemoteCode retrieval failed: ${error}`);
    }
  }
}

/**
 * Converts a raw.githubusercontent.com URL to the equivalent github.com blob URL.
 */
export function convertRawToGitHubUrl(rawUrl: string): URL | string {
  const url = new URL(rawUrl);

  if (url.hostname !== 'raw.githubusercontent.com') {
    throw new Error('Not a valid raw.githubusercontent.com URL');
  }

  const segments = url.pathname.split('/').filter(segment => segment !== '');

  // Need at least username, repository, and branch
  if (segments.length < 3) {
    throw new Error('URL does not contain the required components');
  }

  const username = segments[0];
  const repository = segments[1];
  const branch = segments[2];
  const filePath = segments.slice(3).join('/');

  return new URL(
    `https://github.com/${username}/${repository}/blob/${branch}/${filePath}`,
  );
}
