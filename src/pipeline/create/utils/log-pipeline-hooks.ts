import { type RuraHook } from "../../../hooks";
import { isAsyncHook } from "../../../hooks/utils/is-async-hook";

/**
 * Logs pipeline hook ordering and execution kind.
 *
 * @internal
 */
export function logPipelineHooks(hooks: RuraHook[], name = "Rura"): void {
  const count = hooks.length;
  const suffix = count === 1 ? "hook" : "hooks";

  console.log(`${name} (${count} ${suffix})`);

  console.log("───");

  hooks.forEach((hook, i) => {
    const kind = isAsyncHook(hook) ? "async" : "sync";
    const order = hook.order ?? "-";

    console.log(
      `${i + 1}. order: ${String(order).padEnd(4)} | ${hook.name} (${kind})`,
    );
  });

  console.log("───");
}
