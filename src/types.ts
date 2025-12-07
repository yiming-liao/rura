export type MaybePromise<T> = T | Promise<T>;

export interface Done<Output> {
  done: true;
  output: Output;
}

export interface Hook<Context = unknown, Output = unknown> {
  name: string;
  order?: number;
  run(ctx: Context): MaybePromise<void | Done<Output>>;
}
