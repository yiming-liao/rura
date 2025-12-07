import type { RuraHook } from "@/types";
import { runRura } from "@/run-rura";

/**
 * Creates a reusable pipeline instance.
 * Hooks can be registered, merged, inspected, and executed in order.
 *
 * @param initialHooks - Optional list of hooks to initialize the pipeline with.
 *
 * @returns An API for managing and running the pipeline.
 */
export function createRura<Ctx = unknown, Out = unknown>(
  initialHooks: RuraHook<Ctx, Out>[] = [],
) {
  const hooks = [...initialHooks].map((h) => applyDefaultOrder(h));

  /** Ensures that every hook has a numeric order value. */
  function applyDefaultOrder(h: RuraHook<Ctx, Out>): RuraHook<Ctx, Out> {
    return { ...h, order: h.order ?? 0 };
  }

  /** Sorts hooks by ascending order. */
  function sortHooks() {
    hooks.sort((a, b) => a.order! - b.order!);
  }

  /** Registers a new hook. */
  function use(hook: RuraHook<Ctx, Out>) {
    hooks.push(applyDefaultOrder(hook));
    sortHooks();
    return api;
  }

  /** Merges hooks from another Rura instance. */
  function merge(other: ReturnType<typeof createRura<Ctx, Out>>) {
    other.getHooks().forEach((h) => hooks.push(applyDefaultOrder(h)));
    sortHooks();
    return api;
  }

  /** Returns a sorted shallow copy of all hooks. */
  function getHooks() {
    return [...hooks];
  }

  /** Prints a readable list of registered hooks. */
  function debugHooks() {
    console.log(`\n💧 Rura Pipeline (${hooks.length} hooks)`);
    console.log("───");
    hooks.forEach(({ name, order }, i) => {
      const paddedOrder = String(order).padStart(4, " ");
      console.log(`${i + 1}. order: ${paddedOrder} | name: ${name}`);
    });
    console.log("───\n");
  }

  /** Executes the pipeline. */
  async function run(ctx: Ctx) {
    return runRura<Ctx, Out>(ctx, hooks);
  }

  const api = { use, merge, getHooks, debugHooks, run };
  sortHooks();

  return api;
}
