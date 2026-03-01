/**
 * Result of a Rura pipeline execution.
 *
 * This type represents the final outcome of running a pipeline,
 * either through `run` or `runAsync`.
 *
 * Execution semantics:
 * - `ctx` always refers to the same context object that was
 *   passed into the pipeline. Hooks may mutate it in place.
 * - When `early` is `true`, execution stopped before all hooks
 *   completed, and `output` contains the early-return value.
 * - When `early` is `false`, all hooks were executed and no
 *   early termination occurred. In this case, `output` is not present.
 *
 * The `early` field acts as a discriminant for safe narrowing.
 *
 * @public
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
