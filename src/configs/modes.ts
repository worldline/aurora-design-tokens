import { formats, transformGroups } from 'style-dictionary/enums'
import type { Config, TransformedToken } from 'style-dictionary/types'

import { config } from '../config.ts'
import { typescriptTypes } from '../formats/typescript-types.ts'

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
  source: [...globalsConfig.source, `tokens/alias-color.${mode.name}*.json`],
  platforms: {
    css: {
      transformGroup: transformGroups.css,
      buildPath: config.cssBuildPath,
      prefix: config.cssVariablePrefix,
      transforms: ['color/hex'],
      files: [
        {
          format: formats.cssVariables,
          destination: `${mode.name}.css`,
          filter: (token: TransformedToken) =>
            token.filePath.includes('alias-color.'),
          options: {
            outputReferences: true,
            selector: mode.selector ?? ':root',
          },
        },
        {
          format: 'typescript/types',
          destination: 'colors.ts',
          options: {
            typeName: 'AuColor',
          },
          filter: (token: TransformedToken) =>
            token.filePath.includes('alias-color.'),
        },
      ],
    },
  },
})

const viewportModeFactory: ConfigFactory = (mode) => ({
  ...globalsConfig,
  source: [
    ...globalsConfig.source,
    `tokens/alias-typography.${mode.name}-viewport*.json`,
    'tokens/text.styles*.json',
  ],
  platforms: {
    css: {
      transformGroup: transformGroups.css,
      buildPath: config.cssBuildPath,
      prefix: config.cssVariablePrefix,
      files: [
        {
          format: formats.cssVariables,
          destination: `${mode.name}.css`,
          filter: (token: TransformedToken) =>
            token.filePath.includes('text.styles') ||
            token.filePath.includes('alias-typography'),
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
        name: 'large',
      },
      {
        name: 'small',
        selector: ['@media (max-width: 1250px)', ':root'],
      },
    ],
    configFactory: viewportModeFactory,
  },
]
