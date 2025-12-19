import StyleDictionary from 'style-dictionary'

import { config } from './config.ts'
import { globalsConfig } from './configs/globals.ts'
import { modes } from './configs/modes.ts'
import { typescriptTypes } from './formats/typescript-types.ts'
import { mergeCssFiles } from './scripts/merge-css-files.ts'
import { zeroPx } from './transforms/zero-px.ts'

StyleDictionary.registerTransform(zeroPx)
StyleDictionary.registerFormat(typescriptTypes)

const dictionaries = [
  new StyleDictionary(globalsConfig),
  ...modes.flatMap((modeDefinition) =>
    modeDefinition.configs.map(
      (config) => new StyleDictionary(modeDefinition.configFactory(config)),
    ),
  ),
]

await Promise.all(dictionaries.map((sd) => sd.buildAllPlatforms()))

await mergeCssFiles({
  inputFolder: config.cssBuildPath,
  outputFile: `${config.cssBuildPath}/style.css`,
})
