import type { RuraHook, RuraHookAsync } from "@/hooks/types";

/**
 * Determines whether a given hook is asynchronous.
 *
 * A hook is considered async if its `run` function
 * is an `AsyncFunction` (i.e. declared with `async`).
 *
 * @returns `true` if the hook executes asynchronously, otherwise `false`.
 */
export function isAsyncHook<Ctx, Out>(
  hook: RuraHook<Ctx, Out>,
): hook is RuraHookAsync<Ctx, Out> {
  return hook.run.constructor.name === "AsyncFunction";
}
