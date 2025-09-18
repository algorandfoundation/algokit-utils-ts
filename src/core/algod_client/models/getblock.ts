export type GetBlock = {
  /**
   * Block header data.
   */
  block: {};

  /**
   * Optional certificate object. This is only included when the format is set to message pack.
   */
  cert?: {};
};
