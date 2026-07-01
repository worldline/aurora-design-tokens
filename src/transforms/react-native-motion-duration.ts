import type { Transform, TransformedToken } from 'style-dictionary/types'

import { stringToNumber } from '../util/string.ts'

export const reactNativeMotionDuration = {
  name: 'reactNativeMotionDuration',
  type: 'value',
  transitive: true,
  filter: (token: TransformedToken) =>
    token.path[0] === 'motion' && token.path[2] === 'duration',
  transform: (token: TransformedToken) => {
    if (typeof token.$value === 'number') {
      return token.$value
    }

    if (typeof token.$value !== 'string') {
      throw new TypeError(
        `Invalid motion duration token at path: ${token.path.join('.')}: expected a string value, but got ${typeof token.$value}`,
      )
    }

    if (!token.$value.trim().endsWith('ms')) {
      throw new TypeError(
        `Invalid motion duration token at path: ${token.path.join('.')}: expected a duration value in milliseconds (e.g. "150ms"), but got "${token.$value}"`,
      )
    }

    return stringToNumber(token.$value)
  },
} satisfies Transform
