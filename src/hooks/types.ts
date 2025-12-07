/**
 * Base shape for all Rura hooks.
 * - Every hook must have a unique `name`.
 * - `order` controls execution priority (lower runs earlier).
 */
export interface RuraHookBase {
  /** Unique identifier for debugging and inspection. */
  name: string;

  /** Execution priority. Hooks with lower values run first. */
  order?: number;
}

/**
 * Synchronous Rura hook.
 * - Runs without awaiting.
 * - May optionally signal early termination.
 */
export interface RuraHookSync<Ctx, Out> extends RuraHookBase {
  /**
   * Executes the hook.
   * @returns Nothing, or an early-return signal with output.
   */
  run(ctx: Ctx): void | { early: true; output: Out };
}

/**
 * Asynchronous Rura hook.
 * - Executes via `await`.
 * - May optionally signal early termination.
 */
export interface RuraHookAsync<Ctx, Out> extends RuraHookBase {
  /**
   * Executes the hook asynchronously.
   * @returns A promise resolving to nothing or an early-return signal.
   */
  run(ctx: Ctx): Promise<void | { early: true; output: Out }>;
}

/**
 * A union of all hook types accepted by the Rura pipeline.
 */
export type RuraHook<Ctx = unknown, Out = unknown> =
  | RuraHookSync<Ctx, Out>
  | RuraHookAsync<Ctx, Out>;
