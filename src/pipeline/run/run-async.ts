import type { RuraHook } from "@/hooks";
import type { RuraResult } from "@/pipeline/types";

/**
 * Executes an __asynchronous__ Rura pipeline.
 *
 * - Hooks are awaited in order.
 * - If any hook returns `{ early: true, output }`, the pipeline
 *   stops immediately and returns the early result.
 * - Both sync and async hooks are allowed.
 *
 * @param ctx - The initial pipeline context.
 * @param hooks - A list of hooks to execute sequentially.
 * @returns A promise resolving to a `RuraResult`.
 */
export async function runAsync<Ctx = unknown, Out = unknown>(
  ctx: Ctx,
  hooks: RuraHook<Ctx, Out>[],
): Promise<RuraResult<Ctx, Out>> {
  for (const hook of hooks) {
    const result = await hook.run(ctx);

    // Early return
    if (result && result.early === true) {
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
