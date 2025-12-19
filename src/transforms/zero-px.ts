import type { Transform, TransformedToken } from 'style-dictionary/types'

export const zeroPx = {
  type: 'value',
  transitive: true,
  name: 'zeroPx',
  filter: (token) => token.$type === 'dimension',
  transform: (token: TransformedToken) => {
    if (token.$value === '0px') {
      return '0'
    }
    return token.$value as string
  },
} satisfies Transform
