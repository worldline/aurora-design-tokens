import fs from "node:fs";
import path from "node:path";

const [packageDirectory, ...options] = process.argv.slice(2);
if (!packageDirectory || options.length > 0) {
  throw new Error("usage: finalize-public-package.mjs PACKAGE_DIRECTORY");
}

const packageDir = path.resolve(packageDirectory);
const packageJsonPath = path.join(packageDir, "package.json");
if (!fs.existsSync(packageJsonPath)) {
  throw new Error("package.json is missing from the public package directory");
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
if (
  packageJson.private === true ||
  typeof packageJson.name !== "string" ||
  !packageJson.name.startsWith("@worldline-official/")
) {
  throw new Error("refusing to finalize a package outside the public scope");
}

delete packageJson.scripts;
if (packageJson.main && !fs.existsSync(path.join(packageDir, packageJson.main))) {
  delete packageJson.main;
}

fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
