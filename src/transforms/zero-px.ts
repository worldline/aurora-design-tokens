import type { Transform, TransformedToken } from 'style-dictionary/types'

import { assertIsShadowValue } from '../util/assertions/shadow.ts'

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
          { cause: error },
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

const convertZeroPxToZero = (pxValue: string): string =>
  pxValue === '0px' ? '0' : pxValue
