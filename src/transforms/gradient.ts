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
    try {
      assertIsGradientValue(token.$value)
    } catch (error) {
      throw new Error(
        `Invalid gradient token at path: ${token.path.join('.')}: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      )
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

const assertIsGradientValue: (
  value: unknown,
) => asserts value is GradientTokenValue = (value: unknown) => {
  if (typeof value !== 'object' || value === null) {
    throw new Error('A gradient value must be an object')
  }
  if (
    !('type' in value) ||
    (value.type !== 'linear' && value.type !== 'radial')
  ) {
    throw new Error(
      'A gradient value must have a valid type of "linear" or "radial"',
    )
  }
  if (!('angle' in value) || typeof value.angle !== 'number') {
    throw new Error('A gradient value must have a numeric angle')
  }
  if (
    !('stops' in value) ||
    !Array.isArray(value.stops) ||
    value.stops.length === 0
  ) {
    throw new Error('A gradient value must have at least one stop')
  }

  value.stops.forEach((stop, index) => {
    assertStop(stop, index)
  })
}

const assertStop: (stop: unknown, index: number) => asserts stop is Stop = (
  stop: unknown,
  index: number,
) => {
  const indexAsString = index.toString()
  if (typeof stop !== 'object' || stop === null) {
    throw new Error('The gradient stop must be an object')
  }
  if (!('color' in stop) || typeof stop.color !== 'string') {
    throw new Error(
      `Gradient stop at index ${indexAsString} must have a string color`,
    )
  }
  if (!('position' in stop) || typeof stop.position !== 'number') {
    throw new Error(
      `Gradient stop at index ${indexAsString} must have a number position`,
    )
  }
  if (stop.position < 0 || stop.position > 1) {
    throw new Error(
      `Gradient stop at index ${indexAsString} must have a position between 0 and 1`,
    )
  }
}
