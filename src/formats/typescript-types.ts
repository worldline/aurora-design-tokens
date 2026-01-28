import type { Format } from 'style-dictionary/types'

const decapitalize = (s: string): string => `${s[0].toLowerCase()}${s.slice(1)}`

export const typescriptTypes = {
  name: 'typescript/types',
  format: ({ dictionary, options }) => {
    const types = Array.from(dictionary.tokenMap.values())
      .map(({ name }) => name.replace(String(options.prefixToRemove), ''))
      .map((name) => `  | '${decapitalize(name)}'`)
      .join('\n')
      .concat('\n')
    return `export type ${String(options.typeName)} =
${types}`
  },
} satisfies Format
