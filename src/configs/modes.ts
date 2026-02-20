import { formats, transformGroups } from 'style-dictionary/enums'
import type { Config, TransformedToken } from 'style-dictionary/types'

import { config } from '../config.ts'
import { typescriptTypes } from '../formats/typescript-types.ts'
import { typography } from '../preprocessors/typography.ts'
import { auroraCssTransformGroup } from '../transforms/aurora-css-transform-group.ts'

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

const colorModeFactory: ConfigFactory = (mode) => ({
  ...globalsConfig,
  source: [
    ...globalsConfig.source,
    'tokens/dimensions.*.json',
    `tokens/theme.${mode.name}*.json`,
  ],
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
            prefixToRemove: 'Colors',
          },
          filter: (token: TransformedToken) =>
            (token.filePath.includes('brand.') ||
              token.filePath.includes('theme.')) &&
            token.$type === 'color',
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
      transforms: ['typographyPxToRem'],
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
          },
          filter: (token: TransformedToken) =>
            token.filePath.includes('text.styles'),
        },
      ],
    },
  },
})

const highLevelTokensConfig = {
  ...globalsConfig,
  source: [
    ...globalsConfig.source,
    'tokens/viewport.desktop-md*.json',
    'tokens/theme.light*.json',
    'tokens/applied.default.*.json',
    'tokens/dimensions.*.json',
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
  },
}

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
    configs: [
      {
        name: 'mobile-xs',
        selector: ['@media screen and (max-width: 360px)', ':root'],
      },
      {
        name: 'mobile-sm',
        selector: [
          '@media screen and (min-width: 361px) and (max-width: 480px)',
          ':root',
        ],
      },
      {
        name: 'tablet',
        selector: [
          '@media screen and (min-width: 481px) and (max-width: 768px)',
          ':root',
        ],
      },
      {
        name: 'desktop-xs',
        selector: [
          '@media screen and (min-width: 769px) and (max-width: 1024px)',
          ':root',
        ],
      },
      {
        name: 'desktop-sm',
        selector: [
          '@media screen and (min-width: 1025px) and (max-width: 1280px)',
          ':root',
        ],
      },
      {
        name: 'desktop-md',
        selector: ['@media screen and (min-width: 1281px)', ':root'],
      },
    ],
    configFactory: viewportModeFactory,
  },
]

export { modes, highLevelTokensConfig }
