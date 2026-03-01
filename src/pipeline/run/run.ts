import type { RuraHookSync } from "../../hooks";
import type { RuraResult } from "../../pipeline/types";

/**
 * Executes a synchronous Rura pipeline.
 *
 * Hooks are executed sequentially in the given order.
 *
 * Execution contract:
 * - Each hook receives the same `ctx` reference.
 * - If a hook returns `{ early: true, output }`,
 *   execution stops immediately and that result is returned.
 * - If no hook triggers early termination, a normal result
 *   `{ early: false, ctx }` is returned.
 *
 * This function is strictly synchronous:
 * - It does not produce a Promise.
 * - Only `RuraHookSync` hooks are allowed.
 *
 * @public
 */
export function run<Ctx = unknown, Out = unknown>(
  ctx: Ctx,
  hooks: RuraHookSync<Ctx, Out>[],
): RuraResult<Ctx, Out> {
  for (const hook of hooks) {
    const result = hook.run(ctx);

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
