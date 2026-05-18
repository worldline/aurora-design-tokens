import StyleDictionary from 'style-dictionary'

import { config } from './config.ts'
import { globalsConfig } from './configs/globals.ts'
import { highLevelFactory, modes, themes, viewports } from './configs/modes.ts'
import { typescriptTypes } from './formats/typescript-types.ts'
import { typography } from './preprocessors/typography.ts'
import { buildCss } from './scripts/build-css.ts'
import { buildReactNative } from './scripts/build-react-native.ts'
import { auroraCssTransformGroup } from './transforms/aurora-css-transform-group.ts'
import { auroraReactNativeTransformGroup } from './transforms/aurora-react-native-transform-group.ts'
import { fontsPxToRem } from './transforms/fonts-px-to-rem.ts'
import { gradient } from './transforms/gradient.ts'
import { reactNativeBoxShadow } from './transforms/react-native-box-shadow.ts'
import { reverseShadowOrder } from './transforms/reverse-shadow-order.ts'
import { stripUnit } from './transforms/strip-unit.ts'
import { zeroPx } from './transforms/zero-px.ts'

StyleDictionary.registerPreprocessor(typography)
StyleDictionary.registerTransform(gradient)
StyleDictionary.registerTransform(reverseShadowOrder)
StyleDictionary.registerTransform(zeroPx)
StyleDictionary.registerTransform(fontsPxToRem)
StyleDictionary.registerTransform(reactNativeBoxShadow)
StyleDictionary.registerTransform(stripUnit)
StyleDictionary.registerTransformGroup(auroraCssTransformGroup)
StyleDictionary.registerTransformGroup(auroraReactNativeTransformGroup)
StyleDictionary.registerFormat(typescriptTypes)

const globalSd = new StyleDictionary(globalsConfig)
const modeSds = modes.flatMap((modeDefinition) =>
  modeDefinition.configs.map(
    (config) => new StyleDictionary(modeDefinition.configFactory(config)),
  ),
)
const highLevelSds = themes.flatMap((theme) =>
  viewports.map((viewport) => ({
    theme,
    viewport,
    sd: new StyleDictionary(highLevelFactory(theme, viewport)),
  })),
)

await globalSd.buildAllPlatforms()
await Promise.all(modeSds.map((sd) => sd.buildAllPlatforms()))
// For web the high level SDs produce exactly the same output, since
// outputReferences is set to true (CSS variables are used).
await highLevelSds[0].sd.buildPlatform('css')
await Promise.all(highLevelSds.map(({ sd }) => sd.buildPlatform('reactNative')))

await buildCss({
  inputFolder: config.cssBuildPath,
  outputFile: `${config.cssBuildPath}/style.css`,
})

await buildReactNative({
  inputFolder: config.reactNativeBuildPath,
  outputFile: `${config.reactNativeBuildPath}/tokens.ts`,
})
