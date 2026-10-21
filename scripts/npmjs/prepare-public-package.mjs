import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_PACKAGE_NAME = "@worldline/aurora-design-tokens";
const PUBLIC_PACKAGE_NAME = "@worldline-official/aurora-design-tokens";
const NPMJS_REGISTRY = "https://registry.npmjs.org/";
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const publicReadme = path.resolve(scriptDir, "../../npmjs/README.md");

const [packageDirectory, githubRepository, ...options] = process.argv.slice(2);
const retainScripts = options.includes("--retain-scripts");
if (options.some((option) => option !== "--retain-scripts")) {
  throw new Error(`unknown option: ${options.find((option) => option !== "--retain-scripts")}`);
}
if (!packageDirectory || !githubRepository) {
  throw new Error("usage: prepare-public-package.mjs PACKAGE_DIRECTORY GITHUB_REPOSITORY [--retain-scripts]");
}
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(githubRepository)) {
  throw new Error("GitHub repository must use owner/repository format");
}

const packageDir = path.resolve(packageDirectory);
const packageJsonPath = path.join(packageDir, "package.json");
if (!fs.existsSync(packageJsonPath)) {
  throw new Error(`package.json is missing from ${packageDir}`);
}
if (!fs.existsSync(publicReadme)) {
  throw new Error("public npmjs README is missing");
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
if (packageJson.name !== SOURCE_PACKAGE_NAME) {
  throw new Error(`expected source package ${SOURCE_PACKAGE_NAME}, received ${packageJson.name}`);
}

packageJson.name = PUBLIC_PACKAGE_NAME;
packageJson.repository = { type: "git", url: `https://github.com/${githubRepository}.git` };
packageJson.publishConfig = { registry: NPMJS_REGISTRY, access: "public" };
if (!retainScripts) {
  delete packageJson.scripts;
  if (packageJson.main && !fs.existsSync(path.join(packageDir, packageJson.main))) {
    delete packageJson.main;
  }
}

for (const section of ["dependencies", "optionalDependencies", "peerDependencies"]) {
  if (!packageJson[section]?.[SOURCE_PACKAGE_NAME]) continue;
  packageJson[section][PUBLIC_PACKAGE_NAME] = packageJson[section][SOURCE_PACKAGE_NAME];
  delete packageJson[section][SOURCE_PACKAGE_NAME];
}

fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
fs.copyFileSync(publicReadme, path.join(packageDir, "README.md"));
