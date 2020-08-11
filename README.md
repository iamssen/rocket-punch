# 🚀 Rocket Punch! 🥊

![CI](https://github.com/rocket-hangar/rocket-punch/workflows/CI/badge.svg)
![E2E](https://github.com/rocket-hangar/rocket-punch/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/rocket-hangar/rocket-punch/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/rocket-punch)
[![devDependencies Status](https://david-dm.org/rocket-hangar/rocket-punch/dev-status.svg?kill_cache=1)](https://david-dm.org/rocket-hangar/rocket-punch?type=dev)

`rocket-punch` is a simple tool for build and publish of some directories in your `src/` directory.

```
/src
  /package1
  /package2
  /package3
  /app
```

If you have directories like this.

```bash
npx rocket-punch build
npx rocket-punch publish
```

You can publish the `package1`, `package2` and `package3` directories to NPM with this simple commands.

- [Publish your React components as NPM packages from your React project](https://medium.com/@iamssen/publish-your-react-components-as-npm-packages-from-your-react-project-d1d1853ade9c?source=friends_link&sk=b173102386aff3c409912b9efd00c35a)

# 🧩 Installation

```bash
npm install rocket-punch --save-dev
```

# 🙏 Prepare your NPM account

First, you need to prepare an account to publish your packages.

If you don't have a NPM account create an account on [https://www.npmjs.com/](https://www.npmjs.com/)

```bash
npm login
```

And, login with your NPM account.

- If you want to use Github Packages instead of NPM follow this link.
  - [https://docs.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages](https://docs.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages)

# 🚀 Quick Start

You can use Github template projects to easy start.

- [Generate simple rocket-punch multi package project](https://github.com/rocket-hangar/rocket-punch-template/generate) ([github link](https://github.com/rocket-hangar/rocket-punch-template))
- [Generate create-react-app + rocket-punch project](https://github.com/rocket-hangar/rocket-punch-create-react-app-template/generate) ([github link](https://github.com/rocket-hangar/rocket-punch-create-react-app-template))

You can generate a project in Github with click this links above.

# 🎏 Set `rocket-punch` to your `create-react-app` project

[https://github.com/rocket-hangar/rocket-punch-create-react-app-template/compare/create-react-app-initialize...HEAD](https://github.com/rocket-hangar/rocket-punch-create-react-app-template/compare/create-react-app-initialize...HEAD)

You can refer this compare link for setting `rocket-punch` to your `create-react-app` project.

You need to just 3 things.

1. [Create `.packages.yaml` file.](https://github.com/rocket-hangar/rocket-punch-create-react-app-template/compare/create-react-app-initialize...278ca81e5eaaf4de38b57fa9c6c536290ad52aff#diff-1ed02b3afcba1812b68ab3eb2fac55c1R1)
2. [Install `rocket-punch` and add "scripts" in your `package.json` file.](https://github.com/rocket-hangar/rocket-punch-create-react-app-template/compare/create-react-app-initialize...278ca81e5eaaf4de38b57fa9c6c536290ad52aff#diff-b9cfc7f2cdf78a7f4b91a753d10865a2R24)
3. [If you use "typescript". add "baseUrl" in your `tsconfig.json` file.](https://github.com/rocket-hangar/rocket-punch-create-react-app-template/compare/create-react-app-initialize...278ca81e5eaaf4de38b57fa9c6c536290ad52aff#diff-e5e546dd2eb0351f813d63d1b39dbc48R21)

# 🗄 Available Import Types

[https://github.com/rocket-hangar/rocket-punch/tree/master/src/%40ssen/extended-compiler-host](https://github.com/rocket-hangar/rocket-punch/tree/master/src/%40ssen/extended-compiler-host)

You can refer this link.

`rocket-punch` supports import bundling some static file types.

### **Plain Text**

- `import string from './file.txt'`
- `import string from './file.md'`

### **YAML**

- `import object from './file.yaml'`
- `import object from './file.yml'`

### **Image**

- `import base64String from './file.jpg'`
- `import base64String from './file.jpeg'`
- `import base64String from './file.gif'`
- `import base64String from './file.png'`
- `import base64String from './file.webp'`

### **SVG**

- `import base64String, { ReactComponent } from './file.svg'`

# ⚙️ Configurations

## .packages.yaml

[https://github.com/rocket-hangar/rocket-punch/blob/master/src/rocket-punch/types.ts#L5](https://github.com/rocket-hangar/rocket-punch/blob/master/src/rocket-punch/types.ts#L5)

You can refer this typescript interface.

```yaml
your-package-name:
  version: 0.1.0
  tag: canary # if you want publish to another channel instead latest
  module: esm # you can choose module type between 'commonjs' and 'esm'
  compilerOptions: # if you want customize tsc compilerOptions of this package
    allowJs: false
  packageJson: # if you wnat to add properties to the package.json file of this package
    publishConfig:
      access: public

'@your-group/*': # you can config every packages in a group at once
  version: 0.1.0
```

## .package.json

You can config shareable `package.json` properties to your all packages.

Look at this file. [https://github.com/rocket-hangar/rocket-punch/blob/master/.package.json](https://github.com/rocket-hangar/rocket-punch/blob/master/.package.json)

## src/{package}/.package.ts

If you want to config more deeply into your package building.

You can use `.package.ts` file.

[https://github.com/rocket-hangar/rocket-punch/blob/master/src/rocket-punch/types.ts#L48](https://github.com/rocket-hangar/rocket-punch/blob/master/src/rocket-punch/types.ts#L48)

You can refer this typescript interface.

```tsx
import { CompilerOptionsTransformFunction } from 'rocket-punch';
import ts from 'typescript';

export const transformCompilerOptions: CompilerOptionsTransformFunction = (computedCompilerOptions) => {
  return {
    ...computedCompilerOptions,
    // TODO Customize typescript compilerOptions
  };
};
```

# FAQ

- You don't need to create a `package.json` file and write `dependencies` of `package.json`. `rocket-punch` will auto create the `package.json` file and will write `dependencies` with analysis the import statements of source codes. just run `rocket-punch build`
- It works javascript and typescript both.