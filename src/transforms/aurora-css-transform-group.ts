import StyleDictionary from 'style-dictionary'
import { transformGroups } from 'style-dictionary/enums'

import { gradient } from './gradient.ts'
import { reverseShadowOrder } from './reverse-shadow-order.ts'
import { zeroPx } from './zero-px.ts'

export const auroraCssTransformGroup = {
  name: 'aurora/css',
  transforms: [
    reverseShadowOrder.name,
    zeroPx.name,
    ...StyleDictionary.hooks.transformGroups[transformGroups.css],
    gradient.name,
    'color/hex',
  ],
}
