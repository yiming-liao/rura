import type { Hook } from "@/types";
import { runRura } from "@/run-rura";

export function createRura<Context = unknown, Output = unknown>(
  initialHooks: Hook<Context, Output>[] = [],
) {
  const hooks = [...initialHooks].map((el) => applyDefaultOrder(el));

  /** Ensure hook has a default order */
  function applyDefaultOrder(h: Hook<Context, Output>): Hook<Context, Output> {
    return { ...h, order: h.order ?? 0 };
  }

  /** Sort hooks by .order */
  function sortHooks() {
    hooks.sort((a, b) => a.order! - b.order!);
  }

  /** Add a new hook */
  function use(hook: Hook<Context, Output>) {
    hooks.push(applyDefaultOrder(hook));
    sortHooks();
    return api;
  }

  /** Merge hooks from another Rura */
  function merge(other: ReturnType<typeof createRura<Context, Output>>) {
    other.getHooks().forEach((h) => hooks.push(applyDefaultOrder(h)));
    sortHooks();
    return api;
  }

  /** Always return sorted hooks */
  function getHooks() {
    return [...hooks];
  }

  /** Pretty debug output */
  function debugHooks() {
    console.log(`\n💧 Rura Pipeline (${hooks.length} hooks)`);
    console.log("───");
    hooks.forEach(({ name, order }, i) => {
      const paddedOrder = String(order).padStart(4, " ");
      console.log(`${i + 1}. order: ${paddedOrder} | name: ${name}`);
    });
    console.log("───\n");
  }

  /** Run pipeline (no sorting here anymore) */
  async function run(ctx: Context) {
    return runRura<Context, Output>(ctx, hooks);
  }

  const api = { use, merge, getHooks, debugHooks, run };
  sortHooks(); // Sort once at initialization

  return api;
}
