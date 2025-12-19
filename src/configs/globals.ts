import {
  formats,
  logBrokenReferenceLevels,
  logVerbosityLevels,
  logWarningLevels,
  transformGroups,
} from 'style-dictionary/enums'
import type { Config } from 'style-dictionary/types'

import { config } from '../config.ts'
import { zeroPx } from '../transforms/zero-px.ts'

export const globalsConfig = {
  source: ['tokens/global-*.json', 'tokens/alias-dimensions*.json'],
  log: {
    warnings: logWarningLevels.warn,
    verbosity: logVerbosityLevels.verbose,
    errors: {
      brokenReferences: logBrokenReferenceLevels.throw,
    },
  },
  platforms: {
    css: {
      transformGroup: transformGroups.css,
      buildPath: config.cssBuildPath,
      prefix: config.cssVariablePrefix,
      transforms: ['color/hex', zeroPx.name],
      files: [
        {
          format: formats.cssVariables,
          destination: config.globalCssVariablesFile,
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
