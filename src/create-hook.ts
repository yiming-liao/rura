import type { Hook } from "@/types";

export function createHook<Context = unknown, Output = unknown>(
  name: string,
  run: Hook<Context, Output>["run"],
  order?: number,
): Hook<Context, Output> {
  return { name, run, order };
}
