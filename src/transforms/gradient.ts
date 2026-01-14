import type { Transform, TransformedToken } from 'style-dictionary/types'

interface Stop {
  color: string
  position: number
}

export interface GradientTokenValue {
  type: 'linear' | 'radial'
  angle: number
  stops: ReadonlyArray<Stop>
}

export const gradient = {
  type: 'value',
  transitive: true,
  name: 'gradient',
  filter: (token) => token.$type === 'gradient',
  transform: (token: TransformedToken) => {
    if (!isGradientTokenValue(token.$value)) {
      throw new Error(`Invalid gradient token at path: ${token.path.join('.')}`)
    }

    const stops = token.$value.stops
      .map((stop) => `${stop.color} ${(stop.position * 100).toString()}%`)
      .join(', ')

    switch (token.$value.type) {
      case 'linear':
        return `linear-gradient(${token.$value.angle.toString()}deg, ${stops})`
      case 'radial':
        return `radial-gradient(circle, ${stops})`
      default:
        return token.$value
    }
  },
} satisfies Transform

const isGradientTokenValue = (value: unknown): value is GradientTokenValue =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  (value.type === 'linear' || value.type === 'radial') &&
  'angle' in value &&
  'stops' in value &&
  Array.isArray(value.stops) &&
  value.stops.length > 0 &&
  value.stops.every(isStop)

const isStop = (stop: unknown): stop is Stop =>
  typeof stop === 'object' &&
  stop !== null &&
  'color' in stop &&
  'position' in stop &&
  typeof stop.color === 'string' &&
  typeof stop.position === 'number' &&
  stop.position >= 0 &&
  stop.position <= 1
