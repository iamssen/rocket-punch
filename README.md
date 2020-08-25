# 🚀 Rocket Punch! 🥊

![CI](https://github.com/rocket-hangar/rocket-punch/workflows/CI/badge.svg)
![E2E](https://github.com/rocket-hangar/rocket-punch/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/rocket-hangar/rocket-punch/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/rocket-punch)
[![devDependencies Status](https://david-dm.org/rocket-hangar/rocket-punch/dev-status.svg?kill_cache=1)](https://david-dm.org/rocket-hangar/rocket-punch?type=dev)

🚀 Rocket Punch is a multi-package builder.

You can develop multi-packages without complexibility anywhere.

# Quick start the Node.js packages development

<https://github.com/rocket-hangar/rocket-punch-templates/tree/master/templates/packages>

```sh
# create a workspace directory
npx generate-github-directory https://github.com/rocket-hangar/workspace-template my-project
cd my-project

# create an app
npx generate-github-directory https://github.com/rocket-hangar/rocket-punch-templates/tree/master/templates/packages my-packages

# add "my-packages" to workspaces of package.json

# install
yarn

# start
cd my-packages

# start
yarn run test
```

# How to use `rocket-punch` on a `create-react-app` project

<https://github.com/rocket-hangar/rocket-punch-templates/tree/master/examples/create-react-app>

## 1. Create a project and install `rocket-punch`

```sh
npx create-react-app my-project --typescript

cd my-project

yarn add rocket-punch --dev
```

## 2. Edit `tsconfig.json`

Add `compilerOptions.baseUrl` property

```json
{
  "compilerOptions": {
    "baseUrl": "src"
  }
}
```

## 3. Edit `package.json`

Add scripts

```json
{
  "scripts": {
    "pack": "rocket-punch build",
    "publish": "rocket-punch publish"
  }
}
```

## 4. Create a sample package

```tsx
// src/sample-component/index.tsx
// `sample-component` is your package name
import React, { ReactNode } from 'react';

export interface SampleComponentProps {
  children: ReactNode;
}

export function SampleComponent({children}: SampleComponentProps) {
  return (
    <p>{children}</p>
  );
}
```

## 5. Create the `.packages.yaml`

```yaml
# listing your component `sample-component` 
sample-component:
  version: 1.1.0
  module: esm
```

## 6. Build and publish

```sh
yarn run pack # or npx rocket-punch build
yarn run publish # or npx rocket-punch publish 
```

## 7. Import your package to your App by absolute path

```diff
// src/App.tsx
import React from 'react';
import { SampleComponent } from 'sample-component';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
-        <p>
+        <SampleComponent>
          Edit <code>src/App.tsx</code> and save to reload.
-        </p>
+        </SampleComponent>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

# How to use `rocket-punch` on a `next` project

<https://github.com/rocket-hangar/rocket-punch-templates/tree/master/examples/nextjs>

## 1. Create a project and install `rocket-punch`

```sh
npx create-next-app --example with-typescript my-project

cd my-project

yarn add rocket-punch --dev
```

## 2. Edit `tsconfig.json`

Add `compilerOptions.baseUrl` property

```json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

## 3. Edit `package.json`

Add scripts

```json
{
  "scripts": {
    "pack": "rocket-punch build --source-root .",
    "publish": "rocket-punch publish --source-root ."
  }
}
```

## 4. Create a sample package

```tsx
// sample-component/index.tsx
// `sample-component` is your package name
import React from 'react';

interface Props {
  label: string;
}

export function Hi({ label }: Props) {
  return (
    <span role="img" aria-label={label}>
      👋
    </span>
  );
}
```

## 5. Create the `.packages.yaml`

```yaml
# listing your component `sample-component` 
sample-component:
  version: 1.1.0
  module: esm
```

## 6. Build and publish

```sh
yarn run pack # or npx rocket-punch build
yarn run publish # or npx rocket-punch publish 
```

## 7. Import your package to your App by absolute path

```diff
import Link from 'next/link'
import { Hi } from 'sample-component';
import Layout from '../components/Layout'

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
-    <h1>Hello Next.js 👋</h1>
+    <h1>Hello Next.js <Hi label="Hello Next.js"/></h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
)

export default IndexPage
```

# How to use `rocket-punch` on a `gatsby` project

<https://github.com/rocket-hangar/rocket-punch-templates/tree/master/examples/gatsby>

## 1. Create a project and install `rocket-punch`

```sh
gatsby new my-project https://github.com/gatsbyjs/gatsby-starter-hello-world

cd my-project

npm install rocket-punch --save-dev # install rocket-punch
```

## 2. Create `jsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": "src"
  }
}
```

## 3. Edit `package.json`

Add scripts

```json
{
  "scripts": {
    "pack": "rocket-punch build",
    "publish": "rocket-punch publish"
  }  
}
```

## 4. Create a sample package

```jsx
// src/sample-component/index.jsx
// `sample-component` is your package name
import React from 'react';

export function SampleComponent({text}) {
  return (
    <div>👋 {text}</div>
  );
}
```

## 5. Create the `.packages.yaml`

```yaml
# listing your component `sample-component` 
sample-component:
  version: 1.1.0
  module: esm
```

## 6. Build and publish

```sh
npm run pack # or npx rocket-punch build
npm run publish # or npx rocket-punch publish 
```

## 7. Import your package to your App by absolute path

Add `gatsy-node.js`

```js
const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  })
}
```

Edit `src/pages/index.js`

```diff
// src/pages/index.js
import React from "react"
+import { SampleComponent } from 'sample-component';

export default function Home() {
-  return <div>Hello world!</div>
+  return <div><SampleComponent text="Hello world!"/></div>
}
```

# More repositories for reference

- <https://github.com/rocket-hangar/rocket-punch-templates>
- <https://github.com/rocket-hangar/rocket-scripts/tree/master/source>
- <https://github.com/rocket-hangar/generate-github-directory/tree/master/source>

# API

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