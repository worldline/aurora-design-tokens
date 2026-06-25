import StyleDictionary from 'style-dictionary'
import { transformGroups } from 'style-dictionary/enums'

import { blurIntensity } from './blur-intensity.ts'
import { reactNativeBoxShadow } from './react-native-box-shadow.ts'
import { reverseShadowOrder } from './reverse-shadow-order.ts'
import { stripUnit } from './strip-unit.ts'

export const auroraReactNativeTransformGroup = {
  name: 'aurora/react-native',
  transforms: [
    ...StyleDictionary.hooks.transformGroups[
      transformGroups.reactNative
    ].filter((transform) => !['size/object'].includes(transform)),
    stripUnit.name,
    reverseShadowOrder.name,
    reactNativeBoxShadow.name,
    blurIntensity.name,
  ],
}
