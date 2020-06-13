# `rocket-punch`

[User Guide](https://www.notion.so/ssen/Rocket-Punch-7db34cad1cb444bb945f1a4b9bc3cc8a)

# Commands

- `npx rocket-punch --help` Help
- `rocket-punch build` Build Packages
- `rocket-punch publish` Publish Packages

# Configuration

## `.packages.yaml`

packages list

```yaml
package1:
  version: 0.0.1
package2:
  version: 0.1.0
  tag: alpha
'@group1/package3':
  version: 0.0.1
'@group2/*':
  version: 0.1.1
```

## `.package.json`

common package.json configuration

```json
{
  "author": "Name <mail@mail.com>",
  "license": "MIT",
  "repository": "github:iamssen/hello-packages",
  "bugs": "https://github.com/iamssen/hello-packages/issues",
  "homepage": "https://github.com/iamssen/hello-packages/tree/master/src/{name}",
  "publishConfig": {
    "access": "public"
  }
}
```

## `src/{package}/.package.json.ts`

package.json transform

```ts
import { PackageJsonTransformFunction } from 'rocket-punch';

export default ((computedPackageJson) => ({
  ...computedPackageJson,
  bin: {
    'your-bin-name': './bin/file.js',
  },
})) as PackageJsonTransformFunction;
```