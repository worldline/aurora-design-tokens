import type { TransformedToken } from 'style-dictionary'
import type { Transform } from 'style-dictionary/types'

import { stringToNumber } from '../util/string.ts'

/**
 * The conversion is borrowed from Expo's BlurView implementation for web where intensity
 * is converted to pixels. Here we do an inverse conversion from pixels to intensity.
 *
 * There is no perfect mapping between the two but this should be close enough.
 */
const EXPO_BLUR_MULTIPLIER = 1.25

export const blurIntensity = {
  name: 'blurIntensity',
  transitive: true,
  type: 'value',
  filter: (token: TransformedToken) => token.$type === 'blur',
  transform: (token: TransformedToken) => {
    try {
      const blurValue = getBlurValue(token)
      return Math.min(Math.round(blurValue * EXPO_BLUR_MULTIPLIER), 100)
    } catch (error) {
      throw new Error(
        `Invalid blur token at path: ${token.path.join('.')}: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      )
    }
  },
} satisfies Transform

const getBlurValue = (token: TransformedToken) => {
  if (typeof token.$value === 'number') {
    return token.$value
  }
  if (typeof token.$value === 'string') {
    return stringToNumber(token.$value)
  }
  throw new Error('Expected blur value to be number or string')
}
