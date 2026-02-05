import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2).filter((arg) => arg !== '--if-present')

const eslintBin = process.platform === 'win32' ? 'eslint.cmd' : 'eslint'
const result = spawnSync(eslintBin, args, { stdio: 'inherit', shell: true })

process.exit(result.status ?? 1)
