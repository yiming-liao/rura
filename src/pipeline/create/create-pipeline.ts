import { type RuraHookSync } from "../../hooks";
import { createPipelineBase } from "../../pipeline/create/create-pipeline-base";
import { run } from "../run";

/**
 * Creates a synchronous Rura pipeline.
 *
 * The returned pipeline:
 * - Executes hooks sequentially using a synchronous strategy.
 * - Rejects asynchronous hooks at registration time.
 * - Preserves deterministic ordering based on `order`.
 *
 * This variant guarantees that `run()` returns immediately
 * without producing a Promise.
 *
 * @public
 */
export function createPipeline<Ctx = unknown, Out = unknown>(
  hooks: RuraHookSync<Ctx, Out>[] = [],
  options?: { name?: string },
) {
  return createPipelineBase<RuraHookSync<Ctx, Out>, Ctx, Out, "sync">(
    hooks,
    run,
    { mode: "sync", ...options },
  );
}
