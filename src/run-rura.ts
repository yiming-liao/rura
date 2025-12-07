import type { RuraHook, RuraResult } from "@/types";

/**
 * Executes a list of hooks in order.
 * - Stops early when a hook returns `{ early: true, output }`.
 *
 * @returns A `RuraResult` describing whether the pipeline ended early
 *          and the final context/output.
 */
export async function runRura<Ctx = unknown, Out = unknown>(
  ctx: Ctx,
  hooks: RuraHook<Ctx, Out>[],
): Promise<RuraResult<Ctx, Out>> {
  for (const hook of hooks) {
    const result = await hook.run(ctx);
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
