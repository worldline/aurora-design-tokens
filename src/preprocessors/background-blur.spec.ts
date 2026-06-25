import type { PreprocessedTokens } from 'style-dictionary/types'
import { describe, expect, it } from 'vitest'

import { backgroundBlur } from './background-blur.ts'

describe('backgroundBlur', () => {
  it('should split a mixed shadow & blur token into -shadow and -blur tokens', () => {
    const input: PreprocessedTokens = {
      'overlay-background': {
        $type: 'shadow',
        $value: [
          {
            offsetX: '0px',
            offsetY: '14px',
            blur: '28px',
            spread: '0px',
            color: '{surface.shadow}',
          },
          {
            backgroundBlur: true,
            blur: '16px',
          },
        ],
      },
    }

    const output = backgroundBlur.preprocessor(input)

    expect(output).toEqual({
      'overlay-background-shadow': {
        $type: 'shadow',
        $value: [
          {
            offsetX: '0px',
            offsetY: '14px',
            blur: '28px',
            spread: '0px',
            color: '{surface.shadow}',
          },
        ],
      },
      'overlay-background-blur': {
        $type: 'blur',
        $value: '16px',
      },
    })
  })

  it('should convert a blur-only shadow token to a blur type token', () => {
    const input: PreprocessedTokens = {
      'scrim-blur': {
        $type: 'shadow',
        $value: [
          {
            backgroundBlur: true,
            blur: '24px',
          },
        ],
      },
    }

    const output = backgroundBlur.preprocessor(input)

    expect(output).toEqual({
      'scrim-blur': {
        $type: 'blur',
        $value: '24px',
      },
    })
  })

  it('should handle nested tokens', () => {
    const input: PreprocessedTokens = {
      effects: {
        'overlay-background': {
          $type: 'shadow',
          $value: [
            {
              offsetX: '0px',
              offsetY: '14px',
              blur: '28px',
              spread: '0px',
              color: '{surface.shadow}',
            },
            {
              backgroundBlur: true,
              blur: '16px',
            },
          ],
        },
      },
    }

    const output = backgroundBlur.preprocessor(input)

    expect(output).toEqual({
      effects: {
        'overlay-background-shadow': {
          $type: 'shadow',
          $value: [
            {
              offsetX: '0px',
              offsetY: '14px',
              blur: '28px',
              spread: '0px',
              color: '{surface.shadow}',
            },
          ],
        },
        'overlay-background-blur': {
          $type: 'blur',
          $value: '16px',
        },
      },
    })
  })

  it('should leave shadow tokens without backgroundBlur untouched', () => {
    const input: PreprocessedTokens = {
      'focus-ring': {
        $type: 'shadow',
        $value: [
          {
            offsetX: '0px',
            offsetY: '0px',
            blur: '0px',
            spread: '4px',
            color: '{surface.brand.solid}',
          },
        ],
      },
    }

    const output = backgroundBlur.preprocessor(input)

    expect(output).toEqual(input)
  })

  it('should leave non-shadow tokens untouched', () => {
    const input: PreprocessedTokens = {
      colorPrimary: {
        $type: 'color',
        $value: '#ff0000',
      },
      spacingSmall: {
        $type: 'dimension',
        $value: '8px',
      },
    }

    const output = backgroundBlur.preprocessor(input)

    expect(output).toEqual(input)
  })
})
