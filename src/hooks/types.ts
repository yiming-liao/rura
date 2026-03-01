/**
 * Base contract for all Rura hooks.
 *
 * A hook is an ordered execution unit within a pipeline.
 * The `name` uniquely identifies the hook.
 * The optional `order` controls execution priority (lower values run first).
 *
 * @public
 */
export interface RuraHookBase {
  /** Unique hook identifier. */
  name: string;

  /** Execution priority. Lower values run earlier. */
  order?: number;
}

/**
 * Synchronous hook.
 *
 * Executed without awaiting.
 * The provided `ctx` may be mutated.
 * Returning an early signal terminates the pipeline.
 *
 * @public
 */
export interface RuraHookSync<Ctx, Out> extends RuraHookBase {
  run(ctx: Ctx): void | { early: true; output: Out };
}

/**
 * Asynchronous hook.
 *
 * Executed via `await`.
 * The provided `ctx` may be mutated.
 * Resolving with an early signal terminates the pipeline.
 *
 * @public
 */
export interface RuraHookAsync<Ctx, Out> extends RuraHookBase {
  run(ctx: Ctx): Promise<void | { early: true; output: Out }>;
}

/**
 * Union of all hook variants supported by the Rura pipeline.
 *
 * @public
 */
export type RuraHook<Ctx = unknown, Out = unknown> =
  | RuraHookSync<Ctx, Out>
  | RuraHookAsync<Ctx, Out>;
