import type { RuraHook } from "../../hooks/types";
import type { RuraResult } from "../../pipeline/types";
import { assertSyncHook } from "./utils/assert-sync-hook";
import { logPipelineHooks } from "./utils/log-pipeline-hooks";

/**
 * Internal pipeline builder.
 *
 * Maintains an ordered hook registry and delegates execution
 * to the provided strategy function.
 *
 * Responsibilities:
 * - Enforce mode compatibility (sync / async)
 * - Maintain deterministic hook ordering
 * - Prevent execution-time mutation of the registry
 *
 * This builder is shared by the public sync and async
 * pipeline factories.
 *
 * @internal
 */
export function createPipelineBase<
  Hook extends RuraHook<Ctx, Out>,
  Ctx,
  Out,
  Mode extends "sync" | "async",
>(
  initialHooks: Hook[],
  runFn: (
    ctx: Ctx,
    hooks: Hook[],
  ) => Mode extends "sync"
    ? RuraResult<Ctx, Out>
    : Promise<RuraResult<Ctx, Out>>,
  options: { name?: string; mode: Mode },
) {
  const isSync = options.mode === "sync";
  if (isSync) for (const hook of initialHooks) assertSyncHook(hook);
  const name = options.name;
  const hooks = [...initialHooks];

  // -----------------------------------------------------------------
  // Internal helpers
  // -----------------------------------------------------------------

  /**
   * Sorts hooks by ascending order (lower values run first).
   */
  function sortHooks() {
    hooks.sort((a, b) => {
      const ao = a.order ?? Number.POSITIVE_INFINITY;
      const bo = b.order ?? Number.POSITIVE_INFINITY;
      return ao - bo;
    });
  }

  // -----------------------------------------------------------------
  // Instance methods
  // -----------------------------------------------------------------

  /**
   * Registers a hook into the pipeline.
   */
  function use(hook: Hook) {
    if (isSync) assertSyncHook(hook);
    hooks.push(hook);
    sortHooks();
    return pipeline;
  }

  /**
   * Returns a shallow copy of the ordered hooks.
   */
  function getHooks() {
    return [...hooks];
  }

  /**
   * Logs the current hook order and execution type.
   *
   * Intended for development-time inspection.
   */
  function logHooks() {
    logPipelineHooks(hooks, name);
  }

  /**
   * Executes the pipeline using the injected strategy.
   *
   * A shallow copy of the registry is provided to prevent
   * execution-time mutation.
   */
  function run(ctx: Ctx) {
    return runFn(ctx, [...hooks]);
  }

  // -----------------------------------------------------------------
  // Instance assembly
  // -----------------------------------------------------------------
  const pipeline = { use, getHooks, logHooks, run };
  sortHooks();

  return pipeline;
}
