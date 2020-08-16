# 🚀 Rocket Punch! 🥊

![CI](https://github.com/rocket-hangar/rocket-punch/workflows/CI/badge.svg)
![E2E](https://github.com/rocket-hangar/rocket-punch/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/rocket-hangar/rocket-punch/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/rocket-punch)
[![devDependencies Status](https://david-dm.org/rocket-hangar/rocket-punch/dev-status.svg?kill_cache=1)](https://david-dm.org/rocket-hangar/rocket-punch?type=dev)

# What is this tool for doing?

This is a tool for building multiple packages in a project and publishing them to the registry like the NPM.

![introduce rocket-punch](https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/main.png)

Usage is simple.

1. It builds the subdirectories under the `/src` to the `/out/packages` directory by `rocket-punch build` command.
2. And it publishes to a registry (e.g. NPM) by `rocket-punch publish` command.

<details><summary>You can see screenshots 🌠 of the commands in action.</summary>
<p>
<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/screenshot-build.png" width="700" style="max-width: 700px" />
<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/screenshot-publish.png" width="700" style="max-width: 700px" />
</p>
</details>

That's it.

You don't need some complex commands and many configuration files.

Also, there are few advantages.

<details><summary><code>dependencies</code> will be entered automatically.</summary>
<p>

When executing the `rocket-punch build` command, it analyzes the package's sources to be built.

After collecting the `import`, `import()`, `require()` and `require.resolve()` statements, the collected items are used to automatically enter `dependencies` in the `package.json` file.

</p>
</details>

<details><summary>The correct <code>*.d.ts</code> files will be created.</summary>
<p>

When creating a package using bundlers such as Rollup or Webpack, there is a problem that `*.d.ts` files are created incorrectly.

However, Rocket-punch uses the TypeScript Compiler API, not bundler, `*.d.ts` files are created correctly.

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/typescript-definitions-sample.png" width="500" style="max-width: 500px" />

It will create `*.d.ts` files that match the `*.js` files precisely like the above image.

</p>
</details>

# How to use it?

Let's see through examples of how Rocket-punch can be applied to actual projects.

<details><summary>When you only need to make packages.</summary>
<p>

[https://github.com/rocket-hangar/rocket-punch-template](https://github.com/rocket-hangar/rocket-punch-template)

1. There is the [sample-package](https://github.com/rocket-hangar/rocket-punch-template/tree/master/src/sample-package) directory in the `/src` directory.
2. Let's check the [.packages.yaml](https://github.com/rocket-hangar/rocket-punch-template/blob/master/.packages.yaml) file. Information about the `sample-package` is entered.
3. Let's check the [package.json](https://github.com/rocket-hangar/rocket-punch-template/blob/master/package.json) file. In the `scripts` section, you can see the scripts using `rocket-punch build` and `rocket-punch publish`.
4. Let's check the [jest.config.js](https://github.com/rocket-hangar/rocket-punch-template/blob/master/jest.config.js) file. By using the `jestPreset` provided by Rocket-punch, you can configure the test environment more simply.

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/use-this-template.png" width="400" style="max-width: 400px"/>

You can also create a project right away by clicking the "Use this template" button.

</p>
</details>

<details><summary>When you want to publish the directories in the <b>Create-React-App</b> project as packages.</summary>
<p>

[https://github.com/rocket-hangar/rocket-punch-create-react-app-template](https://github.com/rocket-hangar/rocket-punch-create-react-app-template)

1. There is the directory [some-package](https://github.com/rocket-hangar/rocket-punch-create-react-app-template/tree/master/src/some-component) in the `/src` directory.
2. Let's check the [.packages.yaml](https://github.com/rocket-hangar/rocket-punch-create-react-app-template/compare/create-react-app-initialize...HEAD#diff-1ed02b3afcba1812b68ab3eb2fac55c1R1) file. Information about the `some-package` is entered.
3. Let's check the [package.json](https://github.com/rocket-hangar/rocket-punch-create-react-app-template/compare/create-react-app-initialize...HEAD#diff-b9cfc7f2cdf78a7f4b91a753d10865a2R24) file. pack and publish have been added to the `scripts` section. You can build packages using the `npm run pack` command, and publish the built packages using the `npm run publish` command.
4. Let's check the [tsconfig.json](https://github.com/rocket-hangar/rocket-punch-create-react-app-template/compare/create-react-app-initialize...HEAD#diff-e5e546dd2eb0351f813d63d1b39dbc48R21) file. You can see that `"baseUrl": "src"` has been added. You need to add `"baseUrl": "src"` to import with absolute paths like `import {} from 'some-package'` in TypeScript source.

[https://github.com/rocket-hangar/rocket-punch-create-react-app-template/compare/create-react-app-initialize...HEAD](https://github.com/rocket-hangar/rocket-punch-create-react-app-template/compare/create-react-app-initialize...HEAD)

You can check what needs to be added in the initial project created by the `create-react-app` command through "Comparing Changes" above.

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/use-this-template.png" width="400" style="max-width: 400px"/>

You can also create a project right away by clicking the "Use this template" button. (However, it is not recommened to use the template because the template of `create-react-app` can be updated.)

</p>
</details>

<details><summary>When you want to publish the directories in the <b>Next.js</b> project as packages.</summary>
<p>

[https://github.com/rocket-hangar/rocket-punch-next-template](https://github.com/rocket-hangar/rocket-punch-next-template)

The basic template of Next.js is different from other toolchains, so the project is created without `/src` directory. The project root is the source root.

1. There is the directory [@ssen-temp/sample-next-component](https://github.com/rocket-hangar/rocket-punch-next-template/tree/master/%40ssen-temp/sample-next-component) in the `/src` directory.
2. Let's check the [.packages.yaml](https://github.com/rocket-hangar/rocket-punch-next-template/compare/next-initialized...HEAD#diff-1ed02b3afcba1812b68ab3eb2fac55c1R1) file. Information about the @ssen-temp/sample-next-component is entered.
3. Let's check the [package.json](https://github.com/rocket-hangar/rocket-punch-next-template/compare/next-initialized...HEAD#diff-b9cfc7f2cdf78a7f4b91a753d10865a2R8) file. `pack` and `publish` are added to the `scripts` section. You can build packages using the `npm run pack` command, and publish the built packages using the `npm run publish` command. Note that the source root has been reassigned like `rocket-punch build --source-root .`. Since the Next.js project is created without `/src` directory, you need to set the source root using the `--source-root .` parameter.
4. Let's check the [tsconfig.json](https://github.com/rocket-hangar/rocket-punch-next-template/compare/next-initialized...HEAD#diff-e5e546dd2eb0351f813d63d1b39dbc48R20) file. You can see that `"baseUrl": "."` has been added. You need to add `"baseUrl": "."` to import with absolute paths like `import {} from '@ssen-temp/sample-next-component'` in TypeScript source.

[https://github.com/rocket-hangar/rocket-punch-next-template/compare/next-initialized...HEAD](https://github.com/rocket-hangar/rocket-punch-next-template/compare/next-initialized...HEAD)

You can check what needs to be added in the initial project created by the `create-next-app` command through "Comparing Changes" above.

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/use-this-template.png" width="400" style="max-width: 400px"/>

You can also create a project right away by clicking the "Use this template" button. (However, it is not recommended to use the template because the template of `create-next-app` can be updated.)

</p>
</details>

<details><summary>When you want to publish the directories in the <b>Gatsby</b> project as packages.</summary>
<p>

[https://github.com/rocket-hangar/rocket-punch-gatsby-template](https://github.com/rocket-hangar/rocket-punch-gatsby-template)

1. There is the directory [some-component](https://github.com/rocket-hangar/rocket-punch-gatsby-template/tree/master/src/some-component) in the `/src` directory.
2. Let's check the [.packages.yaml](https://github.com/rocket-hangar/rocket-punch-gatsby-template/compare/gatsby-initialized...HEAD#diff-1ed02b3afcba1812b68ab3eb2fac55c1R1) file. Information about the `some-component` is entered.
3. Let's check the [package.json](https://github.com/rocket-hangar/rocket-punch-gatsby-template/compare/gatsby-initialized...HEAD#diff-b9cfc7f2cdf78a7f4b91a753d10865a2R14) file. `pack` and `publish` are added to the `scripts` section. You can build packages using the `npm run pack` command, and publish the built packages using the `npm run publish` command.
4. Let's check the [gatsby-config.json](https://github.com/rocket-hangar/rocket-punch-gatsby-template/compare/gatsby-initialized...HEAD#diff-b9e136416b90437fa1dac910280b45fcR10) file. You can see that `gatsby-plugin-typescript` has been added to use TypeScript.
5. Let's check the [tsconfig.json](https://github.com/rocket-hangar/rocket-punch-gatsby-template/compare/gatsby-initialized...HEAD#diff-e5e546dd2eb0351f813d63d1b39dbc48R2) file. You can see that `"baseUrl": "src"` has been added. You need to add that configuration to import directories with absolute paths like `import {} from 'some-component'`.
6. Let's check the [gatsby-node.json](https://github.com/rocket-hangar/rocket-punch-gatsby-template/compare/gatsby-initialized...HEAD#diff-fda05457e393bada716f508859bfc604R1) file. The `gatsby-plugin-typescript` uses `babel-preset-typescript`, absolute path import will not work even if `"baseUrl": "src"` is added in the `tsconfig.json` file. So you need to set the `alias` or `resolve` of Webpack. (There are Gatsby plugin like the [gatsby-plugin-root-import](https://www.gatsbyjs.com/plugins/gatsby-plugin-root-import/), but in my case, it didn't work.)

[https://github.com/rocket-hangar/rocket-punch-gatsby-template/compare/gatsby-initialized...HEAD](https://github.com/rocket-hangar/rocket-punch-gatsby-template/compare/gatsby-initialized...HEAD)

You can check what needs to be added in the initial project created by the `gatsby create` command through "Comparing Changes" above.

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/use-this-template.png" width="400" style="max-width: 400px"/>

You can also create a project right away by clicking the "Use this template" button. (However, it is not recommended to use the template because the template of `gatsby create` can be updated.)

</p>
</details>

# More detailed usage

## Command Line Tools

`rocket-punch build`

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/commands-build.png" width="800" style="max-width: 800px"/>

Build the subdirectories in the `/src` directory into the `/out/packages` directory.

`rocket-punch publish`

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/commands-publish.png" width="800" style="max-width: 800px"/>

Publish packages built with `/out/packages` to a registry like the NPM. (You must be logged in to the registry with `npm login` command.)

`rocket-punch doctor`

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/commands-doctor.png" width="800" style="max-width: 800px"/>

Check that there are no problem with the current project. (In fact, it's not useful yet. 💦)

`rocket-punch view`

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/commands-view.png" width="800" style="max-width: 800px"/>

Check the local and remote information of packages.

`rocket-punch help`

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/commands-help.png" width="800" style="max-width: 800px"/>

## API

Rocket-punch has features that are not accessible with the `rocket-punch` CLI commands. (e.g. TypeScript AST Transformer.) If you want, you can write a script using API and executing it using `node` or `ts-node`.

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/doc-assets/api.png" width="700" style="max-width: 700px"/>

The API comes with a TypeScript Definition written by JSDoc.

## File types that can be imported

Rocket-punch is not a bundler like Rollup or Webpack. However, it has a basic level of Static File import functionality. The following types of files can be imported.

**Plain Text**

- `import string from './file.txt'`
- `import string from './file.md'`

**YAML**

- `import object from './file.yaml'`
- `import object from './file.yml'`

**Image**

- `import base64String from './file.jpg'`
- `import base64String from './file.jpeg'`
- `import base64String from './file.gif'`
- `import base64String from './file.png'`
- `import base64String from './file.webp'`

**SVG**

- `import base64String, { ReactComponent } from './file.svg'`

## Directory Rules

1. When building a package, directories with names such as `__*__` are excluded. Directories with names like `__tests__` or `__stories__` will not be included in the package.
2. Files in the `src/<package>/public` directory are not compiled, only copied. In some cases, if you need to include static files or files that should not be built, such as `jquery.js` in your package, you can use the `public` directory.
3. The `src/<package>/bin` directory is also copied only, not compiled. So, don't write the script inside the `bin` directory in TypeScript.

## package.json settings

`.package.json`

If this file is on the project root, it will be applied in common to all `package.json` files to be built.

```yaml
some-package:
  version: 0.1.0
  packageJson:
    keywords:
      - react
      - component
```

Entering the `packageJson` entry applies it to the individual `package.json` files to be built.

## Setting TypeScript Compiler's compilerOptions

`tsconfig.json`

Use `compilerOptions` of the `tsconfig.json` file on Project Root.

```yaml
some-package:
  version: 0.1.0
  compilerOptions:
  jsx: react
```

Entering the `compilerOptions` item will be used in the TypeScript compile process of individual packages to be built.

However, some items in the `compilerOptions` you enter may be overridden during Rocket-punch's build process. More details can be found in the [getCompilerOptions.ts](https://github.com/rocket-hangar/rocket-punch/blob/master/src/rocket-punch/rule/getCompilerOptions.ts) file.

# Advanced strategy

- [Test packages made by rocket-punch on isolated environemnts like monorepo](https://github.com/rocket-hangar/rocket-punch-workspace-example)