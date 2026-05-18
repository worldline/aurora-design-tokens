import type { Transform, TransformedToken } from 'style-dictionary/types'

import {
  assertIsShadowValue,
  type ShadowItem,
} from '../util/assertions/shadow.ts'
import { stringToNumber } from '../util/string.ts'

export const reactNativeBoxShadow = {
  name: 'reactNativeBoxShadow',
  transitive: true,
  type: 'value',
  filter: (token: TransformedToken) => token.$type === 'shadow',
  transform: (token: TransformedToken) => {
    try {
      assertIsShadowValue(token.$value)
      return token.$value.map(toBoxShadow)
    } catch (error) {
      throw new Error(
        `Invalid shadow token at path: ${token.path.join('.')}: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      )
    }
  },
} satisfies Transform

const toBoxShadow = (shadow: ShadowItem) => ({
  offsetX: stringToNumber(shadow.offsetX),
  offsetY: stringToNumber(shadow.offsetY),
  blurRadius: stringToNumber(shadow.blur),
  spreadDistance: stringToNumber(shadow.spread),
  color: shadow.color,
  ...(shadow.inset !== undefined ? { inset: shadow.inset } : {}),
})
