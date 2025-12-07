import type { RuraHook } from "@/hooks";
import { createPipelineBase } from "@/pipeline/create/create-pipeline-base";
import * as runAsyncModule from "@/pipeline/run/run-async";

/**
 * Creates an __asynchronous__ Rura pipeline.
 *
 * - Accepts both synchronous and asynchronous hooks.
 * - Hooks are awaited in order using `runAsync()`.
 * - Returns a chainable pipeline instance with `use`, `merge`, `getHooks`, and `run`.
 */
export function createPipelineAsync<Ctx = unknown, Out = unknown>(
  hooks: RuraHook<Ctx, Out>[] = [],
) {
  return createPipelineBase<RuraHook<Ctx, Out>, Ctx, Out, "async">(
    hooks,
    runAsyncModule.runAsync,
    { mode: "async" },
  );
}
