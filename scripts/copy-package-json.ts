import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const pick = <T extends object, U extends keyof T>(object: T, ...props: U[]): Partial<T> => {
  return Object.entries(object).reduce<Partial<T>>((acc, [key, value]) => {
    if (props.includes(key as U)) acc[key as U] = value
    return acc
  }, {})
}

const standardSectionWhitelist = [
  'name',
  'version',
  'description',
  'keywords',
  'homepage',
  'bugs',
  'license',
  'author',
  'contributors',
  'funding',
  'browser',
  'bin',
  'man',
  'directories',
  'repository',
  'config',
  'dependencies',
  'peerDependencies',
  'peerDependenciesMeta',
  'bundleDependencies',
  'optionalDependencies',
  'overrides',
  'engines',
  'os',
  'cpu',
  'private',
  'publishConfig',
]

const inputFolder = '.'
const outputFolder = join('.', 'dist')
const main = 'index.js'
const types = 'index.d.ts'
const customSections = ['module', 'main', 'type', 'types', 'exports']

const packageJson = JSON.parse(readFileSync(join(inputFolder, 'package.json'), 'utf-8'))
const sectionsToUse = [...standardSectionWhitelist, ...customSections]
const output = { main, types, scripts: {}, files: ['**'], ...pick(packageJson, ...(sectionsToUse as (keyof typeof packageJson)[])) }
writeFileSync(join(outputFolder, 'package.json'), `${JSON.stringify(output, undefined, 2)}\n`, 'utf-8')
