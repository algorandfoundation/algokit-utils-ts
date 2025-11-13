# Automatic Retry on Rate Limiting

This example demonstrates how AlgoKit Utils automatically retries requests when encountering HTTP 429 (Too Many Requests) rate limit errors. The SDK includes built-in retry logic with exponential backoff, making your application resilient when dealing with API rate limits from Algorand nodes.

## Key Concepts

- **Automatic Retries**: SDK automatically retries failed requests due to rate limiting
- **Exponential Backoff**: Progressive delay between retry attempts to avoid overwhelming the server
- **HTTP 429 Handling**: Proper handling of "Too Many Requests" errors
- **Concurrent Requests**: Making multiple simultaneous requests safely
- **TestNet Access**: Using AlgoKit's built-in TestNet configuration

## What This Example Shows

1. Connecting to Algorand TestNet using `AlgorandClient.testNet()`
2. Making 150 concurrent algod requests (account information lookups)
3. Making 150 concurrent indexer requests (account lookups)
4. Automatic retry handling when rate limits are encountered
5. No manual retry logic needed - the SDK handles it automatically

## Code Walkthrough

### Initialize TestNet Connection

```typescript
const algorand = AlgorandClient.testNet()
```

Creates an AlgorandClient configured for TestNet with automatic retry logic enabled. This provides access to both algod and indexer clients pre-configured with AlgoNode endpoints.

### Access Algod Client

```typescript
const algod = algorand.client.algod
```

Get the algod client from the AlgorandClient. This client includes automatic retry logic for rate limiting.

### Make Concurrent Algod Requests

```typescript
const algodResponses = await Promise.all(
  new Array(150).fill(0).map(async () => {
    return await algod.accountInformation(testAccount).do()
  })
)
```

Makes 150 concurrent requests to fetch account information. If any request encounters HTTP 429 (rate limiting), the SDK automatically:
1. Detects the 429 error
2. Waits for an exponentially increasing delay
3. Retries the request
4. Repeats until success or max retries reached

### Access Indexer Client

```typescript
const indexer = algorand.client.indexer
```

Get the indexer client from the AlgorandClient. Like algod, this includes automatic retry logic.

### Make Concurrent Indexer Requests

```typescript
const indexerResponses = await Promise.all(
  new Array(150).fill(0).map(async () => {
    return await indexer.lookupAccountByID(testAccount).do()
  })
)
```

Makes 150 concurrent indexer requests. The same automatic retry logic applies to indexer calls.

## API Patterns (AlgoKit Utils v9.1.2)

### TestNet Connection
```typescript
// Initialize client for TestNet (uses AlgoNode)
const algorand = AlgorandClient.testNet()

// Access underlying algod client
const algod = algorand.client.algod

// Access underlying indexer client
const indexer = algorand.client.indexer
```

### Other Network Options
```typescript
// MainNet
const algorand = AlgorandClient.mainNet()

// LocalNet
const algorand = AlgorandClient.defaultLocalNet()

// Custom configuration
const algorand = AlgorandClient.fromConfig({
  algodConfig: { server: 'https://...', port: 443, token: '' },
  indexerConfig: { server: 'https://...', port: 443, token: '' },
})
```

### Making Algod Calls
```typescript
// All algod calls include automatic retry on rate limiting
await algod.accountInformation(address).do()
await algod.accountApplicationInformation(address, appId).do()
await algod.accountAssetInformation(address, assetId).do()
await algod.getApplicationByID(appId).do()
await algod.status().do()
```

### Making Indexer Calls
```typescript
// All indexer calls include automatic retry on rate limiting
await indexer.lookupAccountByID(address).do()
await indexer.lookupApplications(appId).do()
await indexer.lookupAssetByID(assetId).do()
await indexer.searchForTransactions().address(address).do()
```

## How Automatic Retry Works

### Retry Strategy

1. **Detection**: SDK detects HTTP 429 (Too Many Requests) response
2. **Exponential Backoff**: Wait time increases with each retry:
   - 1st retry: ~100ms
   - 2nd retry: ~200ms
   - 3rd retry: ~400ms
   - 4th retry: ~800ms
   - And so on...
3. **Max Attempts**: SDK will retry a reasonable number of times before giving up
4. **Transparent**: Your code doesn't need to handle retries - it's automatic

### When Retries Happen

- HTTP 429 (Too Many Requests) responses
- Temporary network issues
- Node overload conditions
- API gateway rate limiting

### When Retries Don't Happen

- Client-side errors (4xx other than 429)
- Server errors (5xx)
- Invalid requests
- Authentication failures

## Common Use Cases

### High-Throughput Applications
Process many transactions without manual retry logic:
```typescript
const algorand = AlgorandClient.testNet()
const algod = algorand.client.algod

// SDK handles retries automatically
const txIds = await Promise.all(
  transactions.map(tx => algod.sendRawTransaction(tx).do())
)
```

### Data Synchronization
Fetch large amounts of data reliably:
```typescript
const indexer = algorand.client.indexer

const transactions = []
for (let i = 0; i < 1000; i++) {
  // Automatic retries if rate limited
  const result = await indexer.searchForTransactions()
    .address(address)
    .limit(100)
    .nextToken(nextToken)
    .do()
  transactions.push(...result.transactions)
}
```

### Monitoring and Analytics
Poll node status without failures:
```typescript
setInterval(async () => {
  const status = await algod.status().do()
  console.log(`Current round: ${status.lastRound}`)
}, 1000) // SDK handles rate limiting automatically
```

## Important Considerations

### Rate Limit Thresholds

- **AlgoNode Free Tier**: ~10 requests/second per IP
- **Public Nodes**: Varies by provider
- **Private Nodes**: Usually higher or no limits
- **LocalNet**: No rate limits (running locally)

### Best Practices

1. **Batch Requests**: Group multiple operations when possible
2. **Connection Pooling**: Reuse AlgorandClient instances
3. **Request Throttling**: Add delays between batches for very large operations
4. **Monitor Logs**: Watch for retry warnings in production
5. **Use LocalNet**: For development/testing to avoid rate limits

### Performance Impact

- Retries add latency to failed requests
- Exponential backoff prevents server overload
- Most successful requests have zero retry overhead
- Failed requests may take several seconds with retries

### Error Handling

The SDK will eventually throw an error if retries are exhausted:
```typescript
try {
  const result = await algod.accountInformation(address).do()
} catch (error) {
  // This means retries were exhausted
  console.error('Request failed after automatic retries:', error)
}
```

## Expected Output

```
Starting concurrent requests to demonstrate retry mechanism...

Making 150 concurrent algod requests...
Successfully completed 150 algod requests
Account balance: 1234567890 microAlgos

Making 150 concurrent indexer requests...
Successfully completed 150 indexer requests
Account address: XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA

Note: If rate limits are hit, the SDK automatically retries the requests
You may see warning messages in the logs indicating retries are occurring
All requests completed successfully!
```

**Note**: Actual output may include warning messages about retries if rate limits are encountered. This is normal and expected behavior.

## Running the Example

### Prerequisites
This example requires no local setup - it connects directly to Algorand TestNet.

### Install Dependencies
```bash
npm install
```

### Execute
```bash
npm start
```

The example will:
1. Connect to TestNet via AlgoNode
2. Make 150 concurrent algod requests
3. Make 150 concurrent indexer requests
4. Automatically retry any rate-limited requests
5. Display the results

## Testing Rate Limiting

To see retries in action:
1. Increase the number of concurrent requests (e.g., 500 or 1000)
2. Run multiple instances of the script simultaneously
3. Watch for retry warning messages in the console
4. Observe that all requests eventually succeed

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [AlgoNode API Documentation](https://algonode.io/api/)
- [Algorand Developer Portal](https://developer.algorand.org/)
- [HTTP 429 Rate Limiting](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
