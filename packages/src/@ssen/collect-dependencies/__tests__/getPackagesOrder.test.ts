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
    expect(
      getPackagesOrder({ packageJsonContents }).map(({ name }) => name),
    ).toEqual(['@ssen/test-module1', '@ssen/test-module2']);
  });
});
