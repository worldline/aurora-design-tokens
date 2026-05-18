export interface ShadowItem {
  offsetX: string
  offsetY: string
  blur: string
  spread: string
  color: string
  inset?: boolean
}

export const assertIsShadowValue: (
  value: unknown,
) => asserts value is Array<ShadowItem> = (value: unknown) => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error('A shadow value must be a non-empty array')
  }
  value.forEach((item: unknown, index: number) => {
    assertIsShadowItem(item, index)
  })
}

const assertIsShadowItem: (
  value: unknown,
  index: number,
) => asserts value is ShadowItem = (value: unknown, index: number) => {
  const indexAsString = index.toString()
  if (typeof value !== 'object' || value === null) {
    throw new Error('A shadow item must be an object')
  }
  const valueAsRecord = value as Record<string, unknown>

  const stringOrNumberProps = ['offsetX', 'offsetY', 'blur', 'spread']
  stringOrNumberProps.forEach((prop) => {
    if (
      !(prop in value) ||
      (typeof valueAsRecord[prop] !== 'string' &&
        typeof valueAsRecord[prop] !== 'number')
    ) {
      throw new Error(
        `Shadow item at index ${indexAsString} must have a ${prop} property of type string or number`,
      )
    }
  })

  if (!('color' in value) || typeof valueAsRecord.color !== 'string') {
    throw new Error(
      `Shadow item at index ${indexAsString} must have a color property of type string`,
    )
  }
}
