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
