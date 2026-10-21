import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const PUBLIC_PACKAGE_NAME = '@worldline-official/aurora-design-tokens'
const NPMJS_REGISTRY = 'https://registry.npmjs.org/'
const PRIVATE_CONTENT_PATTERN =
  /nexus\.kazan\.myworldline\.com|bambora\.jfrog\.io|gitlab\.kazan\.myworldline\.com|myworldline\.com|worldline-solutions\.com|arn:a[w]s:|BEGIN (RSA|OPENSSH|EC|PRIVATE) KEY|ghp[_]|github[_]pat[_]|glpat[-]|xox[baprs][-]|version https:\/\/git-lfs\.github\.com\/spec\/v1/i

const [tarballPath, packJsonPath, githubRepository, expectedVersion] =
  process.argv.slice(2)
if (!tarballPath || !packJsonPath || !githubRepository || !expectedVersion) {
  throw new Error(
    'usage: verify-public-tarball.mjs TARBALL_PATH PACK_JSON_PATH GITHUB_REPOSITORY EXPECTED_VERSION',
  )
}
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(githubRepository)) {
  throw new Error('GitHub repository must use owner/repository format')
}

const tarball = path.resolve(tarballPath)
const packJson = path.resolve(packJsonPath)
if (!fs.existsSync(tarball) || !fs.statSync(tarball).isFile()) {
  throw new Error('tarball is missing')
}

const [pack] = JSON.parse(fs.readFileSync(packJson, 'utf8'))
if (!pack?.integrity?.startsWith('sha512-')) {
  throw new Error('npm pack JSON must contain a SHA-512 integrity value')
}
if (!pack.name || !pack.version || !pack.filename) {
  throw new Error('npm pack JSON must describe the packed package')
}
if (path.basename(tarball) !== pack.filename) {
  throw new Error('tarball does not match npm pack JSON filename')
}

const actualIntegrity = `sha512-${createHash('sha512').update(fs.readFileSync(tarball)).digest('base64')}`
if (actualIntegrity !== pack.integrity) {
  throw new Error('tarball integrity does not match npm pack JSON')
}

const archiveEntries = runTar(['-tzf', tarball]).split(/\r?\n/).filter(Boolean)
if (
  !archiveEntries.length ||
  archiveEntries.some(
    (entry) =>
      entry.startsWith('/') ||
      entry.split('/').includes('..') ||
      !entry.startsWith('package/'),
  )
) {
  throw new Error('tarball contains an invalid archive path')
}
if (
  archiveEntries.filter((entry) => entry === 'package/package.json').length !==
  1
) {
  throw new Error('tarball must contain exactly one embedded package manifest')
}
if (!archiveEntries.includes('package/LICENSE')) {
  throw new Error('public tarball must contain a root LICENSE')
}

const extractionDir = fs.mkdtempSync(
  path.join(os.tmpdir(), 'aurora-public-tarball-'),
)
try {
  runTar([
    '--no-same-owner',
    '--no-same-permissions',
    '-xzf',
    tarball,
    '-C',
    extractionDir,
  ])
  const packageDir = path.join(extractionDir, 'package')
  const packageJsonPath = path.join(packageDir, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const licenseText = fs.readFileSync(path.join(packageDir, 'LICENSE'), 'utf8')

  if (
    packageJson.name !== PUBLIC_PACKAGE_NAME ||
    pack.name !== PUBLIC_PACKAGE_NAME
  ) {
    throw new Error('unexpected public package name')
  }
  if (packageJson.version !== pack.version) {
    throw new Error('embedded package version does not match npm pack JSON')
  }
  if (packageJson.version !== expectedVersion || pack.version !== expectedVersion) {
    throw new Error('packed package version does not match the expected version')
  }
  if (packageJson.license !== 'Apache-2.0') {
    throw new Error('embedded package license must be Apache-2.0')
  }
  if (!/Copyright \(c\) 2025-2026 Worldline SA/.test(licenseText)) {
    throw new Error('root LICENSE is missing the approved Worldline copyright')
  }
  if (
    packageJson.repository?.url !== `https://github.com/${githubRepository}.git`
  ) {
    throw new Error('unexpected public package repository')
  }
  if (
    packageJson.publishConfig?.registry !== NPMJS_REGISTRY ||
    packageJson.publishConfig?.access !== 'public'
  ) {
    throw new Error('embedded package publishConfig must target public npmjs')
  }
  if (packageJson.scripts && Object.keys(packageJson.scripts).length) {
    throw new Error('embedded package must not contain lifecycle scripts')
  }

  verifyPackageEntrypoints(packageDir, packageJson)
  scanPackageContents(packageDir)
} finally {
  fs.rmSync(extractionDir, { recursive: true, force: true })
}

function verifyPackageEntrypoints(packageDir, packageJson) {
  const targets = []
  if (packageJson.exports !== undefined) {
    collectEntrypointTargets(packageJson.exports, 'export', targets, true)
  }
  for (const field of ['main', 'types', 'module', 'browser']) {
    if (packageJson[field] !== undefined) {
      collectEntrypointTargets(packageJson[field], field, targets, false)
    }
  }
  for (const { target, source, requiresRelativePrefix } of targets) {
    verifyEntrypointTarget(packageDir, target, source, requiresRelativePrefix)
  }
}

function collectEntrypointTargets(value, source, targets, requiresRelativePrefix) {
  if (typeof value === 'string') {
    targets.push({ target: value, source, requiresRelativePrefix })
    return
  }
  if (value === null || value === false) return
  if (Array.isArray(value)) {
    for (const entry of value) {
      collectEntrypointTargets(entry, source, targets, requiresRelativePrefix)
    }
    return
  }
  if (typeof value === 'object') {
    for (const entry of Object.values(value)) {
      collectEntrypointTargets(entry, source, targets, requiresRelativePrefix)
    }
    return
  }
  throw new Error(`invalid ${source} target in package manifest`)
}

function verifyEntrypointTarget(
  packageDir,
  target,
  source,
  requiresRelativePrefix,
) {
  if (
    (requiresRelativePrefix && !target.startsWith('./')) ||
    target.includes('\\') ||
    path.posix.isAbsolute(target) ||
    path.win32.isAbsolute(target) ||
    target.split('/').includes('..')
  ) {
    throw new Error(`invalid ${source} target ${JSON.stringify(target)}`)
  }
  const relativeTarget = target.startsWith('./') ? target.slice(2) : target
  if (!relativeTarget || relativeTarget.startsWith('../')) {
    throw new Error(`invalid ${source} target ${JSON.stringify(target)}`)
  }
  if (relativeTarget.includes('*')) {
    const matcher = new RegExp(
      `^${relativeTarget.replace(/[|\\{}()[\]^$+?.]/g, '\\$&').replaceAll('*', '.*')}$`,
    )
    if (!listRegularFiles(packageDir).some((file) => matcher.test(file))) {
      throw new Error(`missing ${source} target ${JSON.stringify(target)}`)
    }
    return
  }
  const entrypointPath = path.resolve(packageDir, relativeTarget)
  if (
    path.relative(packageDir, entrypointPath).startsWith('..') ||
    !fs.existsSync(entrypointPath) ||
    !fs.lstatSync(entrypointPath).isFile()
  ) {
    throw new Error(`missing ${source} target ${JSON.stringify(target)}`)
  }
}

function listRegularFiles(directory, relativeDirectory = '') {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(relativeDirectory, entry.name)
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...listRegularFiles(entryPath, relativePath))
    } else if (entry.isFile()) {
      files.push(relativePath)
    }
  }
  return files
}

function runTar(args) {
  const result = spawnSync('tar', args.map(toTarPath), { encoding: 'utf8' })
  if (result.status !== 0) {
    throw new Error(`tar failed: ${result.stderr || result.stdout}`)
  }
  return result.stdout
}

function toTarPath(value) {
  if (process.platform !== 'win32' || !path.isAbsolute(value)) return value
  const result = spawnSync('cygpath', ['-u', value], { encoding: 'utf8' })
  if (result.status !== 0) throw new Error(`cygpath failed: ${result.stderr}`)
  return result.stdout.trim()
}

function scanPackageContents(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      scanPackageContents(entryPath)
      continue
    }
    if (entry.isSymbolicLink()) {
      throw new Error('tarball must not contain symbolic links')
    }
    if (
      entry.isFile() &&
      PRIVATE_CONTENT_PATTERN.test(fs.readFileSync(entryPath).toString('utf8'))
    ) {
      throw new Error('private or secret pattern found in public tarball')
    }
  }
}
