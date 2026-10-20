import StyleDictionary from 'style-dictionary'
import { transformGroups } from 'style-dictionary/enums'

import { gradientHorizontalAngle } from './gradient-horizontal-angle.ts'
import { gradient } from './gradient.ts'
import { reverseShadowOrder } from './reverse-shadow-order.ts'
import { zeroPx } from './zero-px.ts'

export const auroraCssTransformGroup = {
  name: 'aurora/css',
  transforms: [
    reverseShadowOrder.name,
    zeroPx.name,
    ...StyleDictionary.hooks.transformGroups[transformGroups.css],
    gradientHorizontalAngle.name,
    gradient.name,
    'color/hex',
  ],
}
