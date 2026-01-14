import { formats, transformGroups } from 'style-dictionary/enums'
import type { Config, TransformedToken } from 'style-dictionary/types'

import { config } from '../config.ts'
import { typescriptTypes } from '../formats/typescript-types.ts'
import { typography } from '../preprocessors/typography.ts'
import { auroraCssTransformGroup } from '../transforms/aurora-css-transform-group.ts'

import { globalsConfig } from './globals.ts'

interface ModeConfig {
  name: string
  selector?: string | ReadonlyArray<string>
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
    'tokens/applied.default.*.json',
    'tokens/effect.styles.*.json',
    'tokens/dimensions.*.json',
    'tokens/typography.*.json',
    `tokens/colors.${mode.name}*.json`,
  ],
  platforms: {
    css: {
      transformGroup: auroraCssTransformGroup.name,
      buildPath: config.cssBuildPath,
      prefix: config.cssVariablePrefix,
      preprocessors: [typography.name],
      files: [
        {
          format: formats.cssVariables,
          destination: `${mode.name}.css`,
          filter: (token: TransformedToken) =>
            token.filePath.includes('colors.') ||
            token.filePath.includes('applied.default.') ||
            token.filePath.includes('effect.styles.'),
          options: {
            outputReferences: true,
            selector: mode.selector ?? ':root',
          },
        },
      ],
    },
    ts: {
      transformGroup: transformGroups.js,
      buildPath: config.cssBuildPath,
      files: [
        {
          format: typescriptTypes.name,
          destination: 'colors.ts',
          options: {
            typeName: 'AuColor',
          },
          filter: (token: TransformedToken) =>
            token.filePath.includes('colors.'),
        },
      ],
    },
  },
})

const viewportModeFactory: ConfigFactory = (mode) => ({
  ...globalsConfig,
  source: [
    ...globalsConfig.source,
    `tokens/dimensions.${mode.name}.*.json`,
    `tokens/typography.${mode.name}.*.json`,
    'tokens/text.styles.*.json',
    'tokens/colors.*.json',
  ],
  platforms: {
    css: {
      transformGroup: auroraCssTransformGroup.name,
      buildPath: config.cssBuildPath,
      prefix: config.cssVariablePrefix,
      preprocessors: [typography.name],
      files: [
        {
          format: formats.cssVariables,
          destination: `${mode.name}.css`,
          filter: (token: TransformedToken) =>
            token.filePath.includes('text.styles') ||
            token.filePath.includes('dimensions.') ||
            token.filePath.includes('typography'),
          options: {
            outputReferences: true,
            selector: mode.selector ?? ':root',
          },
        },
      ],
    },
    ts: {
      transformGroup: transformGroups.js,
      buildPath: config.cssBuildPath,
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

export const modes: ReadonlyArray<ModeDefinition> = [
  {
    name: 'color',
    configs: [
      {
        name: 'lightmode',
      },
      {
        name: 'darkmode',
        selector: '.dark',
      },
    ],
    configFactory: colorModeFactory,
  },
  {
    name: 'viewport',
    configs: [
      {
        name: 'viewport-1',
      },
      {
        name: 'viewport-2',
        selector: ['@media (max-width: 1250px)', ':root'],
      },
    ],
    configFactory: viewportModeFactory,
  },
]
