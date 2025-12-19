import { promises as fs } from 'fs'
import * as path from 'path'

import { config } from '../config.ts'

export const mergeCssFiles = async ({
  inputFolder,
  outputFile,
}: {
  inputFolder: string
  outputFile: string
}) => {
  const files = await fs.readdir(inputFolder)
  const cssFiles = files
    .filter(
      (file) => file.endsWith('.css') && file !== path.basename(outputFile),
    )
    .sort((a, b) => {
      if (a === config.globalCssVariablesFile) return -1
      if (b === config.globalCssVariablesFile) return 1
      return a.localeCompare(b)
    })

  const output = (
    await Promise.all(
      cssFiles.map(async (file) => {
        const content = await fs.readFile(path.join(inputFolder, file), 'utf-8')
        // Strip out any existing comments
        const filteredContent = content.replace(/\/\*[\s\S]*?\*\//g, '').trim()
        return `/* ${file} */\n${filteredContent}\n\n`
      }),
    )
  ).join('')

  await fs.writeFile(outputFile, output)
}
