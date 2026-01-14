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

    if (token.$type === 'shadow' && isShadowValue(token.$value)) {
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

const isShadowValue = (value: unknown): value is ShadowItem[] =>
  Array.isArray(value) && value.every(isShadowItem)

const isShadowItem = (value: unknown): value is ShadowItem =>
  typeof value === 'object' &&
  value !== null &&
  'offsetX' in value &&
  'offsetY' in value &&
  'blur' in value &&
  'spread' in value &&
  'color' in value &&
  typeof value.offsetX === 'string' &&
  typeof value.offsetY === 'string' &&
  typeof value.blur === 'string' &&
  typeof value.spread === 'string' &&
  typeof value.color === 'string'

const convertZeroPxToZero = (pxValue: string): string =>
  pxValue === '0px' ? '0' : pxValue
