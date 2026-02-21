export function omitKeys<
  TObject extends object,
  const TKeys extends readonly (keyof TObject)[],
>(
  object: TObject,
  keys: TKeys
): Omit<TObject, TKeys[number]> {
  const result: Partial<TObject> = { ...object }

  for (const key of keys) {
    delete result[key]
  }

  return result as Omit<TObject, TKeys[number]>
}
