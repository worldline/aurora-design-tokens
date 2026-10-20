const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isArray = (value: unknown): value is Array<unknown> =>
  Array.isArray(value)

export const deeplyMapKeys = <T extends Record<string, unknown>>(
  value: T,
  fn: (key: string) => string,
): T =>
  Object.fromEntries(
    Object.entries(value).map(([k, v]) => [
      fn(k),
      isArray(v)
        ? v.map((item) => (isRecord(item) ? deeplyMapKeys(item, fn) : item))
        : isRecord(v)
          ? deeplyMapKeys(v, fn)
          : v,
    ]),
  ) as T

export const deepMerge = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): Record<string, unknown> => {
  const merge = (
    left: Record<string, unknown>,
    right: Record<string, unknown>,
    path: ReadonlyArray<string>,
  ): Record<string, unknown> => {
    const result = { ...left }
    for (const [key, value] of Object.entries(right)) {
      const existing = result[key]
      if (isRecord(existing) && isRecord(value)) {
        result[key] = merge(existing, value, [...path, key])
      } else if (key in result) {
        throw new Error(`Token collision at ${[...path, key].join('.')}`)
      } else {
        result[key] = value
      }
    }
    return result
  }
  return merge(a, b, [])
}
