# `@ssen/collect-dependencies`

It will collect `import`, `import()`, `require()` and `require.resolve()` from JS and TS files in a directory by analyze their source codes.

```ts
import { collectDependencies, collectScripts, PackageInfo } from '@ssen/collect-dependencies';
import { PackageJson } from 'type-fest';

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
import { collectDependencies, collectScripts, PackageInfo } from '@ssen/collect-dependencies';
import { PackageJson } from 'type-fest';

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
}): Promise<PackageJson.Dependency>
```

# Test Codes

<!-- import __tests__/*.test.ts -->
<!-- importend -->