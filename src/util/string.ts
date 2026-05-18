export const kebabCaseToCamelCase = (value: string) =>
  value.replace(/-([a-z0-9])/g, (_, char) => (char as string).toUpperCase())

export const decapitalize = (s: string): string =>
  `${s[0].toLowerCase()}${s.slice(1)}`

export const stringToNumber = (value: string) => {
  const parsedValue = parseFloat(value)
  if (isNaN(parsedValue)) {
    throw new Error(`Value '${value}' could not be converted to a number.`)
  }
  return parsedValue
}
