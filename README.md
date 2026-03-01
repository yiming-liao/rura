<h1 align="center">Rura</h1>

<div align="center">

The hook pipeline

</div>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/rura?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/rura)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/rura?style=flat&colorA=000000&colorB=000000)](LICENSE)

</div>

## Features

- **Deterministic** — Strict hook ordering with early termination.
- **Type-safe** — Fully inferred context and output.
- **Composable** — Minimal and framework-agnostic.

## Installation

```bash
npm install rura
# or
yarn add rura
# or
pnpm add rura
```

## Example

```ts
import { rura } from "rura";

// Shared pipeline context.
type Ctx = { count: number };

// Synchronous hook.
const addOne = rura.createHook<Ctx>("add-one", (ctx) => {
  ctx.count += 1;
});

// Synchronous hook (Early-terminating).
const stopIfEven = rura.createHook<Ctx, number>(
  "stop-if-even",
  (ctx) => {
    if (ctx.count % 2 === 0) {
      return { early: true, output: ctx.count };
    }
  },
  2, // optional execution order
);

// Deterministic execution.
const result = rura.run({ count: 1 }, [addOne, stopIfEven, addOne]);
```

Asynchronous variant:

```ts
rura.createHookAsync(...)
rura.runAsync(...)
```

---

## Pipeline Builder

Reusable pipeline instance:

```ts
const pipeline = rura.createPipeline<Ctx>();

pipeline.use(hookA).use(hookB);

const result = pipeline.run({ count: 1 });
```

Asynchronous variant:

```ts
const pipeline = rura.createPipelineAsync<Ctx>();
await pipeline.run(ctx);
```

#### Pipeline Instance API

| Method       | Description                                 | Returns                  |
| ------------ | ------------------------------------------- | ------------------------ |
| **use**      | Registers a hook and re-sorts the pipeline. | `this` (chainable)       |
| **getHooks** | Returns a shallow copy of sorted hooks.     | `Hook[]`                 |
| **logHooks** | Logs hook order and execution type.         | `void`                   |
| **run**      | Executes the pipeline.                      | `RuraResult` / `Promise` |
