import type { RuraHook } from "@/hooks";
import type { RuraResult } from "@/pipeline/types";
import { isAsyncHook } from "@/pipeline/run/utils/is-async-hook";

/**
 * Executes a __synchronous__ Rura pipeline.
 *
 * - Hooks are executed in order.
 * - If any hook returns `{ early: true, output }`, the pipeline
 *   stops immediately and returns the early result.
 * - Async hooks are not allowed. Detecting one will throw an error.
 *
 * @param ctx - The initial pipeline context.
 * @param hooks - A list of hooks to execute sequentially.
 * @returns A promise resolving to a `RuraResult`.
 */
export function run<Ctx = unknown, Out = unknown>(
  ctx: Ctx,
  hooks: RuraHook<Ctx, Out>[],
): RuraResult<Ctx, Out> {
  for (const hook of hooks) {
    if (isAsyncHook(hook)) {
      throw new Error(
        `Async hook "${hook.name}" detected in run(). Use runAsync() instead.`,
      );
    }

    const result = hook.run(ctx);
    const isEarlyReturn = result && result.early === true;

    // Early return
    if (isEarlyReturn) {
      return {
        early: true,
        ctx,
        output: result.output,
      };
    }
  }

  // Normal return
  return {
    early: false,
    ctx,
  };
}
