export function isNonNullable<TValue>(
  value: TValue | undefined | null
): value is TValue {
  return value !== null && value !== undefined;
}

export type ArrayItemType<T> = T extends (infer U)[] ? U : T;
export type DictionaryValueType<T> = T extends {
  [index: string]: infer U;
}
  ? U
  : T;
