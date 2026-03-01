import type { RuraHookAsync, RuraHookSync } from "./types";
import { ASYNC_HOOK } from "./internal";

/**
 * Creates a synchronous hook.
 *
 * The hook executes without awaiting.
 *
 * @public
 */
export function createHook<Ctx = unknown, Out = unknown>(
  name: string,
  run: RuraHookSync<Ctx, Out>["run"],
  order?: number,
): RuraHookSync<Ctx, Out> {
  const hook: RuraHookSync<Ctx, Out> = {
    name,
    run,
    ...(order !== undefined ? { order } : {}),
  };

  return hook;
}

/**
 * Creates an asynchronous hook.
 *
 * The hook executes via `await`.
 *
 * @public
 */
export function createHookAsync<Ctx = unknown, Out = unknown>(
  name: string,
  run: RuraHookAsync<Ctx, Out>["run"],
  order?: number,
): RuraHookAsync<Ctx, Out> {
  const hook: RuraHookAsyncInternal<Ctx, Out> = {
    name,
    run,
    ...(order !== undefined ? { order } : {}),
    [ASYNC_HOOK]: true,
  };

  return hook as RuraHookAsync<Ctx, Out>;
}

/**
 * Internal async hook marker.
 *
 * Augments `RuraHookAsync` with a runtime symbol
 * used for deterministic async detection.
 *
 * @internal
 */
type RuraHookAsyncInternal<Ctx, Out> = RuraHookAsync<Ctx, Out> & {
  [ASYNC_HOOK]: true;
};
