/**
 * algod mutex and blocking profiling state.
 */
export type DebugSettingsProf = {
  /**
   * The rate of blocking events. The profiler aims to sample an average of one blocking event per rate nanoseconds spent blocked. To turn off profiling entirely, pass rate 0.
   */
  blockRate?: bigint;

  /**
   * The rate of mutex events. On average 1/rate events are reported. To turn off profiling entirely, pass rate 0
   */
  mutexRate?: bigint;
};
