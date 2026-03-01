import type { RuraHook } from "../../hooks";
import { createPipelineBase } from "../../pipeline/create/create-pipeline-base";
import { runAsync } from "../run";

/**
 * Creates an asynchronous Rura pipeline.
 *
 * The returned pipeline:
 * - Executes hooks sequentially using an async strategy.
 * - Accepts any RuraHook, including sync and async variants.
 * - Preserves deterministic ordering based on `order`.
 *
 * This variant guarantees that `run()` returns a Promise.
 *
 * @public
 */
export function createPipelineAsync<Ctx = unknown, Out = unknown>(
  hooks: RuraHook<Ctx, Out>[] = [],
  options?: { name?: string },
) {
  return createPipelineBase<RuraHook<Ctx, Out>, Ctx, Out, "async">(
    hooks,
    runAsync,
    { mode: "async", ...options },
  );
}
