import { readFileSync } from 'fs'

import { describe, expect, it } from 'vitest'

describe('build react native', () => {
  it('should output the react native tokens file', () => {
    const ts = readFileSync('build/react-native/tokens.ts', 'utf8')
    expect(ts).toMatchSnapshot()
  })
})
