import { execSync } from 'child_process'
import { readFileSync } from 'fs'

import { beforeAll, describe, expect, it } from 'vitest'

describe('build', () => {
  beforeAll(() => {
    execSync('npm run build')
  })

  it('should output the consolidated CSS file', () => {
    const css = readFileSync('build/css/style.css', 'utf8')
    expect(css).toMatchSnapshot()
  })

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

  it('should output the react native tokens file', () => {
    const ts = readFileSync('build/react-native/tokens.ts', 'utf8')
    expect(ts).toMatchSnapshot()
  })
})
