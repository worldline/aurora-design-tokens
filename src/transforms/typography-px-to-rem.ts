import type { TransformedToken } from 'style-dictionary'
import type {
  DesignToken,
  PlatformConfig,
  Transform,
} from 'style-dictionary/types'

export const typographyPxToRem = {
  name: 'typographyPxToRem',
  transitive: true,
  type: 'value',
  filter: (token: TransformedToken) => {
    if (token.$type !== 'dimension') {
      return false
    }
    const tokenPath = token.path.join('.')
    return (
      tokenPath.includes('typography.font-sizes') ||
      tokenPath.includes('typography.line-height')
    )
  },
  transform: (token: DesignToken, platform: PlatformConfig) => {
    const parsedVal = parseFloat(token.$value as string)
    const baseFont: number =
      (platform.basePxFontSize as undefined | number) ?? 16

    if (isNaN(parsedVal)) {
      throw new Error(
        `Invalid value for token ${token.name ?? '""'}: ${String(token.$value)}`,
      )
    }

    return parsedVal === 0 ? '0' : `${String(parsedVal / baseFont)}rem`
  },
} satisfies Transform
