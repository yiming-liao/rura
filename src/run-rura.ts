import type { Hook } from "@/types";
import { isDone } from "@/is-done";

export async function runRura<Context = unknown, Output = unknown>(
  ctx: Context,
  hooks: Hook<Context, Output>[],
): Promise<Output | Context> {
  hooks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  for (const hook of hooks) {
    const result = await hook.run(ctx);

    if (isDone<Output>(result)) {
      return result.output;
    }
  }

  return ctx;
}
