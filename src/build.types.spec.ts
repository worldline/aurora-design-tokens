import { readFileSync } from 'fs'

import { describe, expect, it } from 'vitest'

describe('build types', () => {
  it('should output the colors typescript file', () => {
    const ts = readFileSync('build/types/colors.ts', 'utf8')
    expect(ts).toMatchSnapshot()
  })

  it('should output the typographies typescript file', () => {
    const ts = readFileSync('build/types/typographies.ts', 'utf8')
    expect(ts).toMatchSnapshot()
  })

  it('should output the variables definition of types file', () => {
    const ts = readFileSync('build/variables.d.ts', 'utf8')
    expect(ts).toMatchSnapshot()
  })
})
