import type { RuraHook } from "../../hooks";
import type { RuraResult } from "../../pipeline/types";

/**
 * Executes an asynchronous Rura pipeline.
 *
 * Hooks are awaited sequentially in the provided order.
 *
 * Execution contract:
 * - Each hook receives the same `ctx` reference.
 * - Hooks may be synchronous or asynchronous.
 * - If a hook resolves to `{ early: true, output }`,
 *   execution stops immediately and that result is returned.
 * - If no hook triggers early termination, a normal result
 *   `{ early: false, ctx }` is returned.
 *
 * This function always returns a Promise.
 *
 * @public
 */
export async function runAsync<Ctx = unknown, Out = unknown>(
  ctx: Ctx,
  hooks: RuraHook<Ctx, Out>[],
): Promise<RuraResult<Ctx, Out>> {
  for (const hook of hooks) {
    const result = await hook.run(ctx);

    if (result?.early === true) {
      return {
        early: true,
        ctx,
        output: result.output,
      };
    }
  }

  return {
    early: false,
    ctx,
  };
}
