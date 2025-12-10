import type { RuraHook } from "@/hooks";
import { isAsyncHook } from "@/hooks/utils/is-async-hook";

export const formatDebugMessage = <Hook extends RuraHook>(
  hooks: Hook[],
  name?: string,
  title?: (hooks: Hook[]) => string,
) => {
  if (title) {
    console.log(`\n${title(hooks)}`);
  } else {
    const label = name ? ` <${name}>` : "";
    console.log(`\n🌊 Rura Pipeline${label} (${hooks.length} hooks)`);
  }

  console.log(`───`);

  hooks.forEach((hook, i) => {
    const kind = isAsyncHook(hook) ? "async" : "sync";
    console.log(
      `${i + 1}. order:${String(hook.order).padStart(4)} | ${hook.name} (${kind})`,
    );
  });

  console.log(`───\n`);
};
