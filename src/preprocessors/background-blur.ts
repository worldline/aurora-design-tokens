import type { PreprocessedTokens, Preprocessor } from 'style-dictionary/types'

import {
  isAnyShadowValue,
  isBackgroundBlurItem,
} from '../util/assertions/shadow.ts'

export const backgroundBlur = {
  name: 'background-blur',
  preprocessor: (dictionary) => {
    const splitIfShadowContainsBackgroundBlur = (
      tokens: PreprocessedTokens,
    ): PreprocessedTokens =>
      Object.entries(tokens).reduce<PreprocessedTokens>(
        (acc, [tokenName, tokenValue]) => {
          if (
            typeof tokenValue === 'object' &&
            tokenValue.$type === 'shadow' &&
            isAnyShadowValue(tokenValue.$value)
          ) {
            const containsBothShadowAndBlurItems =
              tokenValue.$value.some(isBackgroundBlurItem) &&
              tokenValue.$value.some((s) => !isBackgroundBlurItem(s))

            const blurItem = tokenValue.$value.find(isBackgroundBlurItem)

            if (containsBothShadowAndBlurItems) {
              const shadowItems = tokenValue.$value.filter(
                (s) => !isBackgroundBlurItem(s),
              )

              return {
                ...acc,
                [`${tokenName}-shadow`]: {
                  ...tokenValue,
                  $value: shadowItems,
                },
                ...(blurItem && {
                  [`${tokenName}-blur`]: {
                    ...tokenValue,
                    $type: 'blur',
                    $value: blurItem.blur,
                  },
                }),
              }
            }

            if (blurItem) {
              return {
                ...acc,
                [tokenName]: {
                  ...tokenValue,
                  $type: 'blur',
                  $value: blurItem.blur,
                },
              }
            }
          }
          if (typeof tokenValue === 'object' && !tokenValue.$type) {
            return {
              ...acc,
              [tokenName]: splitIfShadowContainsBackgroundBlur(tokenValue),
            }
          }
          return {
            ...acc,
            [tokenName]: tokenValue,
          }
        },
        {},
      )
    return splitIfShadowContainsBackgroundBlur(dictionary)
  },
} satisfies Preprocessor
