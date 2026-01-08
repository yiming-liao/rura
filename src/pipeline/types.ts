/**
 * Final result of a pipeline execution.
 *
 * - If `early` is true, the pipeline stopped before completing all hooks.
 * - The `ctx` field always contains the context after the last executed hook.
 * - The `output` field is present only when early termination occurs.
 */
export type RuraResult<Ctx, Out> =
  | {
      early: true;
      ctx: Ctx;
      output: Out;
    }
  | {
      early: false;
      ctx: Ctx;
      output?: never;
    };
