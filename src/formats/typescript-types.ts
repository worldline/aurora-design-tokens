import type { Format } from 'style-dictionary/types'

import { decapitalize } from '../util/string.ts'

export const typescriptTypes = {
  name: 'typescript/types',
  format: ({ dictionary, options }) => {
    const types = Array.from(dictionary.tokenMap.values())
      .filter(({ $type }) => $type === options.type)
      .map(({ name }) => name.replace(String(options.prefixToRemove), ''))
      .map((name) => `  | '${decapitalize(name)}'`)
      .join('\n')
      .concat('\n')
    return `export type ${String(options.typeName)} =
${types}`
  },
} satisfies Format
