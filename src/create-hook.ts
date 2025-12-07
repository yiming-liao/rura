import type { RuraHook } from "@/types";

/**
 * Creates a pipeline hook.
 *
 * @param name  - Unique name for debugging and inspection.
 * @param run   - Hook implementation.
 * @param order - Optional execution order. Lower values run first.
 *
 * @returns A normalized `RuraHook` object.
 */
export function createHook<Ctx = unknown, Out = unknown>(
  name: string,
  run: RuraHook<Ctx, Out>["run"],
  order?: number,
): RuraHook<Ctx, Out> {
  return { name, run, order };
}
