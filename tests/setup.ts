import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { Config } from '../src/'
import { consoleLogger } from '../src/types/logging'

let envPath = path.resolve(path.join(__dirname, '..', '.env'))
if (!fs.existsSync(envPath)) {
  envPath = path.resolve(path.join(__dirname, '..', 'example.env'))
}
console.log(`Loading ${envPath}`)
dotenv.config({
  path: envPath,
})

Config.configure({
  logger: consoleLogger,
})
