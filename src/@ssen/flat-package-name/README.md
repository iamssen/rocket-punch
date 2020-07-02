# `@ssen/flat-package-name`

Flat package name rule.

# Test Codes

<!-- import __tests__/*.test.ts -->

```ts
import { flatPackageName } from '@ssen/flat-package-name';

describe('flatPackageName()', () => {
  test('should flat package names', () => {
    expect(flatPackageName('eslint')).toBe('eslint');
    expect(flatPackageName('markdown-source-import')).toBe('markdown-source-import');
    expect(flatPackageName('@ssen/eslint-config')).toBe('ssen__eslint-config');
    expect(flatPackageName('@ssen/prettier-config')).toBe('ssen__prettier-config');
  });
});

```

<!-- importend -->