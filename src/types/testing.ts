// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/testing-types'

import {
  type AlgorandTestAutomationContext as _AlgorandTestAutomationContext,
  type GetTestAccountParams as _GetTestAccountParams,
  type AlgorandFixtureConfig as _AlgorandFixtureConfig,
  type AlgorandFixture as _AlgorandFixture,
  type LogSnapshotConfig as _LogSnapshotConfig,
  type AlgoKitLogCaptureFixture as _AlgoKitLogCaptureFixture,
} from '../testing-types'

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing-types` instead */
export type AlgorandTestAutomationContext = _AlgorandTestAutomationContext

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing-types` instead */
export type GetTestAccountParams = _GetTestAccountParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing-types` instead */
export type AlgorandFixtureConfig = _AlgorandFixtureConfig

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing-types` instead */
export type AlgorandFixture = _AlgorandFixture

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing-types` instead */
export type LogSnapshotConfig = _LogSnapshotConfig

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing-types` instead */
export type AlgoKitLogCaptureFixture = _AlgoKitLogCaptureFixture
