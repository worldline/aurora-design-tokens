import type { Transform, TransformedToken } from 'style-dictionary/types'

/**
 * Transform that reverses the order of shadow values.
 * Figma exports shadow layers from outermost to innermost,
 * while CSS expects them from innermost to outermost.
 */
export const reverseShadowOrder = {
  name: 'reverseShadowOrder',
  transitive: true,
  type: 'value',
  filter: (token: TransformedToken) =>
    token.$type === 'shadow' && Array.isArray(token.$value),
  transform: (token: TransformedToken) => {
    if (!Array.isArray(token.$value)) {
      throw new Error(
        `Expected shadow token value to be an array, but got ${typeof token.$value}`,
      )
    }
    return [...(token.$value as Array<unknown>)].reverse()
  },
} satisfies Transform
