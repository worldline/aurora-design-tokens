import type { TransformedToken } from 'style-dictionary'
import type { Transform } from 'style-dictionary/types'

import { stringToNumber } from '../util/string.ts'

export const stripUnit = {
  name: 'stripUnit',
  transitive: true,
  type: 'value',
  filter: (token: TransformedToken) => token.$type === 'dimension',
  transform: (token: TransformedToken) => {
    if (typeof token.$value === 'string') {
      try {
        return stringToNumber(token.$value)
      } catch (error) {
        throw new Error(
          `Invalid token at path: ${token.path.join('.')}: ${error instanceof Error ? error.message : String(error)}`,
          { cause: error },
        )
      }
    }
    return token.$value as unknown
  },
} satisfies Transform
