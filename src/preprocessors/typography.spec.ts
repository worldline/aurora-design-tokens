import type { PreprocessedTokens } from 'style-dictionary/types'
import { describe, it, expect } from 'vitest'

import { typography } from './typography.ts'

describe('typography', () => {
  it('should split typography tokens with object values', () => {
    const input: PreprocessedTokens = {
      heading: {
        $type: 'typography',
        $value: {
          fontFamily: 'Arial',
          fontSize: '2rem',
          fontWeight: 700,
          letterSpacing: '{variable}',
          lineHeight: '1.5',
          textTransform: 'uppercase',
          textDecoration: 'underline',
        },
      },
      body: {
        $type: 'typography',
        $value: {
          fontFamily: 'Arial',
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '{variable}',
          lineHeight: '1.5',
          textTransform: 'lowercase',
          textDecoration: 'strikethrough',
        },
      },
    }

    const output = typography.preprocessor(input)

    expect(output).toEqual({
      heading: {
        $type: 'typography',
        $value: {
          fontFamily: 'Arial',
          fontSize: '2rem',
          fontWeight: 700,
          lineHeight: '1.5',
        },
      },
      'heading.letterSpacing': {
        $type: 'dimension',
        $value: '{variable}',
      },
      'heading.textTransform': { $type: 'textTransform', $value: 'uppercase' },
      'heading.textDecoration': {
        $type: 'textDecoration',
        $value: 'underline',
      },
      body: {
        $type: 'typography',
        $value: {
          fontFamily: 'Arial',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: '1.5',
        },
      },
      'body.letterSpacing': {
        $type: 'dimension',
        $value: '{variable}',
      },
      'body.textTransform': { $type: 'textTransform', $value: 'lowercase' },
      'body.textDecoration': {
        $type: 'textDecoration',
        $value: 'strikethrough',
      },
    })
  })

  it('should split nested typography tokens with object values', () => {
    const input: PreprocessedTokens = {
      group: {
        heading: {
          $type: 'typography',
          $value: {
            fontFamily: 'Arial',
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '{variable}',
            lineHeight: '1.5',
            textTransform: 'uppercase',
            textDecoration: 'underline',
          },
        },
      },
    }

    const output = typography.preprocessor(input)

    expect(output).toEqual({
      group: {
        heading: {
          $type: 'typography',
          $value: {
            fontFamily: 'Arial',
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: '1.5',
          },
        },
        'heading.letterSpacing': {
          $type: 'dimension',
          $value: '{variable}',
        },
        'heading.textTransform': {
          $type: 'textTransform',
          $value: 'uppercase',
        },
        'heading.textDecoration': {
          $type: 'textDecoration',
          $value: 'underline',
        },
      },
    })
  })

  it('should filter out unnecessary textTransform and textDecoration tokens', () => {
    const input: PreprocessedTokens = {
      caption: {
        $type: 'typography',
        $value: {
          fontFamily: 'Arial',
          fontSize: '0.875rem',
          fontWeight: 400,
          letterSpacing: '{variable}',
          lineHeight: '1.25',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
    }

    const output = typography.preprocessor(input)

    expect(output).toEqual({
      caption: {
        $type: 'typography',
        $value: {
          fontFamily: 'Arial',
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: '1.25',
        },
      },
      'caption.letterSpacing': {
        $type: 'dimension',
        $value: '{variable}',
      },
    })
  })

  it('should throw an error for invalid typography token value', () => {
    const input: PreprocessedTokens = {
      invalidTypography: {
        $type: 'typography',
        $value: {
          fontFamily: 'Arial',
          fontSize: '2rem',
          fontWeight: '700',
          letterSpacing: '{variable}',
          lineHeight: '1.5',
        },
      },
    }

    expect(() => typography.preprocessor(input)).toThrow(
      "Invalid typography token with name: 'invalidTypography'. A typography value must have a fontWeight of type number",
    )
  })

  it('should leave non-typography tokens untouched', () => {
    const input: PreprocessedTokens = {
      colorPrimary: {
        $type: 'color',
        $value: '#ff0000',
      },
      spacingSmall: {
        $type: 'dimension',
        $value: '8px',
      },
      nested: {
        colorSecondary: {
          $type: 'color',
          $value: '#00ff00',
        },
      },
    }

    const output = typography.preprocessor(input)

    expect(output).toEqual({
      colorPrimary: {
        $type: 'color',
        $value: '#ff0000',
      },
      spacingSmall: {
        $type: 'dimension',
        $value: '8px',
      },
      nested: {
        colorSecondary: {
          $type: 'color',
          $value: '#00ff00',
        },
      },
    })
  })
})
