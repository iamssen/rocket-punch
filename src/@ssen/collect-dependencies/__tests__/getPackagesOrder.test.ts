import { PackageJson } from 'type-fest';
import { getPackagesOrder } from '../getPackagesOrder';

describe('getPackagesOrder()', () => {
  test('should get the ordered names array', () => {
    function test(packageJsonContents: PackageJson[], matchOrderedNames: string[]) {
      const orderedNames: string[] = getPackagesOrder({ packageJsonContents });

      expect(orderedNames).toEqual(matchOrderedNames);

      orderedNames.reverse().forEach((a: string, i: number) => {
        // sorted.slice(0, i) does not have a
        for (const b of orderedNames.slice(0, i)) {
          const aFile: PackageJson | undefined = packageJsonContents.find(({ name }) => name === a);
          expect(aFile).not.toBeUndefined();
          if (aFile) {
            expect(Object.keys(aFile.dependencies || {})).not.toEqual(expect.arrayContaining([b]));
          }
        }
      });
    }

    test(
      [
        {
          name: '@lunit/insight-viewer',
          dependencies: {
            react: '>=16.8.0',
            'cornerstone-core': '^2.3.0',
            'cornerstone-wado-image-loader': '^2.2.3',
            'dicom-parser': '^1.8.3',
            rxjs: '^6.5.2',
            polylabel: '^1.0.2',
            'point-in-polygon': '^1.0.1',
            'styled-components': '>=4.3.2',
            '@material-ui/core': '^4.3.1',
            '@lunit/heatmap': '^1.0.0',
            '@lunit/is-complex-polygon': '^1.0.0',
            '@lunit/is-polygon-area-greater-than-area': '^1.0.0',
            csstype: '^2.6.7',
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
      ['@lunit/heatmap', '@lunit/insight-viewer'],
    );

    test(
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
      ['e', 'c', 'a', 'b', 'd'],
    );

    test(
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
            react: '0',
            'test-module3': '0',
          },
        },
        {
          name: 'router-store',
          dependencies: {
            react: '0',
            'react-router': '0',
          },
        },
        {
          name: 'test-module3',
          dependencies: {
            react: '0',
            '@ssen/test-module1': '0',
          },
        },
        {
          name: 'use-react-intl',
          dependencies: {
            react: '0',
            'react-intl': '0',
          },
        },
      ],
      ['use-react-intl', '@ssen/test-module1', 'test-module3', 'router-store', '@ssen/test-module2'],
    );
  });

  test('should cause error if does not have name field in the package.json', () => {
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

    expect(() => getPackagesOrder({ packageJsonContents })).toThrow();
  });

  test('should cause error if the dependencies are circular references', () => {
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

    expect(() => getPackagesOrder({ packageJsonContents })).toThrow();
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@ssen/snackbar',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@ssen/snackbar',
        version: '2.0.0-alpha.1',
        dependencies: {
          '@material-ui/core': '^4.9.13',
          '@material-ui/icons': '^4.5.1',
          '@storybook/react': '^5.3.17',
          react: '^16.13.1',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/handbook',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/handbook',
        version: '5.0.0-alpha.1',
        dependencies: {
          '@handbook/components': '^2.0.0-alpha.1',
          '@lunit/insight-viewer': '^5.0.0-alpha.1',
          '@lunit/opt-components': '^5.0.0-alpha.1',
          '@ssen/snackbar': '^2.0.0-alpha.1',
          react: '^16.13.1',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/heatmap',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/heatmap',
        version: '5.0.0-alpha.1',
        dependencies: {
          '@handbook/components': '^2.0.0-alpha.1',
          '@handbook/source': '^2.0.0-alpha.1',
          react: '^16.13.1',
        },
        main: 'index.js',
        typings: 'index.d.ts',
      },
      {
        author: 'SSen <i@ssen.name>',
        license: 'MIT',
        repository: 'github:lunit/frontend-components',
        bugs: 'https://github.com/lunit/frontend-components/issues',
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/insight-draw',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/insight-draw',
        version: '5.0.0-alpha.1',
        dependencies: {
          '@handbook/source': '^2.0.0-alpha.1',
          react: '^16.13.1',
          csstype: '^2.6.10',
        },
        main: 'index.js',
        typings: 'index.d.ts',
      },
      {
        author: 'SSen <i@ssen.name>',
        license: 'MIT',
        repository: 'github:lunit/frontend-components',
        bugs: 'https://github.com/lunit/frontend-components/issues',
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/insight-ui',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/insight-viewer',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/insight-viewer',
        version: '5.0.0-alpha.1',
        dependencies: {
          '@handbook/components': '^2.0.0-alpha.1',
          '@handbook/source': '^2.0.0-alpha.1',
          react: '^16.13.1',
          'styled-components': '^5.0.0',
          rxjs: '^6.5.4',
          'd3-color': '^1.4.0',
          '@material-ui/core': '^4.9.13',
          '@lunit/insight-draw': '^5.0.0-alpha.1',
          '@lunit/is-touch-device': '^5.0.0-alpha.1',
          polylabel: '^1.0.2',
          '@lunit/heatmap': '^5.0.0-alpha.1',
          '@lunit/use-opt-control': '^5.0.0-alpha.1',
          'd3-ease': '^1.0.6',
          'd3-timer': '^1.0.10',
          'point-in-polygon': '^1.0.1',
          '@lunit/is-complex-polygon': '^5.0.0-alpha.1',
          '@lunit/is-polygon-area-greater-than-area': '^5.0.0-alpha.1',
          csstype: '^2.6.10',
        },
        main: 'index.js',
        typings: 'index.d.ts',
      },
      {
        author: 'SSen <i@ssen.name>',
        license: 'MIT',
        repository: 'github:lunit/frontend-components',
        bugs: 'https://github.com/lunit/frontend-components/issues',
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/is-complex-polygon',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/is-complex-polygon',
        version: '5.0.0-alpha.1',
        dependencies: {
          '@lunit/is-intersection': '^5.0.0-alpha.1',
          '@lunit/insight-viewer': '^5.0.0-alpha.1',
          react: '^16.13.1',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/is-intersection',
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
          react: '^16.13.1',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/is-touch-device',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/new-window',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/new-window',
        version: '5.0.0-alpha.1',
        dependencies: { react: '^16.13.1', '@handbook/source': '^2.0.0-alpha.1' },
        main: 'index.js',
        typings: 'index.d.ts',
      },
      {
        author: 'SSen <i@ssen.name>',
        license: 'MIT',
        repository: 'github:lunit/frontend-components',
        bugs: 'https://github.com/lunit/frontend-components/issues',
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/opt-components',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/opt-components',
        version: '5.0.0-alpha.1',
        dependencies: {
          '@lunit/insight-viewer': '^5.0.0-alpha.1',
          '@lunit/opt-control-icons': '^5.0.0-alpha.1',
          '@storybook/react': '^5.3.17',
          react: '^16.13.1',
          'styled-components': '^5.0.0',
          '@material-ui/core': '^4.9.13',
          '@material-ui/icons': '^4.5.1',
          '@ssen/snackbar': '^2.0.0-alpha.1',
          history: '^4.10.1',
          'react-router-dom': '^5.1.2',
          'use-resize-observer': '^6.0.0',
          '@lunit/is-touch-device': '^5.0.0-alpha.1',
          'resize-observer-polyfill': '^1.5.1',
          '@material-ui/styles': '^4.9.13',
          '@lunit/use-dialog': '^5.0.0-alpha.1',
          csstype: '^2.6.10',
        },
        main: 'index.js',
        typings: 'index.d.ts',
      },
      {
        author: 'SSen <i@ssen.name>',
        license: 'MIT',
        repository: 'github:lunit/frontend-components',
        bugs: 'https://github.com/lunit/frontend-components/issues',
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/opt-control-icons',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/opt-control-icons',
        version: '5.0.0-alpha.1',
        dependencies: {
          '@material-ui/core': '^4.9.13',
          '@material-ui/icons': '^4.5.1',
          react: '^16.13.1',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/opt-login-components',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/opt-login-components',
        version: '5.0.0-alpha.1',
        dependencies: {
          '@lunit/insight-viewer': '^5.0.0-alpha.1',
          '@lunit/opt-components': '^5.0.0-alpha.1',
          '@storybook/react': '^5.3.17',
          react: '^16.13.1',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/screenshot',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/screenshot',
        version: '5.0.0-alpha.1',
        dependencies: { 'fs-extra': '^9.0.0', puppeteer: '^3.0.3' },
        main: 'index.js',
        typings: 'index.d.ts',
      },
      {
        author: 'SSen <i@ssen.name>',
        license: 'MIT',
        repository: 'github:lunit/frontend-components',
        bugs: 'https://github.com/lunit/frontend-components/issues',
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/timeout',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/use-control-log',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/use-dialog',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/use-dialog',
        version: '5.0.0-alpha.1',
        dependencies: {
          react: '^16.13.1',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/use-opt-control',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/use-opt-control',
        version: '5.0.0-alpha.1',
        dependencies: { react: '^16.13.1', '@handbook/source': '^2.0.0-alpha.1' },
        main: 'index.js',
        typings: 'index.d.ts',
      },
      {
        author: 'SSen <i@ssen.name>',
        license: 'MIT',
        repository: 'github:lunit/frontend-components',
        bugs: 'https://github.com/lunit/frontend-components/issues',
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/use-reset-time',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/use-reset-time',
        version: '5.0.0-alpha.1',
        dependencies: { react: '^16.13.1', '@handbook/source': '^2.0.0-alpha.1' },
        main: 'index.js',
        typings: 'index.d.ts',
      },
      {
        author: 'SSen <i@ssen.name>',
        license: 'MIT',
        repository: 'github:lunit/frontend-components',
        bugs: 'https://github.com/lunit/frontend-components/issues',
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@lunit/use-shortcut',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@lunit/use-shortcut',
        version: '5.0.0-alpha.1',
        dependencies: { react: '^16.13.1', '@handbook/source': '^2.0.0-alpha.1' },
        main: 'index.js',
        typings: 'index.d.ts',
      },
      {
        author: 'SSen <i@ssen.name>',
        license: 'MIT',
        repository: 'github:lunit/frontend-components',
        bugs: 'https://github.com/lunit/frontend-components/issues',
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@handbook/code-block',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@handbook/code-block',
        version: '2.0.0-alpha.1',
        dependencies: {
          'prism-react-renderer': '^1.0.2',
          react: '^16.13.1',
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
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@handbook/components',
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
          react: '^16.13.1',
          'styled-components': '^5.0.0',
          '@mdx-js/react': '^1.6.1',
          'react-router-dom': '^5.1.2',
          slugify: '^1.4.0',
        },
        main: 'index.js',
        typings: 'index.d.ts',
      },
      {
        author: 'SSen <i@ssen.name>',
        license: 'MIT',
        repository: 'github:lunit/frontend-components',
        bugs: 'https://github.com/lunit/frontend-components/issues',
        homepage: 'https://github.com/lunit/frontend-components/tree/master/src/@handbook/source',
        engines: { node: '>=10' },
        publishConfig: { access: 'public' },
        name: '@handbook/source',
        version: '2.0.0-alpha.1',
        dependencies: { react: '^16.13.1', '@handbook/code-block': '^2.0.0-alpha.1' },
        main: 'index.js',
        typings: 'index.d.ts',
      },
    ];

    // it error throwed by not filtered dependencies
    // and it solved by fix collectTypeScript() and collectScript()
    expect(() => getPackagesOrder({ packageJsonContents })).toThrow();
  });
});
