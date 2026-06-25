export interface BackgroundBlurItem {
  backgroundBlur: true
  blur: string
}

export interface ShadowItem {
  offsetX: string
  offsetY: string
  blur: string
  spread: string
  color: string
  inset?: boolean
}

export type AnyShadowItem = ShadowItem | BackgroundBlurItem

export const isBackgroundBlurItem = (
  value: unknown,
): value is BackgroundBlurItem =>
  typeof value === 'object' &&
  value !== null &&
  'backgroundBlur' in value &&
  value.backgroundBlur === true

const isStringOrNumber = (v: unknown) =>
  typeof v === 'string' || typeof v === 'number'

const isShadowItem = (value: unknown): value is ShadowItem => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const record = value as Record<string, unknown>
  return (
    isStringOrNumber(record.offsetX) &&
    isStringOrNumber(record.offsetY) &&
    isStringOrNumber(record.blur) &&
    isStringOrNumber(record.spread) &&
    typeof record.color === 'string'
  )
}

export const isAnyShadowValue = (
  value: unknown,
): value is Array<AnyShadowItem> =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((item) => isShadowItem(item) || isBackgroundBlurItem(item))

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
  if (!isShadowItem(value)) {
    if (typeof value !== 'object' || value === null) {
      throw new Error('A shadow item must be an object')
    }
    const valueAsRecord = value as Record<string, unknown>
    const stringOrNumberProps = ['offsetX', 'offsetY', 'blur', 'spread']
    stringOrNumberProps.forEach((prop) => {
      if (!(prop in value) || !isStringOrNumber(valueAsRecord[prop])) {
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
}
