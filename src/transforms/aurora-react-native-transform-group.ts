import StyleDictionary from 'style-dictionary'
import { transformGroups } from 'style-dictionary/enums'

import { blurIntensity } from './blur-intensity.ts'
import { gradientHorizontalAngle } from './gradient-horizontal-angle.ts'
import { reactNativeBoxShadow } from './react-native-box-shadow.ts'
import { reactNativeMotionDuration } from './react-native-motion-duration.ts'
import { reactNativeMotionEasing } from './react-native-motion-easing.ts'
import { reverseShadowOrder } from './reverse-shadow-order.ts'
import { stripUnit } from './strip-unit.ts'

export const auroraReactNativeTransformGroup = {
  name: 'aurora/react-native',
  transforms: [
    ...StyleDictionary.hooks.transformGroups[
      transformGroups.reactNative
    ].filter((transform) => !['size/object'].includes(transform)),
    stripUnit.name,
    reactNativeMotionDuration.name,
    reactNativeMotionEasing.name,
    reverseShadowOrder.name,
    reactNativeBoxShadow.name,
    blurIntensity.name,
    gradientHorizontalAngle.name,
  ],
}
