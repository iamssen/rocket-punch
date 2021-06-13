import { getPackagesOrder } from '../getPackagesOrder';
import { PackageJson } from 'type-fest';

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
