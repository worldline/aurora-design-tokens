import { readFileSync } from 'fs'

import { describe, expect, it } from 'vitest'

describe('build css', () => {
  it('should output the consolidated CSS file', () => {
    const css = readFileSync('build/css/style.css', 'utf8')
    expect(css).toMatchSnapshot()
  })
})
