// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/testing'

import {
  type AlgoKitLogCaptureFixture as _AlgoKitLogCaptureFixture,
  type AlgorandFixture as _AlgorandFixture,
  type AlgorandFixtureConfig as _AlgorandFixtureConfig,
  type AlgorandTestAutomationContext as _AlgorandTestAutomationContext,
  type GetTestAccountParams as _GetTestAccountParams,
  type LogSnapshotConfig as _LogSnapshotConfig,
} from '../testing'

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing` instead */
export type AlgorandTestAutomationContext = _AlgorandTestAutomationContext

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing` instead */
export type GetTestAccountParams = _GetTestAccountParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing` instead */
export type AlgorandFixtureConfig = _AlgorandFixtureConfig

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing` instead */
export type AlgorandFixture = _AlgorandFixture

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing` instead */
export type LogSnapshotConfig = _LogSnapshotConfig

/** @deprecated Import from `@algorandfoundation/algokit-utils/testing` instead */
export type AlgoKitLogCaptureFixture = _AlgoKitLogCaptureFixture
