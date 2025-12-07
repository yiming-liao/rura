/**
 * Final result of a pipeline execution.
 *
 * - If `early` is true, the pipeline stopped before completing all hooks.
 * - The `ctx` field always contains the final context.
 * - The `output` field appears only when early termination occurs.
 */
export interface RuraResult<Ctx, Out> {
  /** Indicates whether the pipeline exited early. */
  early: boolean;
  /** The final context after all executed hooks. */
  ctx: Ctx;
  /** The output value when the pipeline ends early. */
  output?: Out;
}
