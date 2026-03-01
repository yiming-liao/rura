import type { RuraHook } from "../../../hooks";
import { isAsyncHook } from "../../../hooks/utils/is-async-hook";

/**
 * Ensures that a hook is compatible with a synchronous pipeline.
 *
 * Throws if the hook is asynchronous.
 *
 * @internal
 */
export function assertSyncHook<Ctx, Out>(hook: RuraHook<Ctx, Out>): void {
  if (isAsyncHook(hook)) {
    throw new Error(
      `Async hook "${hook.name}" is not allowed in sync pipeline.`,
    );
  }
}
