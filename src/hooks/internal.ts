/**
 * Runtime marker used to identify asynchronous hooks.
 *
 * This symbol is attached internally by `createHookAsync`
 * and consumed by the pipeline for deterministic async detection.
 *
 * @internal
 */
export const ASYNC_HOOK = Symbol("rura.async");
