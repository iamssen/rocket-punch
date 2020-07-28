# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Patched...

### Added
- Add an option `rocket-punch build --svg default`

### Fixed
- Exclude from result of `rocket-punch view` if can't get package metadata from NPM registry
- Guide detailed paths when catch a circular dependency in `@ssen/collect-dependencies/getPackagesOrder`

## [1.3.1] - 2020-07-20

### Added
- Add `fetch()` support to `rocket-punch/jest-preset`
- Improve message decoration
- Add `rocket-punch doctor` command for check configs 

### Fixed
- Clear symlink if that is already exists

## [1.1.0] - 2020-07-19

### Added
- Add jest preset

```js
// jest.config.js on your project
const jestPreset = require('rocket-punch/jest-preset');

module.exports = {
  ...jestPreset,
  
  // customize your config
  collectCoverageFrom: [
    ...jestPreset.collectCoverageFrom,
    '!src/@rocket-scripts/*/commands.ts',
    '!src/@rocket-scripts/cli/**',
  ],
};
```

## [1.0.0] - 2020-07-03

Release

## [1.0.0-alpha.9] - 2020-07-03

### Added
- Add memoization functionality on `@ssen/require-typescript`

### Breaking Change
- Remove `.package.json.ts` transform file
- Add `.package.ts` transform file

## [1.0.0-alpha.5] - 2020-06-27

### Added
- Rewrite paths by TypeScript compiler transformer API on build (e.g. `import A from '../a'` to `import A from 'a'`)

[1.3.1]: https://github.com/rocket-hangar/rocket-punch/compare/v1.1.0...v1.3.1
[1.1.0]: https://github.com/rocket-hangar/rocket-punch/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/rocket-hangar/rocket-punch/compare/v1.0.0-alpha.9...v1.0.0
[1.0.0-alpha.9]: https://github.com/rocket-hangar/rocket-punch/compare/v1.0.0-alpha.5...v1.0.0-alpha.9
[1.0.0-alpha.5]: https://github.com/rocket-hangar/rocket-punch/releases/tag/v1.0.0-alpha.5
