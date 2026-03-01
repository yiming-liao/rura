import { createHook, createHookAsync } from "./hooks";
import { createPipeline, createPipelineAsync } from "./pipeline/create";
import { run, runAsync } from "./pipeline/run";

/**
 * Rura public API namespace.
 *
 * Provides a cohesive entry point for:
 *
 * - Hook factories (`createHook`, `createHookAsync`)
 * - Direct executors (`run`, `runAsync`)
 * - Pipeline constructors (`createPipeline`, `createPipelineAsync`)
 *
 * This object contains no additional logic —
 * it simply exposes the stable, public surface of Rura.
 *
 * The namespace is frozen to prevent runtime mutation.
 *
 * @public
 */
export const rura = Object.freeze({
  // Hook creation
  createHook,
  createHookAsync,

  // Direct execution
  run,
  runAsync,

  // Pipeline construction
  createPipeline,
  createPipelineAsync,
});
