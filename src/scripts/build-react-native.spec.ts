import { describe, expect, it } from 'vitest'

import { breakpoints } from '../configs/modes.ts'
import { buildTokens, mergeViewports } from './build-react-native.ts'

describe('build-react-native', () => {
  describe('mergeViewports', () => {
    it('should collapse a leaf value that is the same across all viewports', () => {
      const result = mergeViewports([
        { viewport: 'mobile', tokens: { color: '#000' } },
        { viewport: 'desktop', tokens: { color: '#000' } },
      ])
      expect(result).toEqual({ color: '#000' })
    })

    it('should expand a leaf value that differs across viewports', () => {
      const result = mergeViewports([
        { viewport: 'mobile', tokens: { 'font-size': 14 } },
        { viewport: 'desktop', tokens: { 'font-size': 16 } },
      ])
      expect(result).toEqual({ 'font-size': { mobile: 14, desktop: 16 } })
    })

    it('should recurse into nested objects', () => {
      const result = mergeViewports([
        { viewport: 'mobile', tokens: { spacing: { md: 12, lg: 24 } } },
        { viewport: 'desktop', tokens: { spacing: { md: 16, lg: 32 } } },
      ])
      expect(result).toEqual({
        spacing: {
          md: { mobile: 12, desktop: 16 },
          lg: { mobile: 24, desktop: 32 },
        },
      })
    })

    it('should expand a key that only exists in some viewports, using undefined for the rest', () => {
      const result = mergeViewports([
        { viewport: 'mobile', tokens: { color: '#000', 'font-size': 14 } },
        { viewport: 'desktop', tokens: { color: '#000' } },
      ])
      expect(result).toEqual({
        color: '#000',
        'font-size': { mobile: 14, desktop: undefined },
      })
    })

    it('should expand differing array values per viewport', () => {
      const result = mergeViewports([
        { viewport: 'mobile', tokens: { shadow: ['0px 2px 4px #000'] } },
        {
          viewport: 'desktop',
          tokens: { shadow: ['0px 2px 4px #000', '0px 4px 8px #000'] },
        },
      ])
      expect(result).toEqual({
        shadow: {
          mobile: ['0px 2px 4px #000'],
          desktop: ['0px 2px 4px #000', '0px 4px 8px #000'],
        },
      })
    })

    it('should collapse equal array values into a single value', () => {
      const result = mergeViewports([
        { viewport: 'mobile', tokens: { shadow: ['0px 2px 4px #000'] } },
        { viewport: 'desktop', tokens: { shadow: ['0px 2px 4px #000'] } },
      ])
      expect(result).toEqual({ shadow: ['0px 2px 4px #000'] })
    })

    it('should collapse nested keys that are equal while expanding those that differ', () => {
      const result = mergeViewports([
        {
          viewport: 'mobile',
          tokens: { typography: { 'font-family': 'Inter', 'font-size': 14 } },
        },
        {
          viewport: 'desktop',
          tokens: { typography: { 'font-family': 'Inter', 'font-size': 16 } },
        },
      ])
      expect(result).toEqual({
        typography: {
          'font-family': 'Inter',
          'font-size': { mobile: 14, desktop: 16 },
        },
      })
    })
  })

  describe('buildTokens', () => {
    it('should return an object with global, themes, and breakpoints keys', () => {
      const result = buildTokens({}, [], [], [])
      expect(Object.keys(result)).toEqual(['global', 'themes', 'breakpoints'])
    })

    it('should convert kebab-case keys to camelCase throughout', () => {
      const result = buildTokens(
        { 'font-size': 16 },
        [{ color: 'light', tokens: { 'primary-color': '#fff' } }],
        [],
        [
          {
            color: 'light',
            viewport: 'mobile',
            tokens: { 'line-height': 20 },
          },
          {
            color: 'light',
            viewport: 'desktop',
            tokens: { 'line-height': 24 },
          },
        ],
      )
      expect(result.global).toEqual({ fontSize: 16 })
      expect(result.themes.light).toMatchObject({
        primaryColor: '#fff',
        lineHeight: { mobile: 20, desktop: 24 },
      })
    })

    it('should merge color tokens with high-level viewport tokens per theme', () => {
      const result = buildTokens(
        {},
        [{ color: 'light', tokens: { color: '#fff' } }],
        [],
        [
          {
            color: 'light',
            viewport: 'mobile',
            tokens: { 'font-size': 14 },
          },
          {
            color: 'light',
            viewport: 'desktop',
            tokens: { 'font-size': 16 },
          },
        ],
      )
      expect(result.themes.light).toEqual({
        color: '#fff',
        fontSize: { mobile: 14, desktop: 16 },
      })
    })

    it('should only apply high-level tokens to the matching color mode', () => {
      const result = buildTokens(
        {},
        [
          { color: 'light', tokens: {} },
          { color: 'dark', tokens: {} },
        ],
        [],
        [
          { color: 'light', viewport: 'mobile', tokens: { elevation: 1 } },
          { color: 'dark', viewport: 'mobile', tokens: { elevation: 2 } },
        ],
      )
      expect(result.themes.light).toEqual({ elevation: 1 })
      expect(result.themes.dark).toEqual({ elevation: 2 })
    })

    it('should pass global tokens through to the output', () => {
      const result = buildTokens({ color: '#000', radius: 4 }, [], [], [])
      expect(result.global).toEqual({ color: '#000', radius: 4 })
    })

    it('should include the breakpoints from config with camelCased keys', () => {
      const result = buildTokens({}, [], [], [])
      expect(result.breakpoints).toEqual({
        mobileXs: breakpoints['mobile-xs'],
        mobileSm: breakpoints['mobile-sm'],
        tablet: breakpoints.tablet,
        desktopXs: breakpoints['desktop-xs'],
        desktopSm: breakpoints['desktop-sm'],
        desktopMd: breakpoints['desktop-md'],
      })
    })

    it('should include all color modes in themes', () => {
      const result = buildTokens(
        {},
        [
          { color: 'light', tokens: { color: '#fff' } },
          { color: 'dark', tokens: { color: '#000' } },
        ],
        [],
        [],
      )
      expect(Object.keys(result.themes)).toEqual(['light', 'dark'])
    })
  })
})
