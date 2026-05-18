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
import { auroraReactNativeTransformGroup } from '../transforms/aurora-react-native-transform-group.ts'
import { fontsPxToRem } from '../transforms/fonts-px-to-rem.ts'

export const globalsConfig = {
  source: [
    'tokens/brand.worldline.*.json',
    'tokens/color.styles.*.json',
    'tokens/dimension.*.json',
    'tokens/typography.all.*.json',
    'tokens/motion.all.*.json',
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
      transforms: [fontsPxToRem.name],
      buildPath: config.cssBuildPath,
      prefix: config.cssVariablePrefix,
      preprocessors: [typography.name],
      files: [
        {
          format: formats.cssVariables,
          destination: config.globalCssVariablesFile,
          filter: (token: TransformedToken) =>
            token.filePath.includes('brand.') ||
            token.filePath.includes('dimension.') ||
            token.filePath.includes('typography.all.') ||
            token.filePath.includes('color.styles.') ||
            token.filePath.includes('motion.all.'),
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    js: {
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
    ts: {
      transformGroup: transformGroups.js,
      buildPath: config.buildPath,
      transforms: ['color/hex'],
      files: [
        {
          format: formats.typescriptEs6Declarations,
          destination: config.globalTsVariablesFile,
        },
      ],
    },
    reactNative: {
      transformGroup: auroraReactNativeTransformGroup.name,
      buildPath: config.reactNativeBuildPath,
      files: [
        {
          format: formats.javascriptEsm,
          destination: config.globalReactNativeFile,
          options: {
            minify: true,
          },
        },
      ],
    },
  },
} satisfies Config
