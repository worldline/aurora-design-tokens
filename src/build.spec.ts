import { execSync } from 'child_process'
import { readFileSync } from 'fs'

import { describe, it, beforeAll, expect } from 'vitest'

describe('build', () => {
  beforeAll(() => {
    execSync('npm run build')
  })

  it('should output the consolidated CSS file', () => {
    const css = readFileSync('build/css/style.css', 'utf8')
    expect(css).toMatchSnapshot()
  })

  it('should output the colors typescript file', () => {
    const ts = readFileSync('build/css/colors.ts', 'utf8')
    expect(ts).toMatchSnapshot()
  })

  it('should output the typographies typescript file', () => {
    const ts = readFileSync('build/css/typographies.ts', 'utf8')
    expect(ts).toMatchSnapshot()
  })
})
