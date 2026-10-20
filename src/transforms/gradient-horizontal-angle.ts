import type { Transform, TransformedToken } from 'style-dictionary/types'

const HORIZONTAL_ANGLE = 270

// Figma gradient styles can't have an angle, so every gradient is exported as
// 180deg (top to bottom). Horizontal gradients are separate tokens that are
// rotated -90deg in Figma, so their angle is corrected here.
export const gradientHorizontalAngle = {
  type: 'value',
  transitive: true,
  name: 'gradient/horizontal-angle',
  filter: (token) =>
    token.$type === 'gradient' &&
    token.path.includes('horizontal') &&
    isLinearGradient(token.$value),
  transform: (token: TransformedToken) => ({
    ...(token.$value as Record<string, unknown>),
    angle: HORIZONTAL_ANGLE,
  }),
} satisfies Transform

const isLinearGradient = (value: unknown) =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  value.type === 'linear'
