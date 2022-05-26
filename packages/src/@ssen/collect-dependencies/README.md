# `@ssen/collect-dependencies`

It will collect dependencies (package names) by analyze `import`, `import()`, `require()` and `require.resolve()` of JS and TS source codes of a directory.

```ts
import {
  collectDependencies,
  collectScripts,
  PackageInfo,
} from '@ssen/collect-dependencies';
import type { PackageJson } from 'type-fest';

const dependencies: PackageJson.Dependency = await collectDependencies({
  rootDir: '/project/src',
  externalPackages: require('project/package.json').dependencies,
  internalPackages: new Map<string, PackageInfo>([
    [
      '@ssen/tmp-directory',
      {
        name: '@ssen/tmp-directory',
        version: '0.1.0',
      },
    ],
  ]),
  ...collectScripts,
});

console.log(dependencies);
```

# API

```ts
import {
  collectDependencies,
  collectScripts,
  PackageInfo,
} from '@ssen/collect-dependencies';
import type { PackageJson } from 'type-fest';

async function collectDependencies(params: {
  // source directory
  rootDir: string;
  // dependency references
  internalPackages?: Map<string, PackageInfo>;
  externalPackages: PackageJson.Dependency;
  // typescript configs
  extensions?: string[];
  excludes?: string[];
  includes?: string[];
  compilerOptions?: ts.CompilerOptions;
  // if you want to do not collect some dependencies like this `import {} from 'self-package-name'`
  // you can pass this like { selfNames: new Set(['self-package-name']) }
  selfNames?: Set<string>;
  fixImportPath?: (args: { importPath: string; filePath: string }) => string;
  // if you set this to 'pass'
  // when find the undefined package name
  // it does not throw a error
  checkUndefinedPackage?: 'error' | 'pass';
}): Promise<PackageJson.Dependency>;
```

# Test Codes

<!-- source __tests__/*.test.ts -->

[\_\_tests\_\_/case1.test.ts](__tests__/case1.test.ts)

```ts
import type { PackageJson } from 'type-fest';
import { getPackagesOrder } from '../getPackagesOrder';
import { describe, test, expect } from 'vitest';

describe('getPackagesOrder()', () => {
  test('frontend-components failed', () => {
    // it error throwed by not filtered dependencies
    // and it solved by fix collectTypeScript() and collectScript()
    expect(() => getPackagesOrder({ packageJsonContents })).toThrow();
  });
});

const packageJsonContents: PackageJson[] = [
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@ssen/snackbar',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@ssen/snackbar',
    version: '2.0.0-alpha.1',
    dependencies: {
      '@material-ui/core': '^4.9.13',
      '@material-ui/icons': '^4.5.1',
      '@storybook/react': '^5.3.17',
      'react': '^16.13.1',
      'styled-components': '^5.0.0',
      'event-target-shim': '^5.0.1',
      'react-dom': '^16.13.1',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/handbook',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/handbook',
    version: '5.0.0-alpha.1',
    dependencies: {
      '@handbook/components': '^2.0.0-alpha.1',
      '@lunit/insight-viewer': '^5.0.0-alpha.1',
      '@lunit/opt-components': '^5.0.0-alpha.1',
      '@ssen/snackbar': '^2.0.0-alpha.1',
      'react': '^16.13.1',
      'styled-components': '^5.0.0',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/heatmap',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/heatmap',
    version: '5.0.0-alpha.1',
    dependencies: {
      '@handbook/components': '^2.0.0-alpha.1',
      '@handbook/source': '^2.0.0-alpha.1',
      'react': '^16.13.1',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/insight-draw',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/insight-draw',
    version: '5.0.0-alpha.1',
    dependencies: {
      '@handbook/source': '^2.0.0-alpha.1',
      'react': '^16.13.1',
      'csstype': '^2.6.10',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/insight-ui',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/insight-ui',
    version: '5.0.0-alpha.1',
    dependencies: {},
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/insight-viewer',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/insight-viewer',
    version: '5.0.0-alpha.1',
    dependencies: {
      '@handbook/components': '^2.0.0-alpha.1',
      '@handbook/source': '^2.0.0-alpha.1',
      'react': '^16.13.1',
      'styled-components': '^5.0.0',
      'rxjs': '^6.5.4',
      'd3-color': '^1.4.0',
      '@material-ui/core': '^4.9.13',
      '@lunit/insight-draw': '^5.0.0-alpha.1',
      '@lunit/is-touch-device': '^5.0.0-alpha.1',
      'polylabel': '^1.0.2',
      '@lunit/heatmap': '^5.0.0-alpha.1',
      '@lunit/use-opt-control': '^5.0.0-alpha.1',
      'd3-ease': '^1.0.6',
      'd3-timer': '^1.0.10',
      'point-in-polygon': '^1.0.1',
      '@lunit/is-complex-polygon': '^5.0.0-alpha.1',
      '@lunit/is-polygon-area-greater-than-area': '^5.0.0-alpha.1',
      'csstype': '^2.6.10',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/is-complex-polygon',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/is-complex-polygon',
    version: '5.0.0-alpha.1',
    dependencies: {
      '@lunit/is-intersection': '^5.0.0-alpha.1',
      '@lunit/insight-viewer': '^5.0.0-alpha.1',
      'react': '^16.13.1',
      '@handbook/source': '^2.0.0-alpha.1',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/is-intersection',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/is-intersection',
    version: '5.0.0-alpha.1',
    dependencies: { '@handbook/source': '^2.0.0-alpha.1' },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/is-polygon-area-greater-than-area',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/is-polygon-area-greater-than-area',
    version: '5.0.0-alpha.1',
    dependencies: {
      '@lunit/insight-viewer': '^5.0.0-alpha.1',
      'react': '^16.13.1',
      '@handbook/source': '^2.0.0-alpha.1',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/is-touch-device',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/is-touch-device',
    version: '5.0.0-alpha.1',
    dependencies: {},
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/new-window',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/new-window',
    version: '5.0.0-alpha.1',
    dependencies: {
      'react': '^16.13.1',
      '@handbook/source': '^2.0.0-alpha.1',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/opt-components',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/opt-components',
    version: '5.0.0-alpha.1',
    dependencies: {
      '@lunit/insight-viewer': '^5.0.0-alpha.1',
      '@lunit/opt-control-icons': '^5.0.0-alpha.1',
      '@storybook/react': '^5.3.17',
      'react': '^16.13.1',
      'styled-components': '^5.0.0',
      '@material-ui/core': '^4.9.13',
      '@material-ui/icons': '^4.5.1',
      '@ssen/snackbar': '^2.0.0-alpha.1',
      'history': '^4.10.1',
      'react-router-dom': '^5.1.2',
      'use-resize-observer': '^6.0.0',
      '@lunit/is-touch-device': '^5.0.0-alpha.1',
      'resize-observer-polyfill': '^1.5.1',
      '@material-ui/styles': '^4.9.13',
      '@lunit/use-dialog': '^5.0.0-alpha.1',
      'csstype': '^2.6.10',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/opt-control-icons',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/opt-control-icons',
    version: '5.0.0-alpha.1',
    dependencies: {
      '@material-ui/core': '^4.9.13',
      '@material-ui/icons': '^4.5.1',
      'react': '^16.13.1',
      '@handbook/source': '^2.0.0-alpha.1',
      'styled-components': '^5.0.0',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/opt-login-components',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/opt-login-components',
    version: '5.0.0-alpha.1',
    dependencies: {
      '@lunit/insight-viewer': '^5.0.0-alpha.1',
      '@lunit/opt-components': '^5.0.0-alpha.1',
      '@storybook/react': '^5.3.17',
      'react': '^16.13.1',
      '@material-ui/core': '^4.9.13',
      'styled-components': '^5.0.0',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/screenshot',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/screenshot',
    version: '5.0.0-alpha.1',
    dependencies: { 'fs-extra': '^9.0.0', 'puppeteer': '^3.0.3' },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/timeout',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/timeout',
    version: '5.0.0-alpha.1',
    dependencies: {},
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/use-control-log',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/use-control-log',
    version: '5.0.0-alpha.1',
    dependencies: { react: '^16.13.1' },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/use-dialog',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/use-dialog',
    version: '5.0.0-alpha.1',
    dependencies: {
      'react': '^16.13.1',
      '@handbook/source': '^2.0.0-alpha.1',
      '@lunit/opt-components': '^5.0.0-alpha.1',
      '@material-ui/core': '^4.9.13',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/use-opt-control',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/use-opt-control',
    version: '5.0.0-alpha.1',
    dependencies: {
      'react': '^16.13.1',
      '@handbook/source': '^2.0.0-alpha.1',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/use-reset-time',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/use-reset-time',
    version: '5.0.0-alpha.1',
    dependencies: {
      'react': '^16.13.1',
      '@handbook/source': '^2.0.0-alpha.1',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@lunit/use-shortcut',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@lunit/use-shortcut',
    version: '5.0.0-alpha.1',
    dependencies: {
      'react': '^16.13.1',
      '@handbook/source': '^2.0.0-alpha.1',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@handbook/code-block',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@handbook/code-block',
    version: '2.0.0-alpha.1',
    dependencies: {
      'prism-react-renderer': '^1.0.2',
      'react': '^16.13.1',
      '@mdx-js/react': '^1.6.1',
      'react-live': '^2.2.2',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@handbook/components',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@handbook/components',
    version: '2.0.0-alpha.1',
    dependencies: {
      '@handbook/source': '^2.0.0-alpha.1',
      '@handbook/code-block': '^2.0.0-alpha.1',
      '@material-ui/core': '^4.9.13',
      '@material-ui/icons': '^4.5.1',
      'prism-react-renderer': '^1.0.2',
      'react': '^16.13.1',
      'styled-components': '^5.0.0',
      '@mdx-js/react': '^1.6.1',
      'react-router-dom': '^5.1.2',
      'slugify': '^1.4.0',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
  {
    author: 'SSen <i@ssen.name>',
    license: 'MIT',
    repository: 'github:lunit/frontend-components',
    bugs: 'https://github.com/lunit/frontend-components/issues',
    homepage:
      'https://github.com/lunit/frontend-components/tree/master/src/@handbook/source',
    engines: { node: '>=10' },
    publishConfig: { access: 'public' },
    name: '@handbook/source',
    version: '2.0.0-alpha.1',
    dependencies: {
      'react': '^16.13.1',
      '@handbook/code-block': '^2.0.0-alpha.1',
    },
    main: 'index.js',
    typings: 'index.d.ts',
  },
];
```

[\_\_tests\_\_/case2.test.ts](__tests__/case2.test.ts)

```ts
import { getPackagesOrder } from '../getPackagesOrder';
import type { PackageJson } from 'type-fest';
import { describe, test, expect } from 'vitest';

describe('getPackagesOrder()', () => {
  test('anchor failed', () => {
    const order = getPackagesOrder({ packageJsonContents });

    expect(order).toMatchSnapshot();
  });
});

const packageJsonContents: PackageJson[] = [
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@anchor-protocol/icons',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@anchor-protocol/icons',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@material-ui/core': '^4.11.3',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@anchor-protocol/notation',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@anchor-protocol/notation',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/big-interpolate': '^0.16.0-alpha.3',
      'big.js': '^6.1.1',
      'd3-ease': '^2.0.0',
      'd3-timer': '^2.0.0',
      '@anchor-protocol/types': '^0.16.0-alpha.3',
      'numeral': '^2.0.6',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
    peerDependenciesMeta: {
      react: {
        optional: true,
      },
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@anchor-protocol/token-icons',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@anchor-protocol/token-icons',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react': '^17.0.0',
      'styled-components': '^5.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@anchor-protocol/types',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@anchor-protocol/types',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@anchor-protocol/webapp-charts',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@anchor-protocol/webapp-charts',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/neumorphism-ui': '^0.16.0-alpha.3',
      '@anchor-protocol/notation': '^0.16.0-alpha.3',
      '@anchor-protocol/types': '^0.16.0-alpha.3',
      'd3-scale': '^3.3.0',
      'd3-shape': '^2.1.0',
      'date-fns': '^2.22.1',
      'use-resize-observer': '^7.0.0',
      '@terra-dev/styled-neumorphism': '^0.16.0-alpha.3',
      '@terra-dev/is-touch-device': '^0.16.0-alpha.3',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react': '^17.0.0',
      'styled-components': '^5.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@anchor-protocol/webapp-fns',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@anchor-protocol/webapp-fns',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@anchor-protocol/anchor.js': '^1.0.1',
      '@anchor-protocol/types': '^0.16.0-alpha.3',
      'big.js': '^6.1.1',
      '@anchor-protocol/notation': '^0.16.0-alpha.3',
      '@terra-dev/big-math': '^0.16.0-alpha.3',
      '@terra-money/webapp-fns': '^0.16.0-alpha.3',
      '@rx-stream/pipe': '^0.7.0',
      '@terra-dev/wallet-types': '^0.16.0-alpha.3',
      '@terra-money/terra.js': '^1.8.0',
      'rxjs': '^7.1.0',
      '@terra-dev/tx-helpers': '^0.16.0-alpha.3',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react-query': '^3.14.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@anchor-protocol/webapp-provider',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@anchor-protocol/webapp-provider',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-money/webapp-fns': '^0.16.0-alpha.3',
      '@anchor-protocol/anchor.js': '^1.0.1',
      '@anchor-protocol/types': '^0.16.0-alpha.3',
      '@anchor-protocol/webapp-fns': '^0.16.0-alpha.3',
      '@terra-dev/use-form': '^0.16.0-alpha.3',
      '@rx-stream/react': '^0.7.0',
      '@anchor-protocol/notation': '^0.16.0-alpha.3',
      'big.js': '^6.1.1',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react': '^17.0.0',
      'react-query': '^3.14.0',
      '@terra-money/wallet-provider': '^0.16.0-alpha.3',
      '@terra-money/webapp-provider': '^0.16.0-alpha.3',
      '@terra-dev/use-browser-inactive': '^0.16.0-alpha.3',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-money/wallet-provider',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-money/wallet-provider',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/chrome-extension': '^0.16.0-alpha.3',
      '@terra-dev/is-desktop-chrome': '^0.16.0-alpha.3',
      '@terra-dev/readonly-wallet': '^0.16.0-alpha.3',
      '@terra-dev/readonly-wallet-modal': '^0.16.0-alpha.3',
      '@terra-dev/wallet-types': '^0.16.0-alpha.3',
      '@terra-dev/walletconnect': '^0.16.0-alpha.3',
      '@terra-dev/web-extension': '^0.4.0',
      '@terra-money/terra.js': '^1.8.0',
      'fast-deep-equal': '^3.1.3',
      'rxjs': '^7.1.0',
      '@terra-dev/use-interval': '^0.16.0-alpha.3',
      '@terra-dev/mathwallet': '^0.16.0-alpha.3',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react': '^17.0.0',
      'react-router-dom': '^5.0.0',
    },
    peerDependenciesMeta: {
      'react': {
        optional: true,
      },
      'react-router-dom': {
        optional: true,
      },
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-money/webapp-fns',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-money/webapp-fns',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/wallet-types': '^0.16.0-alpha.3',
      '@terra-money/terra.js': '^1.8.0',
    },
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-money/webapp-provider',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-money/webapp-provider',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/use-longtime-no-see': '^0.16.0-alpha.3',
      '@terra-money/webapp-fns': '^0.16.0-alpha.3',
      'fast-deep-equal': '^3.1.3',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react': '^17.0.0',
      'react-query': '^3.14.0',
      '@terra-money/wallet-provider': '^0.16.0-alpha.3',
      '@terra-dev/use-browser-inactive': '^0.16.0-alpha.3',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/audit-fastdom',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/audit-fastdom',
    version: '0.16.0-alpha.3',
    dependencies: {
      fastdom: '^1.0.10',
    },
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/big-interpolate',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/big-interpolate',
    version: '0.16.0-alpha.3',
    dependencies: {
      'big.js': '^6.1.1',
      'd3-ease': '^2.0.0',
    },
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/big-math',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/big-math',
    version: '0.16.0-alpha.3',
    dependencies: {
      'big.js': '^6.1.1',
    },
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/chrome-extension',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/chrome-extension',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/is-desktop-chrome': '^0.16.0-alpha.3',
      '@terra-dev/wallet-types': '^0.16.0-alpha.3',
      '@terra-money/terra.js': '^1.8.0',
      'rxjs': '^7.1.0',
    },
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/is-desktop-chrome',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/is-desktop-chrome',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/mathwallet': '^0.16.0-alpha.3',
      'bowser': '^2.11.0',
      'mobile-detect': '^1.4.5',
    },
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/is-mobile',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/is-mobile',
    version: '0.16.0-alpha.3',
    dependencies: {
      'mobile-detect': '^1.4.5',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
    peerDependenciesMeta: {
      react: {
        optional: true,
      },
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/is-touch-device',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/is-touch-device',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/is-zero',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/is-zero',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/mathwallet',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/mathwallet',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/neumorphism-ui',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/neumorphism-ui',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/styled-neumorphism': '^0.16.0-alpha.3',
      '@material-ui/core': '^4.11.3',
      'd3-ease': '^2.0.0',
      'd3-interpolate': '^2.0.1',
      'd3-selection': '^2.0.0',
      'd3-timer': '^2.0.0',
      'use-resize-observer': '^7.0.0',
      'resize-observer-polyfill': '^1.5.1',
      '@material-ui/icons': '^4.11.2',
      '@terra-dev/is-touch-device': '^0.16.0-alpha.3',
      '@terra-dev/use-restricted-input': '^0.16.0-alpha.3',
      'downshift': '^6.1.3',
      'color': '^3.1.3',
      '@terra-dev/use-dialog': '^0.16.0-alpha.3',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react': '^17.0.0',
      'styled-components': '^5.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/patch-react-query-focus-refetching',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/patch-react-query-focus-refetching',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react-query': '^3.14.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/readonly-wallet',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/readonly-wallet',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-money/terra.js': '^1.8.0',
      '@terra-dev/wallet-types': '^0.16.0-alpha.3',
    },
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/readonly-wallet-modal',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/readonly-wallet-modal',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/readonly-wallet': '^0.16.0-alpha.3',
      '@terra-dev/wallet-types': '^0.16.0-alpha.3',
      '@terra-money/terra.js': '^1.8.0',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react': '^17.0.0',
      'react-dom': '^17.0.0',
      'styled-components': '^5.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/sendinblue',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/sendinblue',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
    peerDependenciesMeta: {
      react: {
        optional: true,
      },
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/snackbar',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/snackbar',
    version: '0.16.0-alpha.3',
    dependencies: {
      'event-target-shim': '^6.0.2',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react': '^17.0.0',
      'react-dom': '^17.0.0',
      'styled-components': '^5.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/styled-neumorphism',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/styled-neumorphism',
    version: '0.16.0-alpha.3',
    dependencies: {
      color: '^3.1.3',
    },
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/tx-helpers',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/tx-helpers',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/wallet-types': '^0.16.0-alpha.3',
    },
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-array-pagination',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-array-pagination',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-browser-inactive',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-browser-inactive',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-cloudflare-analytics',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-cloudflare-analytics',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-dialog',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-dialog',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-element-intersection',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-element-intersection',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-form',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-form',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-google-analytics',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-google-analytics',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react': '^17.0.0',
      'react-router-dom': '^5.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-interval',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-interval',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-local-storage',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-local-storage',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-longtime-no-see',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-longtime-no-see',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-map',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-map',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-resolve-last',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-resolve-last',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-restricted-input',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-restricted-input',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-router-scroll-restoration',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-router-scroll-restoration',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react': '^17.0.0',
      'react-router-dom': '^5.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-string-bytes-length',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-string-bytes-length',
    version: '0.16.0-alpha.3',
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/use-time-end',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/use-time-end',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/use-interval': '^0.16.0-alpha.3',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      react: '^17.0.0',
    },
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/wallet-types',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/wallet-types',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-money/terra.js': '^1.8.0',
    },
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/walletconnect',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/walletconnect',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/is-mobile': '^0.16.0-alpha.3',
      '@terra-dev/walletconnect-qrcode-modal': '^0.16.0-alpha.3',
      '@terra-money/terra.js': '^1.8.0',
      '@walletconnect/core': '^1.4.1',
      '@walletconnect/iso-crypto': '^1.4.1',
      '@walletconnect/types': '^1.4.1',
      '@walletconnect/utils': '^1.4.1',
      'rxjs': '^7.1.0',
      'ws': '^7.4.6',
    },
    main: './_commonjs/index.js',
    module: './index.js',
  },
  {
    author: 'Ian <ian@terra.money>',
    license: 'Apache-2.0',
    repository: 'github:Anchor-Protocol/anchor-web-app',
    bugs: 'https://github.com/Anchor-Protocol/anchor-web-app/issues',
    homepage:
      'https://github.com/Anchor-Protocol/anchor-web-app/tree/master/packages/src/@terra-dev/walletconnect-qrcode-modal',
    engines: {
      node: '>=12',
    },
    publishConfig: {
      cache: '~/.npm',
      access: 'public',
    },
    typings: 'index.d.ts',
    name: '@terra-dev/walletconnect-qrcode-modal',
    version: '0.16.0-alpha.3',
    dependencies: {
      '@terra-dev/is-mobile': '^0.16.0-alpha.3',
      '@walletconnect/types': '^1.4.1',
      'qrcode.react': '^1.0.1',
    },
    main: './_commonjs/index.js',
    module: './index.js',
    peerDependencies: {
      'react': '^17.0.0',
      'react-dom': '^17.0.0',
      'styled-components': '^5.0.0',
    },
  },
];
```

[\_\_tests\_\_/collectDependencies.test.ts](__tests__/collectDependencies.test.ts)

```ts
import {
  collectDependencies,
  collectScripts,
  collectTypeScript,
  PackageInfo,
} from '@ssen/collect-dependencies';
import { rewriteSrcPath } from '@ssen/rewrite-src-path';
import fs from 'fs-extra';
import path from 'path';
import process from 'process';
import type { PackageJson } from 'type-fest';
import { describe, test, expect } from 'vitest';

describe('collectDependencies()', () => {
  test('should get all dependencies from typescript sources', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(
      process.cwd(),
      'test/fixtures/collect-dependencies/ts',
    );
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map([
      [
        '@ssen/tmp-directory',
        {
          name: '@ssen/tmp-directory',
          version: '0.1.0',
        },
      ],
    ]);
    const externalPackages: PackageJson.Dependency = require(path.join(
      rootDir,
      'package.json',
    )).dependencies;

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages,
      externalPackages,
      ...collectTypeScript,
    });

    // Assert
    // imported from externalPackages
    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();
    // imported from internalPackages
    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should work with default config', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(
      process.cwd(),
      'test/fixtures/collect-dependencies/ts',
    );
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<
      string,
      PackageInfo
    >([
      [
        '@ssen/tmp-directory',
        {
          name: '@ssen/tmp-directory',
          version: '0.1.0',
        },
      ],
    ]);
    const externalPackages: PackageJson.Dependency = require(path.join(
      rootDir,
      'package.json',
    )).dependencies;

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages,
      externalPackages,
    });

    // Assert
    // imported from externalPackages
    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();
    // imported from internalPackages
    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should get all dependencies from javascript sources', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(
      process.cwd(),
      'test/fixtures/collect-dependencies/js',
    );
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<
      string,
      PackageInfo
    >([
      [
        '@ssen/tmp-directory',
        {
          name: '@ssen/tmp-directory',
          version: '0.1.0',
        },
      ],
    ]);
    const externalPackages: PackageJson.Dependency = require(path.join(
      rootDir,
      'package.json',
    )).dependencies;

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages,
      externalPackages,
      ...collectScripts,
    });

    // Assert
    // imported from externalPackages
    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();
    // imported from internalPackages
    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should get all dependencies without self name', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(
      process.cwd(),
      'test/fixtures/collect-dependencies/self-name',
    );
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<
      string,
      PackageInfo
    >([
      [
        '@ssen/tmp-directory',
        {
          name: '@ssen/tmp-directory',
          version: '0.1.0',
        },
      ],
      [
        'imports',
        {
          name: 'imports',
          version: '0.1.0',
        },
      ],
    ]);
    const externalPackages: PackageJson.Dependency = require(path.join(
      rootDir,
      'package.json',
    )).dependencies;
    const selfNames: Set<string> = new Set<string>(['imports']);

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages,
      externalPackages,
      selfNames,
      ...collectScripts,
    });

    // Assert
    // imported from externalPackages
    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();
    // `imports` is self name when the build of `imports`
    // `import {} from 'imports'` would be ignored
    expect('imports' in dependencies).toBeFalsy();
    // imported from internalPackages
    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should can not get unspecified internal dependency', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(
      process.cwd(),
      'test/fixtures/collect-dependencies/ts',
    );
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<
      string,
      PackageInfo
    >();
    const externalPackages: PackageJson.Dependency = require(path.join(
      rootDir,
      'package.json',
    )).dependencies;
    const checkUndefinedPackage: 'pass' | 'error' = 'pass';

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages,
      externalPackages,
      checkUndefinedPackage,
      ...collectTypeScript,
    });

    // Assert
    // missing dependency will not throw an error just will be ignored
    expect('@ssen/tmp-directory' in dependencies).toBeFalsy();
  });

  test('should throw error with unspecified internal dependency', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(
      process.cwd(),
      'test/fixtures/collect-dependencies/ts',
    );
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<
      string,
      PackageInfo
    >();
    const externalPackages: PackageJson.Dependency = require(path.join(
      rootDir,
      'package.json',
    )).dependencies;
    const checkUndefinedPackage: 'pass' | 'error' = 'error';

    // Act
    // it will not find '@ssen/tmp-directory' package
    // because of the internalPackages does not have that package.
    // "checkUndefinedPackge: error" option will throw error when find undefined package.
    await expect(() =>
      collectDependencies({
        rootDir,
        internalPackages,
        externalPackages,
        checkUndefinedPackage,
        ...collectTypeScript,
      }),
    ).rejects.toThrow();
  });

  test('should fix import paths', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(
      process.cwd(),
      'test/fixtures/collect-dependencies/fix-import-path',
    );
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<
      string,
      PackageInfo
    >(
      ['b', 'c', 'd', 'e'].map((name) => [
        name,
        {
          name,
          version: '0.1.0',
        },
      ]),
    );
    const externalPackages: PackageJson.Dependency = {};
    const fixImportPath = ({
      importPath,
      filePath,
    }: {
      importPath: string;
      filePath: string;
    }) => {
      return rewriteSrcPath({
        rootDir,
        importPath,
        filePath,
      });
    };

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir: path.join(rootDir, 'a'),
      internalPackages,
      externalPackages,
      ...collectTypeScript,
      fixImportPath,
    });

    // Assert
    // `import {} from '../b'` is fixed to `import {} from 'b'` by fixImportPath option
    expect('b' in dependencies).toBeTruthy();
  });
});
```

[\_\_tests\_\_/getPackagesOrder.test.ts](__tests__/getPackagesOrder.test.ts)

```ts
import type { PackageJson } from 'type-fest';
import { getPackagesOrder } from '../getPackagesOrder';
import { describe, test, expect } from 'vitest';

describe('getPackagesOrder()', () => {
  test('should get the ordered names array', () => {
    // Arrange : get test condition and test result from function args
    function testFn(
      packageJsonContents: PackageJson[],
      matchOrderedNames: string[],
    ) {
      // Act
      const ordered = getPackagesOrder({ packageJsonContents });
      const orderedNames: string[] = ordered.map(({ name }) => name);

      // Assert
      // result should be equal with expected result
      expect(orderedNames).toEqual(matchOrderedNames);

      // Assert
      // verification result
      orderedNames.reverse().forEach((a: string, i: number) => {
        // sorted.slice(0, i) does not have a
        for (const b of orderedNames.slice(0, i)) {
          const aFile: PackageJson | undefined = packageJsonContents.find(
            ({ name }) => name === a,
          );
          expect(aFile).not.toBeUndefined();
          expect(Object.keys(aFile?.dependencies ?? {})).not.toEqual(
            expect.arrayContaining([b]),
          );
        }
      });
    }

    testFn(
      [
        {
          name: '@lunit/insight-viewer',
          dependencies: {
            'react': '>=16.8.0',
            'cornerstone-core': '^2.3.0',
            'cornerstone-wado-image-loader': '^2.2.3',
            'dicom-parser': '^1.8.3',
            'rxjs': '^6.5.2',
            'polylabel': '^1.0.2',
            'point-in-polygon': '^1.0.1',
            'styled-components': '>=4.3.2',
            '@material-ui/core': '^4.3.1',
            '@lunit/heatmap': '^1.0.0',
            '@lunit/is-complex-polygon': '^1.0.0',
            '@lunit/is-polygon-area-greater-than-area': '^1.0.0',
            'csstype': '^2.6.7',
            '@storybook/addons': '^5.2.8',
          },
        },
        {
          name: '@lunit/heatmap',
          dependencies: {
            react: '>=16.8.0',
          },
        },
      ],
      // Assert
      // @lunit/heatmap is higher order
      // because of @lunit/insight-viewer includes @lunit/heatmap
      ['@lunit/heatmap', '@lunit/insight-viewer'],
    );

    testFn(
      [
        {
          name: 'a',
          dependencies: {
            c: '0.0.0',
          },
        },
        {
          name: 'b',
          dependencies: {
            a: '0.0.0',
            c: '0.0.0',
          },
        },
        {
          name: 'c',
        },
        {
          name: 'd',
          dependencies: {
            e: '0.0.0',
            b: '0.0.0',
          },
        },
        {
          name: 'e',
        },
      ],
      // Assert
      // e
      // c
      // a { c }
      // b { a, c }
      // d { e, b: { a, c } }
      ['e', 'c', 'a', 'b', 'd'],
    );

    testFn(
      [
        {
          name: '@ssen/test-module1',
          dependencies: {
            react: '0',
          },
        },
        {
          name: '@ssen/test-module2',
          dependencies: {
            'react': '0',
            'test-module3': '0',
          },
        },
        {
          name: 'router-store',
          dependencies: {
            'react': '0',
            'react-router': '0',
          },
        },
        {
          name: 'test-module3',
          dependencies: {
            'react': '0',
            '@ssen/test-module1': '0',
          },
        },
        {
          name: 'use-react-intl',
          dependencies: {
            'react': '0',
            'react-intl': '0',
          },
        },
      ],
      // Assert
      // order by package name - @ssen/test-module1, @router-store
      // test-module3 { @ssen/test-module1 }
      // @ssen/test-module2 { test-module3 }
      // does not have any reason to order - use-react-intl
      [
        'router-store',
        'use-react-intl',
        '@ssen/test-module1',
        'test-module3',
        '@ssen/test-module2',
      ],
    );
  });

  test('should cause error if does not have name field in the package.json', () => {
    // Arrange
    const packageJsonContents: PackageJson[] = [
      {
        name: '@ssen/test-module1',
        dependencies: {
          react: '0',
        },
      },
      {
        dependencies: {
          react: '0',
        },
      },
    ];

    // Act
    // second package has not name field
    // so it will throw an error
    expect(() => getPackagesOrder({ packageJsonContents })).toThrow();
  });

  test('should cause error if the dependencies are circular references', () => {
    // Arrange
    const packageJsonContents: PackageJson[] = [
      {
        name: '@ssen/test-module1',
        dependencies: {
          '@ssen/test-module2': '0',
        },
      },
      {
        name: '@ssen/test-module2',
        dependencies: {
          '@ssen/test-module1': '0',
        },
      },
    ];

    // Act
    // @ssen/test-module1 { @ssen/test-module2 }
    // @ssen/test-module2 { @ssen/test-module1 }
    // they have circular references
    // so it will throw an error
    expect(() => getPackagesOrder({ packageJsonContents })).toThrow();
  });

  test('should guide detailed circular references error', () => {
    // Arrange
    const packageJsonContents: PackageJson[] = [
      {
        name: '@ssen/test-module1',
        dependencies: {
          '@ssen/test-module2': '0',
        },
      },
      {
        name: '@ssen/test-module2',
        dependencies: {
          '@ssen/test-module3': '0',
        },
      },
      {
        name: '@ssen/test-module3',
        dependencies: {
          '@ssen/test-module4': '0',
        },
      },
      {
        name: '@ssen/test-module4',
        dependencies: {
          '@ssen/test-module1': '0',
        },
      },
    ];

    // Act
    // throwed message should has detailed paths
    expect(() => getPackagesOrder({ packageJsonContents })).toThrow(
      'package.json files have circularly referenced dependencies : "@ssen/test-module1" in "@ssen/test-module1 < @ssen/test-module2 < @ssen/test-module3 < @ssen/test-module4 < @ssen/test-module1"',
    );
  });

  test('should sort by names if they have not some dependencies each other', () => {
    // Arrange
    const packageJsonContents: PackageJson[] = [
      {
        name: '@ssen/test-module1',
      },
      {
        name: '@ssen/test-module2',
      },
    ];

    // Act
    // Assert
    // there is no dependencies each other
    // so they will be ordered by names
    expect(
      getPackagesOrder({ packageJsonContents }).map(({ name }) => name),
    ).toEqual(['@ssen/test-module1', '@ssen/test-module2']);
  });
});
```

<!-- /source -->
