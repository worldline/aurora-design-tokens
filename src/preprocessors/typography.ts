import type { PreprocessedTokens, Preprocessor } from 'style-dictionary/types'

interface TypographyTokenValue {
  fontFamily: string
  fontSize: string
  fontWeight: string
  lineHeight: string
  letterSpacing: string | undefined
  textTransform: string | undefined
  textDecoration: string | undefined
}

export const typography = {
  name: 'typography',
  preprocessor: (dictionary) => {
    const splitIfTypographyObject = (
      tokens: PreprocessedTokens,
    ): PreprocessedTokens =>
      Object.entries(tokens).reduce<PreprocessedTokens>(
        (inputTokens, [tokenName, tokenValue]) => {
          if (
            typeof tokenValue === 'object' &&
            tokenValue.$type === 'typography' &&
            isTypographyTokenValue(tokenValue.$value)
          ) {
            const { letterSpacing, textTransform, textDecoration, ...rest } =
              tokenValue.$value

            const letterSpacingToken =
              letterSpacing !== undefined
                ? { ...tokenValue, $value: letterSpacing }
                : undefined
            const textTransformToken =
              textTransform !== undefined && textTransform !== 'none'
                ? { ...tokenValue, $value: textTransform }
                : undefined
            const textDecorationToken =
              textDecoration !== undefined && textDecoration !== 'none'
                ? { ...tokenValue, $value: textDecoration }
                : undefined

            return {
              ...inputTokens,
              [tokenName]: {
                ...tokenValue,
                $value: rest,
              },
              ...(letterSpacingToken && {
                [`${tokenName}.letterSpacing`]: letterSpacingToken,
              }),
              ...(textTransformToken && {
                [`${tokenName}.textTransform`]: textTransformToken,
              }),
              ...(textDecorationToken && {
                [`${tokenName}.textDecoration`]: textDecorationToken,
              }),
            }
          }
          if (typeof tokenValue === 'object' && !tokenValue.$type) {
            return {
              ...inputTokens,
              [tokenName]: splitIfTypographyObject(
                tokenValue as PreprocessedTokens,
              ),
            }
          }
          return {
            ...inputTokens,
            [tokenName]: tokenValue,
          }
        },
        {},
      )
    return splitIfTypographyObject(dictionary)
  },
} satisfies Preprocessor

const isTypographyTokenValue = (
  value: unknown,
): value is TypographyTokenValue =>
  typeof value === 'object' &&
  value !== null &&
  'fontFamily' in value &&
  typeof value.fontFamily === 'string' &&
  'fontSize' in value &&
  typeof value.fontSize === 'string' &&
  'fontWeight' in value &&
  typeof value.fontWeight === 'string' &&
  'lineHeight' in value &&
  typeof value.lineHeight === 'string'
