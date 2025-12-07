/**
 * The return type of a Rura hook.
 *
 * - Return `void` to continue the pipeline.
 * - Return `{ early: true, output }` to stop the pipeline immediately.
 *
 * Supports both sync and async forms.
 */
export type RuraHookResult<Out> =
  | void // sync
  | { early: true; output: Out } // sync
  | Promise<void | { early: true; output: Out }>; // async

/**
 * A single pipeline hook.
 *
 * Hooks receive the current context and may:
 * - mutate it and continue, or
 * - return `{ early: true, output }` to exit the pipeline early.
 */
export interface RuraHook<Ctx = unknown, Out = unknown> {
  /** Unique name for debugging and inspection. */
  name: string;

  /** Executes the hook. */
  run(ctx: Ctx): RuraHookResult<Out>;

  /** Optional execution order. Lower values run first. */
  order?: number;
}

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
