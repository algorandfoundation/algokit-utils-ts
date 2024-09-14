export * from './debugging'
import { Config } from '@algorandfoundation/algokit-utils'
import { DebugParams } from '@algorandfoundation/algokit-utils/types/debugging'
import { persistSourceMaps, simulateAndPersistResponse } from './debugging'

// Automatically register debug handlers upon import
Config.registerDebugHandler(async (params: DebugParams) => {
  if (params.message === 'persistSourceMaps') {
    await persistSourceMaps(params.data)
  } else if (params.message === 'simulateAndPersistResponse') {
    await simulateAndPersistResponse(params.data)
  }
  // Add more handlers as needed
})
