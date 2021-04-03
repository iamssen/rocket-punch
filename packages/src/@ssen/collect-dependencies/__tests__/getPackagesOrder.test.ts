import { PackageJson } from 'type-fest';
import { getPackagesOrder } from '../getPackagesOrder';

describe('getPackagesOrder()', () => {
  test('should get the ordered names array', () => {
    // Arrange : get test condition and test result from function args
    function testFn(
      packageJsonContents: PackageJson[],
      matchOrderedNames: string[],
    ) {
      // Act
      const orderedNames: string[] = getPackagesOrder({ packageJsonContents });

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
      // c
      // a { c }
      // b { a, c }
      // e
      // d { e, b: { a, c } }
      ['c', 'a', 'b', 'e', 'd'],
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
        '@ssen/test-module1',
        'router-store',
        'test-module3',
        '@ssen/test-module2',
        'use-react-intl',
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
    expect(getPackagesOrder({ packageJsonContents })).toEqual([
      '@ssen/test-module1',
      '@ssen/test-module2',
    ]);
  });

  // ---------------------------------------------
  // error cases
  // ---------------------------------------------
  test('frontend-components failed', () => {
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

    // it error throwed by not filtered dependencies
    // and it solved by fix collectTypeScript() and collectScript()
    expect(() => getPackagesOrder({ packageJsonContents })).toThrow();
  });
});
