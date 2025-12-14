import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config } from './config'
import { NodeStatusResponse } from './schemas'

describe('GET v2_status', () => {
  // Polytest Suite: GET v2_status

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getStatus()

      NodeStatusResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})

// catchpoint =
// ''
// catchpointAcquiredBlocks =
// 0
// catchpointProcessedAccounts =
// 0
// catchpointProcessedKvs =
// 0
// catchpointTotalAccounts =
// 0
// catchpointTotalBlocks =
// 0
// catchpointTotalKvs =
// 0
// catchpointVerifiedAccounts =
// 0
// catchpointVerifiedKvs =
// 0
// catchupTime =
// 0n
// lastCatchpoint =
// ''
// lastRound =
// 57711496n
// lastVersion =
// 'https://github.com/algorandfoundation/specs/tree/953304de35264fc3ef91bcd05c123242015eeaed'
// nextVersion =
// 'https://github.com/algorandfoundation/specs/tree/953304de35264fc3ef91bcd05c123242015eeaed'
// nextVersionRound =
// 57711497n
// nextVersionSupported =
// true
// stoppedAtUnsupportedRound =
// false
// timeSinceLastRound =
// 504021303n
