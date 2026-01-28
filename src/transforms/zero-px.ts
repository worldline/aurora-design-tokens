import type { Transform, TransformedToken } from 'style-dictionary/types'

interface ShadowItem {
  offsetX: string
  offsetY: string
  blur: string
  spread: string
  color: string
  inset?: boolean
}

export const zeroPx = {
  type: 'value',
  transitive: true,
  name: 'zeroPx',
  filter: (token) => token.$type === 'dimension' || token.$type === 'shadow',
  transform: (token: TransformedToken) => {
    if (token.$type === 'dimension' && isStringValue(token.$value)) {
      return convertZeroPxToZero(token.$value)
    }

    if (token.$type === 'shadow') {
      try {
        assertIsShadowValue(token.$value)
      } catch (error) {
        throw new Error(
          `Invalid shadow token at path: ${token.path.join('.')}: ${error instanceof Error ? error.message : String(error)}`,
        )
      }

      return token.$value.map((shadow) => ({
        ...shadow,
        offsetX: convertZeroPxToZero(shadow.offsetX),
        offsetY: convertZeroPxToZero(shadow.offsetY),
        blur: convertZeroPxToZero(shadow.blur),
        spread: convertZeroPxToZero(shadow.spread),
      }))
    }

    return token.$value as string
  },
} satisfies Transform

const isStringValue = (value: unknown): value is string =>
  typeof value === 'string'

const assertIsShadowValue: (value: unknown) => asserts value is ShadowItem[] = (
  value: unknown,
) => {
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
  const requiredProps = ['offsetX', 'offsetY', 'blur', 'spread', 'color']
  requiredProps.forEach((prop) => {
    if (
      !(prop in value) ||
      typeof (value as Record<string, unknown>)[prop] !== 'string'
    ) {
      throw new Error(
        `Shadow item at index ${indexAsString} must have a ${prop} property of type string`,
      )
    }
  })
}

const convertZeroPxToZero = (pxValue: string): string =>
  pxValue === '0px' ? '0' : pxValue
