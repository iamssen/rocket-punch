# 🚀 Rocket Punch! 🥊

![TEST](https://github.com/rocket-hangar/rocket-punch/workflows/TEST/badge.svg)
![E2E](https://github.com/rocket-hangar/rocket-punch/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/rocket-hangar/rocket-punch/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/rocket-punch)
[![devDependencies Status](https://david-dm.org/rocket-hangar/rocket-punch/dev-status.svg?kill_cache=1)](https://david-dm.org/rocket-hangar/rocket-punch?type=dev)

Rocket-Punch is a tool for creating and publishing directories in a project into NPM packages.

Usually, we use Monorepo to make and publish part of the project as a package, but the use of Monorepo is cumbersome. (Many Config files that occur per package, such as Watch with Transpilers such as TypeScript...)

Rocket-Punch packages and distributes some of the directories inside the project `/src` directory to NPM without cumbersome settings.

# How does it work?

1. If there are directories `@myorg/package-a`, `@myorg/package-b`, and `package-c` within the directory `/src`
2. The `rocket-punch build` command creates packages in the `out/packages` directory.
3. The `rocket-punch publish` command then publish packages from the `out/pckages` directory collectively to the NPM.

# Basic usage

It's a simple setting.

```sh
cd your-project-root
npx rocket-punch-init
```

A `.package.json`, `.packages.json` files are created in the project.

`build-packgaes` and `publish-packages` would have been created in `scripts` in the `package.json` file.

- The `.package.json` file is a common application to the `package.json` of all packages to be created.
- The `.packages.json` file is a list of which files in the `/src` directory to package build and publish.

Please modify the setting files above to match the packages you will publish.

```sh
yarn run build-packages
yarn run publish-packages
```

Also, if you run the commands above, packages are built / published.

# Restrictions

- Please create directories with the same name as your package name within `/src`. If your package is `@myorg/package1`, you can create the directory `/src/@myorg/package1`.
- Circular dependency will fail to build. If `package1` and `package2` refer to each other, the build will fail, so be careful.

# Command-line

- `rocket-punch build`
- `rocket-punch publish`
- `rocket-punch doctor`
- `rocket-punch view`

# Importable formats

Most Import Types available in Create-React-App are supported. Afterwards, Vite.js' basic import types will also be supported.

- Plain Text
  - `import string from './file.txt'`
  - `import string from './file.md'`
- YAML
  - `import object from './file.yaml'`
  - `import object from './file.yml'`
- Images
  - `import base64String from './file.jpg'`
  - `import base64String from './file.jpeg'`
  - `import base64String from './file.gif'`
  - `import base64String from './file.png'`
  - `import base64String from './file.webp'`
- SVG
  - `import base64String, { ReactComponent } from './file.svg'`
