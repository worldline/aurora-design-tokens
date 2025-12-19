# Aurora Design Tokens ✨

A repository of design tokens for Worldline's [Aurora Design System](https://www.figma.com/design/lxmpUgg7MKDaWJD8Sm00RE/Aurora-Design-system).

## Overview

This project transforms design token JSON files, conforming to the [DTCG specification](https://www.designtokens.org/tr/drafts/format/) format, into tokens that can be consumed on different platforms. The source of truth for the design tokens is Figma, where they're exported and committed into this repository.

```
                              Figma
                                |
                          DTCG JSON files
                                |
                  Transform using Style Dictionary
                                |
CSS variables, React Native StyleSheet, Android XML resources, etc
```

## Getting Started

### Installation

Install the package

```sh
npm install @worldline/aurora-design-tokens
```

### Usage

#### CSS
If you're using a build tool like Vite, you can import the CSS variables in your project's JavaScript/TypeScript entry point file.

```js
import "@worldline/aurora-design-tokens/style.css"
```

To enable autocompletion for the CSS variables in Visual Studio Code, you can install the [CSS Variable Autocomplete](https://marketplace.visualstudio.com/items?itemName=vunguyentuan.vscode-css-variables) extension and configure your `.vscode/settings.json` like this:
```
{
  "cssVariables.lookupFiles": [
    "**/*.css",
    "**/*.scss",
    "**/*.sass",
    "**/*.less",
    "node_modules/@worldline/aurora-design-tokens/style.css"
  ]
}
```

## Development

### Project Structure

- `./tokens` — Source design token JSON files
- `./src` — Build scripts, transforms, and configs
- `./build` — Generated CSS files, etc

### Build Tokens

To generate the latest CSS variables, etc:

```sh
npm run build
```

The output will be in the `build/` directory.

### Test

Run unit and integration tests:

```sh
npm run test
```

### Lint

Check code style and quality:

```sh
npm run lint
```

## Publishing

Bump the version in `package.json` and publish the package:

```sh
npm run publish
```
