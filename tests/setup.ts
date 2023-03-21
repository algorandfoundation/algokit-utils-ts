import { Config } from '../src/'
import { consoleLogger } from '../src/types/logging'

Config.configure({
  logger: consoleLogger,
})
