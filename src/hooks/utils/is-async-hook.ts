/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RuraHook, RuraHookAsync } from "../types";
import { ASYNC_HOOK } from "../internal";

/**
 * Determines whether a hook is asynchronous.
 *
 * Async hooks are identified via an internal runtime marker
 * attached by `createHookAsync`.
 *
 * @internal
 */
export function isAsyncHook<Ctx, Out>(
  hook: RuraHook<Ctx, Out>,
): hook is RuraHookAsync<Ctx, Out> {
  return (hook as any)[ASYNC_HOOK] === true;
}
