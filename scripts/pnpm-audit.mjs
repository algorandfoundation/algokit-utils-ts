import { readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const severityRank = {
  info: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
}

const args = process.argv.slice(2)
const auditLevel = getArgValue(args, '--audit-level') || process.env.NPM_CONFIG_AUDIT_LEVEL || null

const result = spawnSync('pnpm', ['audit', '--json', ...args], {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
  shell: true,
})

const stdout = (result.stdout || '').trim()
const stderr = (result.stderr || '').trim()

if (!stdout && result.status !== 0) {
  if (stderr) {
    process.stderr.write(`${stderr}\n`)
  }
  process.exit(result.status ?? 1)
}

const jsonPayloads = parseJsonPayloads(stdout)
const issues = []

for (const payload of jsonPayloads) {
  collectIssues(payload, issues)
}

const exceptions = loadExceptions()
const filtered = []
const ignored = []

for (const issue of issues) {
  if (auditLevel && issue.severity && severityRank[issue.severity] < severityRank[auditLevel]) {
    continue
  }

  const match = matchException(issue, exceptions)
  if (match) {
    ignored.push({ issue, exception: match })
    continue
  }

  filtered.push(issue)
}

if (ignored.length > 0) {
  console.log('Applied audit exceptions from .nsprc:')
  for (const entry of ignored) {
    console.log(`- ${entry.exception.key} (${entry.issue.severity ?? 'unknown'}): ${entry.issue.title ?? 'n/a'}`)
  }
  console.log('')
}

if (filtered.length === 0) {
  console.log('pnpm audit (filtered) found 0 vulnerabilities.')
  process.exit(0)
}

console.error(`pnpm audit (filtered) found ${filtered.length} vulnerabilities:`)
for (const issue of filtered) {
  const idList = [...issue.ids].join(', ') || 'unknown-id'
  console.error(`- ${issue.severity ?? 'unknown'}: ${issue.title ?? 'n/a'} (${idList})`)
  if (issue.url) {
    console.error(`  ${issue.url}`)
  }
}

process.exit(1)

function getArgValue(argv, name) {
  const exact = argv.find((arg) => arg.startsWith(`${name}=`))
  if (exact) return exact.split('=', 2)[1]
  const index = argv.indexOf(name)
  if (index >= 0 && argv[index + 1]) return argv[index + 1]
  return null
}

function parseJsonPayloads(output) {
  if (!output) return []
  try {
    return [JSON.parse(output)]
  } catch {
    const payloads = []
    for (const line of output.split(/\r?\n/)) {
      if (!line.trim()) continue
      try {
        payloads.push(JSON.parse(line))
      } catch {
        // ignore non-JSON lines
      }
    }
    return payloads
  }
}

function collectIssues(payload, issues) {
  if (!payload || typeof payload !== 'object') return

  if (Array.isArray(payload)) {
    for (const item of payload) collectIssues(item, issues)
    return
  }

  if (payload.type === 'auditAdvisory' && payload.data) {
    const advisory = payload.data.advisory || payload.data
    addIssueFromAdvisory(advisory, issues)
    return
  }

  if (payload.advisories && typeof payload.advisories === 'object') {
    for (const advisory of Object.values(payload.advisories)) {
      addIssueFromAdvisory(advisory, issues)
    }
  }

  if (payload.vulnerabilities && typeof payload.vulnerabilities === 'object') {
    for (const vulnerability of Object.values(payload.vulnerabilities)) {
      if (Array.isArray(vulnerability.via)) {
        for (const via of vulnerability.via) {
          if (via && typeof via === 'object') {
            addIssueFromAdvisory(via, issues)
          }
        }
      }
    }
  }

  for (const value of Object.values(payload)) {
    if (value && typeof value === 'object') collectIssues(value, issues)
  }
}

function addIssueFromAdvisory(advisory, issues) {
  if (!advisory || typeof advisory !== 'object') return

  const ids = new Set()
  const addId = (value) => {
    if (!value) return
    if (Array.isArray(value)) {
      value.forEach(addId)
      return
    }
    ids.add(String(value))
  }

  addId(advisory.id)
  addId(advisory.source)
  addId(advisory.ghsa)
  addId(advisory.github_advisory_id)
  addId(advisory.cve)
  addId(advisory.cwe)
  addId(advisory.url)
  addId(advisory.advisory?.url)

  if (advisory.url) {
    const ghsa = advisory.url.match(/GHSA-[a-z0-9-]+/i)
    if (ghsa) addId(ghsa[0])
    const cve = advisory.url.match(/CVE-\d{4}-\d+/i)
    if (cve) addId(cve[0])
  }

  const issue = {
    ids,
    severity: advisory.severity,
    title: advisory.title || advisory.name,
    url: advisory.url || advisory.advisory?.url,
  }

  if (ids.size === 0 && !issue.title && !issue.severity) return
  issues.push(issue)
}

function loadExceptions() {
  if (!existsSync('.nsprc')) return []
  try {
    const raw = readFileSync('.nsprc', 'utf8')
    const data = JSON.parse(raw)
    const now = new Date()
    return Object.entries(data).map(([key, value]) => {
      if (value && typeof value === 'object') {
        const active = value.active !== false
        const expiry = value.expiry ? new Date(value.expiry) : null
        const expired = expiry instanceof Date && !Number.isNaN(expiry.valueOf()) && expiry < now
        return { key, active: active && !expired, notes: value.notes || '', expiry }
      }

      return { key, active: true, notes: String(value) }
    })
  } catch {
    return []
  }
}

function matchException(issue, exceptions) {
  if (!issue || !exceptions.length) return null

  const idList = [...issue.ids].map((id) => id.toLowerCase())
  for (const exception of exceptions) {
    if (!exception.active) continue
    const key = String(exception.key).toLowerCase()
    if (idList.some((id) => id === key)) return exception
    if (idList.some((id) => id.includes(key))) return exception
    if (issue.url && issue.url.toLowerCase().includes(key)) return exception
  }

  return null
}
