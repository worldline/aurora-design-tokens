import StyleDictionary from 'style-dictionary'

import { config } from './config.ts'
import { globalsConfig } from './configs/globals.ts'
import { highLevelTokensConfig, modes } from './configs/modes.ts'
import { typescriptTypes } from './formats/typescript-types.ts'
import { typography } from './preprocessors/typography.ts'
import { mergeCssFiles } from './scripts/merge-css-files.ts'
import { auroraCssTransformGroup } from './transforms/aurora-css-transform-group.ts'
import { gradient } from './transforms/gradient.ts'
import { reverseShadowOrder } from './transforms/reverse-shadow-order.ts'
import { zeroPx } from './transforms/zero-px.ts'

StyleDictionary.registerPreprocessor(typography)
StyleDictionary.registerTransform(gradient)
StyleDictionary.registerTransform(reverseShadowOrder)
StyleDictionary.registerTransform(zeroPx)
StyleDictionary.registerTransformGroup(auroraCssTransformGroup)
StyleDictionary.registerFormat(typescriptTypes)

const dictionaries = [
  new StyleDictionary(globalsConfig),
  ...modes.flatMap((modeDefinition) =>
    modeDefinition.configs.map(
      (config) => new StyleDictionary(modeDefinition.configFactory(config)),
    ),
  ),
  new StyleDictionary(highLevelTokensConfig),
]

await Promise.all(dictionaries.map((sd) => sd.buildAllPlatforms()))

await mergeCssFiles({
  inputFolder: config.cssBuildPath,
  outputFile: `${config.cssBuildPath}/style.css`,
})
