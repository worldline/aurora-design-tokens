import type { TransformedToken } from 'style-dictionary'
import type {
  DesignToken,
  PlatformConfig,
  Transform,
} from 'style-dictionary/types'

import { stringToNumber } from '../util/string.ts'

export const fontsPxToRem = {
  name: 'fontsPxToRem',
  transitive: true,
  type: 'value',
  filter: (token: TransformedToken) => {
    if (token.$type !== 'dimension') {
      return false
    }
    const tokenPath = token.path.join('.')
    return (
      tokenPath.startsWith('font-size') || tokenPath.startsWith('line-height')
    )
  },
  transform: (token: DesignToken, platform: PlatformConfig) => {
    let parsedVal: number
    try {
      parsedVal = stringToNumber(token.$value as string)
    } catch (error) {
      throw new Error(
        `Invalid value for token ${token.name ?? '""'}: ${String(token.$value)}`,
        { cause: error },
      )
    }
    const baseFont: number =
      (platform.basePxFontSize as undefined | number) ?? 16

    return parsedVal === 0 ? '0' : `${String(parsedVal / baseFont)}rem`
  },
} satisfies Transform
