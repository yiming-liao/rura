import type { RuraHook } from "@/hooks/types";
import type { RuraResult } from "@/pipeline/types";
import { isAsyncHook } from "@/hooks/utils/is-async-hook";
import { formatDebugMessage } from "@/pipeline/create/utils/format-debug-message";

/**
 * Creates a generic Rura pipeline instance.
 *
 * This base builder is used by both the synchronous and asynchronous
 * pipeline variants. It manages:
 *
 * - Hook registration
 * - Hook ordering
 * - Hook merging from other pipelines
 * - Executing the pipeline through a provided `runFn` strategy
 *
 * The returned API is fully chainable and does not mutate external state.
 *
 * @param initialHooks - Hooks to seed the pipeline with.
 * @param runFn - A strategy function responsible for executing the pipeline.
 * @returns A pipeline instance exposing `use`, `merge`, `getHooks`, `debugHooks`, and `run`.
 */
export function createPipelineBase<
  Hook extends RuraHook,
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
  options: { name?: string; mode: "sync" | "async" },
) {
  const name = options.name;
  const hooks = initialHooks.map((h) => applyDefaultOrder(h));

  /** Ensures that every hook has a numeric order value. */
  function applyDefaultOrder(h: Hook): Hook {
    return { ...h, order: h.order ?? 0 };
  }

  /** Sorts hooks by ascending order (lower values run first). */
  function sortHooks() {
    hooks.sort((a, b) => a.order! - b.order!);
  }

  /** Registers a new hook into the pipeline. */
  function use(h: Hook) {
    if (options.mode === "sync" && isAsyncHook(h)) {
      throw new Error(`Async hook "${h.name}" is not allowed in createRura().`);
    }

    hooks.push(applyDefaultOrder(h));
    sortHooks();
    return api;
  }

  /** Merges hooks from another pipeline instance. */
  function merge(other: { getHooks(): Hook[] }) {
    other.getHooks().forEach((h) => hooks.push(applyDefaultOrder(h)));
    sortHooks();
    return api;
  }

  /** Returns a sorted shallow copy of all registered hooks. */
  function getHooks() {
    return [...hooks];
  }

  /** Prints the ordered hook list for debugging purposes. */
  function debugHooks(title?: (hooks: Hook[]) => string) {
    formatDebugMessage(hooks, name, title);
  }

  /** Executes the pipeline via the provided strategy function. */
  function run(ctx: Ctx) {
    return runFn(ctx, hooks);
  }

  const api = { use, merge, getHooks, debugHooks, run };
  sortHooks();

  return api;
}
