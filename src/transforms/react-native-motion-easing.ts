import type { Transform, TransformedToken } from 'style-dictionary/types'

export const reactNativeMotionEasing = {
  name: 'reactNativeMotionEasing',
  type: 'value',
  transitive: true,
  filter: (token: TransformedToken) =>
    token.$type === 'string' &&
    token.path[0] === 'motion' &&
    token.path[1] === 'primitive' &&
    token.path[2] === 'easing',
  transform: (token: TransformedToken) => {
    if (typeof token.$value !== 'string') {
      throw new TypeError(
        `Invalid motion easing token at path: ${token.path.join('.')}: expected a string value, but got ${typeof token.$value}`,
      )
    }
    const parts = token.$value.split('(')
    const name = parts[0].trim()
    const controlPoints = parts[1]
      .split(',')
      .map((value) => Number(value.replace(' ', '').replace(')', '')))

    return {
      name: name,
      controlPoints: controlPoints,
    }
  },
} satisfies Transform
