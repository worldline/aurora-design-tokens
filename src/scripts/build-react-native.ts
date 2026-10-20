import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import util from 'node:util'

import { breakpoints, themes, viewports } from '../configs/modes.ts'
import { deeplyMapKeys, deepMerge } from '../util/object.ts'
import { kebabCaseToCamelCase } from '../util/string.ts'

interface ColorModeTokens {
  color: string
  tokens: Record<string, unknown>
}

interface ViewportModeTokens {
  viewport: string
  tokens: Record<string, unknown>
}

interface HighLevelTokens {
  color: string
  viewport: string
  tokens: Record<string, unknown>
}

const loadFile = async (inputFolder: string, filename: string) => {
  const filePath = path.resolve(inputFolder, filename)
  const module = (await import(pathToFileURL(filePath).href)) as {
    default: Record<string, unknown>
  }
  return module.default
}

const isLeaf = (value: unknown): boolean =>
  typeof value !== 'object' || value === null || Array.isArray(value)

const mergeViewports = (
  sources: ReadonlyArray<ViewportModeTokens>,
): Record<string, unknown> => {
  const allKeys = sources.flatMap(({ tokens }) => Object.keys(tokens))
  return Object.fromEntries(
    allKeys.map((key) => {
      const allLeaves = sources.every(({ tokens }) => isLeaf(tokens[key]))
      if (allLeaves) {
        const tokenValues = sources.map(({ tokens }) => tokens[key])
        const allTokenValuesEqual = tokenValues.every((v) =>
          util.isDeepStrictEqual(v, tokenValues[0]),
        )
        return [
          key,
          allTokenValuesEqual
            ? tokenValues[0]
            : Object.fromEntries(
                sources.map(({ viewport, tokens }) => [viewport, tokens[key]]),
              ),
        ]
      }
      return [
        key,
        mergeViewports(
          sources.map(({ viewport, tokens }) => ({
            viewport,
            tokens: tokens[key] as Record<string, unknown>,
          })),
        ),
      ]
    }),
  )
}

const buildTokens = (
  globalTokens: Record<string, unknown>,
  colorTokens: Array<ColorModeTokens>,
  viewportTokens: Array<ViewportModeTokens>,
  highLevelTokens: Array<HighLevelTokens>,
) =>
  deeplyMapKeys(
    {
      global: globalTokens,
      themes: Object.fromEntries(
        colorTokens.map(({ color, tokens }) => [
          color,
          deepMerge(
            deepMerge(tokens, mergeViewports(viewportTokens)),
            mergeViewports(
              highLevelTokens.filter((highLevel) => highLevel.color === color),
            ),
          ),
        ]),
      ),
      breakpoints,
    },
    kebabCaseToCamelCase,
  )

const buildReactNative = async ({
  inputFolder,
  outputFile,
}: {
  inputFolder: string
  outputFile: string
}) => {
  const globalTokens = await loadFile(inputFolder, 'global.ts')

  const colorTokens = await Promise.all(
    themes.map(async (color) => ({
      color,
      tokens: await loadFile(inputFolder, `${color}.ts`),
    })),
  )

  const viewportTokens = await Promise.all(
    viewports.map(async (viewport) => ({
      viewport,
      tokens: await loadFile(inputFolder, `viewport.${viewport}.ts`),
    })),
  )

  const highLevelTokens = await Promise.all(
    themes.flatMap((color) =>
      viewports.map(async (viewport) => ({
        color,
        viewport,
        tokens: await loadFile(
          inputFolder,
          `high-level.${color}.${viewport}.ts`,
        ),
      })),
    ),
  )

  const tokens = buildTokens(
    globalTokens,
    colorTokens,
    viewportTokens,
    highLevelTokens,
  )

  fs.writeFileSync(
    outputFile,
    `export const tokens = ${JSON.stringify(tokens, null, 2)} as const;\n`,
  )
}

export { buildReactNative, buildTokens, mergeViewports }
