# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-alpha.9] - 2020-07-03

### Added
- Add memoization functionality on `@ssen/require-typescript`

### Breaking Change
- Remove `.package.json.ts` transform file
- Add `.package.ts` transform file

## [1.0.0-alpha.5] - 2020-06-27

### Added
- Rewrite paths by TypeScript compiler transformer API on build (e.g. `import A from '../a'` to `import A from 'a'`)

[1.0.0-alpha.9]: https://github.com/rocket-hangar/rocket-punch/compare/v1.0.0-alpha.5...v1.0.0-alpha.9
[1.0.0-alpha.5]: https://github.com/rocket-hangar/rocket-punch/releases/tag/v1.0.0-alpha.5
