import { Config } from '../config'

describe('debugging', () => {
  // This would like in the debug utils lib
  const registerNodeDebugHandlers = () => {
    // TODO: Define types for the events
    // TODO: Question - Would this be the package we'd use to surface the UI widget for downloading a simulate trace?
    Config.events.on('simulateAndPersistResponse', (data: any) => {
      // Go any save the data
    })

    Config.events.on('persistSourceMaps', (data: any) => {
      // Go any save the data
    })
  }

  it('users code would looks like this', () => {
    Config.configure({
      debug: true,
    })
    registerNodeDebugHandlers()
  })
})
