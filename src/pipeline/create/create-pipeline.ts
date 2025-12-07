import { type RuraHook } from "@/hooks";
import { createPipelineBase } from "@/pipeline/create/create-pipeline-base";
import * as runModule from "@/pipeline/run/run";

/**
 * Creates a __synchronous__ Rura pipeline.
 *
 * - Only synchronous hooks are allowed.
 * - Hooks are executed in order using `run()`.
 * - Returns a chainable pipeline instance with `use`, `merge`, `getHooks`, and `run`.
 */
export function createPipeline<Ctx = unknown, Out = unknown>(
  hooks: RuraHook<Ctx, Out>[] = [],
) {
  return createPipelineBase<RuraHook<Ctx, Out>, Ctx, Out, "sync">(
    hooks,
    runModule.run,
    { mode: "sync" },
  );
}
