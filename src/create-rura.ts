import type { Hook } from "@/types";
import { runRura } from "@/run-rura";

export function createRura<Context = unknown, Output = unknown>() {
  const hooks: Hook<Context, Output>[] = [];

  function use(hook: Hook<Context, Output>) {
    hooks.push(hook);
    return api;
  }

  function merge(other: ReturnType<typeof createRura<Context, Output>>) {
    other.getHooks().forEach((h) => hooks.push(h));
    return api;
  }

  function getHooks() {
    return hooks;
  }

  async function run(ctx: Context) {
    return runRura<Context, Output>(ctx, hooks);
  }

  const api = { use, merge, getHooks, run };
  return api;
}
