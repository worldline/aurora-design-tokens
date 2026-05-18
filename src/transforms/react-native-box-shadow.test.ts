import type { TransformedToken } from 'style-dictionary/types'
import { describe, expect, it } from 'vitest'

import { reactNativeBoxShadow } from './react-native-box-shadow.ts'

describe('reactNativeBoxShadow', () => {
  describe('filter', () => {
    it('should match shadow tokens', () => {
      const token = { $type: 'shadow' } as TransformedToken
      expect(reactNativeBoxShadow.filter(token)).toBe(true)
    })

    it('should not match non-shadow tokens', () => {
      const token = { $type: 'color' } as TransformedToken
      expect(reactNativeBoxShadow.filter(token)).toBe(false)
    })
  })

  describe('transform', () => {
    it('should convert a shadow value to React Native box shadow format', () => {
      const token = {
        $type: 'shadow',
        $value: [
          {
            offsetX: '2px',
            offsetY: '4px',
            blur: '8px',
            spread: '0px',
            color: '#000000',
          },
        ],
      } as TransformedToken

      expect(reactNativeBoxShadow.transform(token)).toEqual([
        {
          offsetX: 2,
          offsetY: 4,
          blurRadius: 8,
          spreadDistance: 0,
          color: '#000000',
        },
      ])
    })

    it('should include inset when defined', () => {
      const token = {
        $type: 'shadow',
        $value: [
          {
            offsetX: '0px',
            offsetY: '2px',
            blur: '4px',
            spread: '1px',
            color: '#ff0000',
            inset: true,
          },
          {
            offsetX: '0px',
            offsetY: '2px',
            blur: '4px',
            spread: '1px',
            color: '#ff0000',
            inset: false,
          },
        ],
      } as TransformedToken

      const result = reactNativeBoxShadow.transform(token)
      expect(result[0].inset).toEqual(true)
      expect(result[1].inset).toEqual(false)
    })

    it('should not include inset when not set', () => {
      const token = {
        $type: 'shadow',
        $value: [
          {
            offsetX: '0px',
            offsetY: '0px',
            blur: '0px',
            spread: '0px',
            color: '#000000',
          },
        ],
      } as TransformedToken

      const result = reactNativeBoxShadow.transform(token)
      expect(result[0]).not.toHaveProperty('inset')
    })

    it('should throw when a shadow value does not contain a number', () => {
      const token = {
        $type: 'shadow',
        path: ['some', 'path'],
        $value: [
          {
            offsetX: 'abc',
            offsetY: '0px',
            blur: '0px',
            spread: '0px',
            color: '#000000',
          },
        ],
      } as TransformedToken
      expect(() => reactNativeBoxShadow.transform(token)).toThrow(
        "Invalid shadow token at path: some.path: Value 'abc' could not be converted to a number.",
      )
    })

    it('should throw when a shadow value is an empty string', () => {
      const token = {
        $type: 'shadow',
        path: ['some', 'path'],
        $value: [
          {
            offsetX: '0px',
            offsetY: '0px',
            blur: '0px',
            spread: '',
            color: '#000000',
          },
        ],
      } as TransformedToken
      expect(() => reactNativeBoxShadow.transform(token)).toThrow(
        "Invalid shadow token at path: some.path: Value '' could not be converted to a number.",
      )
    })
  })
})
