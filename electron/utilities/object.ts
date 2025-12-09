export const objectEntries = <T extends Record<string, any>>(obj: T): [keyof T, T[keyof T]][] =>
  Object.entries(obj) as [keyof T, T[keyof T]][];

export const objectKeys = <T extends Record<string, any>>(obj: T): (keyof T)[] =>
  Object.keys(obj) as (keyof T)[];

export const objectValues = <T extends Record<string, any>>(obj: T): (T[keyof T])[] =>
  Object.values(obj) as (T[keyof T])[];

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type DeepMerge<T, U> =
  T extends object
    ? U extends object
      ? {
          [K in keyof T | keyof U]:
            K extends keyof U
              ? K extends keyof T
                ? DeepMerge<T[K], U[K]>
                : U[K]
              : K extends keyof T
                ? T[K]
                : never;
        }
      : U
    : U;

export function deepMerge<T extends object, U extends object>(
  original: T,
  overwrite: U
): DeepMerge<U, T> {
  for (const key in overwrite) {
    const newValue = overwrite[key];
    const oldValue = (original as any)[key];

    if (isObject(newValue) && isObject(oldValue)) {
      deepMerge(oldValue, newValue);
    } else {
      (original as any)[key] = newValue;
    }
  }

  return original as DeepMerge<U, T>;
};

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
};
