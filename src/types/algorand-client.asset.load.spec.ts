import { beforeEach, describe, expect, test } from 'vitest'
import { algorandFixture } from '../testing'
import { generateTestAsset } from '../testing/_asset'

interface LoadTestConfig {
  totalRuns: number
  maxParallelThreads: number
}

interface LoadTestResult {
  success: boolean
  runNumber: number
  error: string | null
}

interface LoadTestSummary {
  totalRuns: number
  successCount: number
  failureCount: number
  successRate: number
  duration: number
  throughput: number
  failures: LoadTestResult[]
}

describe('Asset Load Testing', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.newScope, 100_000)

  // Helper function to run a single OptIn/OptOut test
  async function singleOptInOptOutTest(testName: string, runNumber: number) {
    const { algorand, generateAccount } = localnet.context
    const testAccount = await generateAccount({ initialFunds: (1).algo() })
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 0)
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })

    try {
      // OptIn
      await algorand.send.assetOptIn({ sender: secondAccount, assetId: dummyAssetId })

      const secondAccountInfo = await algorand.account.getInformation(secondAccount)
      expect(secondAccountInfo.totalAssetsOptedIn).toBe(1)

      // OptOut
      await algorand.send.assetOptOut({
        sender: secondAccount,
        creator: testAccount,
        assetId: dummyAssetId,
        ensureZeroBalance: true,
      })

      const secondAccountInfoAfterOptOut = await algorand.account.getInformation(secondAccount)
      expect(secondAccountInfoAfterOptOut.totalAssetsOptedIn).toBe(0)

      return { success: true, runNumber, error: null }
    } catch (error) {
      return { success: false, runNumber, error: error instanceof Error ? error.message : String(error) }
    }
  }

  // Helper function to run tests in parallel with simple thread division
  async function runLoadTest(config: LoadTestConfig, testName: string): Promise<LoadTestSummary> {
    const { totalRuns, maxParallelThreads } = config
    const startTime = Date.now()

    // Calculate runs per thread
    const runsPerThread = Math.ceil(totalRuns / maxParallelThreads)

    // Function to run multiple tests in sequence for one thread
    const runThreadTests = async (threadId: number): Promise<LoadTestResult[]> => {
      const results: LoadTestResult[] = []
      const startRun = threadId * runsPerThread + 1
      const endRun = Math.min(startRun + runsPerThread - 1, totalRuns)

      for (let runNumber = startRun; runNumber <= endRun; runNumber++) {
        const result = await singleOptInOptOutTest(testName, runNumber)
        results.push(result)
      }

      return results
    }

    // Start all threads in parallel
    const threadPromises: Promise<LoadTestResult[]>[] = []
    for (let threadId = 0; threadId < maxParallelThreads; threadId++) {
      threadPromises.push(runThreadTests(threadId))
    }

    // Wait for all threads to complete and collect results
    const threadResults = await Promise.all(threadPromises)
    const results = threadResults.flat()

    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000

    // Final results
    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length
    const successRate = (successCount / totalRuns) * 100

    const failures = results.filter((r) => !r.success)

    return {
      totalRuns,
      successCount,
      failureCount,
      successRate,
      duration,
      throughput: totalRuns / duration,
      failures,
    }
  } // This test is conditional to avoid running during normal test execution
  // To run this test, use: $env:LOAD_TEST="true"; npm test -- --run -t "Load test localnet node"
  test('Load test localnet node', async () => {
    // Skip if not explicitly requested
    if (!process.env.LOAD_TEST) {
      return
    }
    // Lightweight load test configuration - adjust as needed
    const config: LoadTestConfig = {
      totalRuns: 100,
      maxParallelThreads: 4,
    }

    const results = await runLoadTest(config, 'Localnet OptIn/OptOut Load Test')

    // Basic assertions
    expect(results.totalRuns).toBe(config.totalRuns)
    expect(results.successCount + results.failureCount).toBe(config.totalRuns)
    expect(results.throughput).toBeGreaterThan(0) // Should have some throughput

    // Log results for manual inspection
    // eslint-disable-next-line no-console
    console.log(`\n--- Load Test Results ---`)
    // eslint-disable-next-line no-console
    console.log(`Total runs: ${results.totalRuns}`)
    // eslint-disable-next-line no-console
    console.log(`Successful: ${results.successCount}`)
    // eslint-disable-next-line no-console
    console.log(`Failed: ${results.failureCount}`)
    // eslint-disable-next-line no-console
    console.log(`Success rate: ${results.successRate.toFixed(2)}%`)
    // eslint-disable-next-line no-console
    console.log(`Duration: ${results.duration.toFixed(2)} seconds`)
    // eslint-disable-next-line no-console
    console.log(`Throughput: ${results.throughput.toFixed(2)} runs/second`)

    if (results.failures.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`\n--- Failures ---`)
      results.failures.forEach((failure) => {
        // eslint-disable-next-line no-console
        console.log(`Run ${failure.runNumber}: ${failure.error}`)
      })
    }
  }, 300_000) // 5 minute timeout
})
