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
            tokenValue.$type === 'typography'
          ) {
            try {
              assertIsTypographyValue(tokenValue.$value)
            } catch (error) {
              throw new Error(
                `Invalid typography token with name: '${tokenName}'. ${error instanceof Error ? error.message : String(error)}`,
              )
            }

            const { letterSpacing, textTransform, textDecoration, ...rest } =
              tokenValue.$value

            const letterSpacingToken =
              letterSpacing !== undefined
                ? { ...tokenValue, $value: letterSpacing, $type: 'dimension' }
                : undefined
            const textTransformToken =
              textTransform !== undefined && textTransform !== 'none'
                ? {
                    ...tokenValue,
                    $value: textTransform,
                    $type: 'textTransform',
                  }
                : undefined
            const textDecorationToken =
              textDecoration !== undefined && textDecoration !== 'none'
                ? {
                    ...tokenValue,
                    $value: textDecoration,
                    $type: 'textDecoration',
                  }
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

const assertIsTypographyValue: (
  value: unknown,
) => asserts value is TypographyTokenValue = (value) => {
  if (typeof value !== 'object' || value === null) {
    throw new Error('A typography value must be an object')
  }
  if (!('fontFamily' in value) || typeof value.fontFamily !== 'string') {
    throw new Error('A typography value must have a fontFamily of type string')
  }
  if (!('fontSize' in value) || typeof value.fontSize !== 'string') {
    throw new Error('A typography value must have a fontSize of type string')
  }
  if (!('fontWeight' in value) || typeof value.fontWeight !== 'number') {
    throw new Error('A typography value must have a fontWeight of type number')
  }
  if (!('lineHeight' in value) || typeof value.lineHeight !== 'string') {
    throw new Error('A typography value must have a lineHeight of type string')
  }
}
