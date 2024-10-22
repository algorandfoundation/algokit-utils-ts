import algosdk from 'algosdk'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function indexerWaitForRound(client: algosdk.Indexer, round: number | bigint, maxAttempts: number) {
  let indexerRound = 0
  let attempts = 0

  for (;;) {
    // eslint-disable-next-line no-await-in-loop
    const status = await client.makeHealthCheck().do()
    indexerRound = status.round

    if (indexerRound >= round) {
      // Success
      break
    }

    // eslint-disable-next-line no-await-in-loop
    await sleep(1000) // Sleep 1 second and check again
    attempts += 1

    if (attempts > maxAttempts) {
      // Failsafe to prevent infinite loop
      throw new Error(`Timeout waiting for indexer to catch up to round ${round}. It is currently on ${indexerRound}`)
    }
  }
}
