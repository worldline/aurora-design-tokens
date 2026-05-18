import { formats, transformGroups } from 'style-dictionary/enums'
import type { Config, TransformedToken } from 'style-dictionary/types'

import { config } from '../config.ts'
import { typescriptTypes } from '../formats/typescript-types.ts'
import { typography } from '../preprocessors/typography.ts'
import { auroraCssTransformGroup } from '../transforms/aurora-css-transform-group.ts'
import { auroraReactNativeTransformGroup } from '../transforms/aurora-react-native-transform-group.ts'
import { globalsConfig } from './globals.ts'

interface ModeConfig {
  name: string
  selector: string | ReadonlyArray<string>
}

type ConfigFactory = (mode: ModeConfig) => Config

interface ModeDefinition {
  name: string
  configs: ReadonlyArray<ModeConfig>
  configFactory: ConfigFactory
}

const breakpoints = {
  'mobile-xs': 360,
  'mobile-sm': 480,
  tablet: 768,
  'desktop-xs': 1024,
  'desktop-sm': 1280,
  'desktop-md': null,
} as const

const colorModeFactory: ConfigFactory = (mode) => ({
  ...globalsConfig,
  source: [...globalsConfig.source, `tokens/theme.${mode.name}*.json`],
  platforms: {
    css: {
      transformGroup: auroraCssTransformGroup.name,
      buildPath: config.cssBuildPath,
      prefix: config.cssVariablePrefix,
      files: [
        {
          format: formats.cssVariables,
          destination: `${mode.name}.css`,
          filter: (token: TransformedToken) =>
            token.filePath.includes('theme.') ||
            token.filePath.includes('color.'),
          options: {
            outputReferences: true,
            selector: mode.selector,
          },
        },
      ],
    },
    ts: {
      transformGroup: transformGroups.js,
      buildPath: config.typesBuildPath,
      files: [
        {
          format: typescriptTypes.name,
          destination: 'colors.ts',
          options: {
            typeName: 'AuColor',
            prefixToRemove: 'Color',
            type: 'color',
          },
          filter: (token: TransformedToken) =>
            (token.filePath.includes('brand.') ||
              token.filePath.includes('theme.')) &&
            token.$type === 'color',
        },
      ],
    },
    reactNative: {
      transformGroup: auroraReactNativeTransformGroup.name,
      buildPath: config.reactNativeBuildPath,
      files: [
        {
          format: formats.javascriptEsm,
          destination: `${mode.name}.ts`,
          filter: (token: TransformedToken) =>
            token.filePath.includes('theme.') ||
            token.filePath.includes('color.'),
          options: {
            minify: true,
          },
        },
      ],
    },
  },
})

const viewportModeFactory: ConfigFactory = (mode) => ({
  ...globalsConfig,
  source: [
    ...globalsConfig.source,
    `tokens/viewport.${mode.name}*.json`,
    'tokens/text.styles.*.json',
    'tokens/color.*.json',
  ],
  preprocessors: [typography.name],
  platforms: {
    css: {
      transformGroup: auroraCssTransformGroup.name,
      buildPath: config.cssBuildPath,
      prefix: config.cssVariablePrefix,
      files: [
        {
          format: formats.cssVariables,
          destination: `${mode.name}.css`,
          filter: (token: TransformedToken) =>
            token.filePath.includes('viewport.') ||
            token.filePath.includes('text.styles.'),
          options: {
            outputReferences: true,
            selector: mode.selector,
          },
        },
      ],
    },
    ts: {
      transformGroup: transformGroups.js,
      buildPath: config.typesBuildPath,
      files: [
        {
          format: typescriptTypes.name,
          destination: 'typographies.ts',
          options: {
            typeName: 'AuTypography',
            type: 'typography',
          },
          filter: (token: TransformedToken) =>
            token.filePath.includes('text.styles'),
        },
      ],
    },
    reactNative: {
      transformGroup: auroraReactNativeTransformGroup.name,
      buildPath: config.reactNativeBuildPath,
      files: [
        {
          format: formats.javascriptEsm,
          destination: `viewport.${mode.name}.ts`,
          filter: (token: TransformedToken) =>
            token.filePath.includes('viewport.') ||
            token.filePath.includes('text.styles.'),
          options: {
            minify: true,
          },
        },
      ],
    },
  },
})

const highLevelFactory = (theme: string, viewport: string): Config => ({
  ...globalsConfig,
  source: [
    ...globalsConfig.source,
    `tokens/viewport.${viewport}*.json`,
    `tokens/theme.${theme}*.json`,
    'tokens/applied.default.*.json',
    'tokens/dimension.*.json',
    'tokens/text.styles.*.json',
    'tokens/effect.*.json',
  ],
  preprocessors: [typography.name],
  platforms: {
    css: {
      transformGroup: auroraCssTransformGroup.name,
      buildPath: config.cssBuildPath,
      prefix: config.cssVariablePrefix,
      files: [
        {
          format: formats.cssVariables,
          destination: 'high-level.css',
          filter: (token: TransformedToken) =>
            token.filePath.includes('applied.') ||
            token.filePath.includes('effect.'),
          options: {
            outputReferences: true,
            selector: ':root',
          },
        },
      ],
    },
    reactNative: {
      transformGroup: auroraReactNativeTransformGroup.name,
      buildPath: config.reactNativeBuildPath,
      files: [
        {
          format: formats.javascriptEsm,
          destination: `high-level.${theme}.${viewport}.ts`,
          filter: (token: TransformedToken) =>
            token.filePath.includes('applied.') ||
            token.filePath.includes('effect.'),
          options: {
            minify: true,
          },
        },
      ],
    },
  },
})

const modes: ReadonlyArray<ModeDefinition> = [
  {
    name: 'color',
    configs: [
      {
        name: 'light',
        selector: '.light',
      },
      {
        name: 'dark',
        selector: '.dark',
      },
    ],
    configFactory: colorModeFactory,
  },
  {
    name: 'breakpoint',
    configs: Object.entries(breakpoints).map(([name, max], index, entries) => {
      const previousEntry = index > 0 ? entries[index - 1] : null

      const mediaQuery = [
        '@media screen',
        previousEntry?.[1]
          ? `(min-width: ${(previousEntry[1] + 1).toString()}px)`
          : undefined,
        max !== null ? `(max-width: ${max.toString()}px)` : undefined,
      ]
      return {
        name,
        selector: [mediaQuery.filter(Boolean).join(' and '), ':root'],
      }
    }),
    configFactory: viewportModeFactory,
  },
]

const getModeConfigNames = (mode: string) =>
  modes.find((m) => m.name === mode)?.configs.map((c) => c.name) ?? []

const themes = getModeConfigNames('color')
const viewports = getModeConfigNames('breakpoint')

export { modes, highLevelFactory, breakpoints, themes, viewports }
