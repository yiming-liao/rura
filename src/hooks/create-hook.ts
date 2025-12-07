import type { RuraHookAsync, RuraHookSync } from "@/hooks/types";

/**
 * Creates a synchronous Rura hook.
 * - The hook will be executed without `await`.
 * - Suitable for lightweight, purely synchronous operations.
 */
export function createHook<Ctx = unknown, Out = unknown>(
  name: string,
  run: RuraHookSync<Ctx, Out>["run"],
  order?: number,
): RuraHookSync<Ctx, Out> {
  return { name, run, order };
}

/**
 * Creates an asynchronous Rura hook.
 * - The hook will be awaited during pipeline execution.
 * - Suitable for I/O, timers, or any async workflow.
 */
export function createHookAsync<Ctx = unknown, Out = unknown>(
  name: string,
  run: RuraHookAsync<Ctx, Out>["run"],
  order?: number,
): RuraHookAsync<Ctx, Out> {
  return { name, run, order };
}
