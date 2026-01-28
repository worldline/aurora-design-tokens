import {
  formats,
  logBrokenReferenceLevels,
  logVerbosityLevels,
  logWarningLevels,
  transformGroups,
} from 'style-dictionary/enums'
import type { Config, TransformedToken } from 'style-dictionary/types'

import { config } from '../config.ts'
import { typography } from '../preprocessors/typography.ts'
import { auroraCssTransformGroup } from '../transforms/aurora-css-transform-group.ts'

export const globalsConfig = {
  source: [
    'tokens/brand.worldline.*.json',
    'tokens/color.styles.*.json',
    'tokens/dimensions.*.json',
  ],
  log: {
    warnings: logWarningLevels.warn,
    verbosity: logVerbosityLevels.verbose,
    errors: {
      brokenReferences: logBrokenReferenceLevels.throw,
    },
  },
  platforms: {
    css: {
      transformGroup: auroraCssTransformGroup.name,
      buildPath: config.cssBuildPath,
      prefix: config.cssVariablePrefix,
      preprocessors: [typography.name],
      files: [
        {
          format: formats.cssVariables,
          destination: config.globalCssVariablesFile,
          filter: (token: TransformedToken) =>
            token.filePath.includes('brand.') ||
            token.filePath.includes('dimensions.') ||
            token.filePath.includes('color.styles.'),
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    ts: {
      transformGroup: transformGroups.js,
      buildPath: config.buildPath,
      transforms: ['color/hex'],
      files: [
        {
          format: formats.javascriptEs6,
          destination: config.globalJsVariablesFile,
        },
      ],
    },
  },
} satisfies Config
