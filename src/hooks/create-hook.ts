import type { RuraHookAsync, RuraHookSync } from "./types";

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
  return {
    name,
    run,
    ...(order !== undefined ? { order } : {}),
  };
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
  return {
    name,
    run,
    ...(order !== undefined ? { order } : {}),
  };
}
