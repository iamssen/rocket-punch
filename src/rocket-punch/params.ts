import { AvailablePublishOption } from '@ssen/publish-packages';
import { Results } from 'depcheck';
import { FullMetadata } from 'package-json';
import { PackageJson } from 'type-fest';
import ts from 'typescript';
import { PackageConfig, PackageInfo } from './types';

export type BuildMessages =
  | {
      type: 'begin';
      packageName: string;
      sourceDir: string;
      outDir: string;
    }
  | {
      type: 'tsc';
      packageName: string;
      compilerOptions: ts.CompilerOptions;
      diagnostics: ts.Diagnostic[];
    }
  | {
      type: 'package-json';
      packageName: string;
      packageJson: PackageJson;
    }
  | {
      type: 'success';
      packageJson: PackageJson;
      packageName: string;
      sourceDir: string;
      outDir: string;
    };

export type PublishMessages = {
  type: 'exec';
  command: string;
  publishOption: AvailablePublishOption;
};

export type ViewMessages = {
  type: 'view';
  metadata: FullMetadata;
  tags: Record<string, string>;
  packageConfig: PackageInfo;
};

export type DoctorMessages =
  | {
      type: 'depcheck';
      result: Results;
    }
  | {
      type: 'tsconfig';
      result: { message: string; fixer: object }[];
    };

export interface CommonParams {
  /**
   * if you run from outside of project root.
   *
   * you have to set this value to your project root.
   *
   * @example { cwd: path.join(__dirname, 'my-project) }
   *
   * @default process.cwd()
   */
  cwd?: string;

  /**
   * source root
   *
   * it will process to `path.resolve(cwd, sourceRoot)`
   *
   * @example { sourceRoot: '.' }
   *
   * @default src
   */
  sourceRoot?: string;

  /**
   * package entry
   *
   * @example
   * build({
   *   entry: {
   *     // it will make the `src/package1` directory as a package `package1`
   *     package1: {
   *       version: 0.1.0
   *     },
   *     // it will make the `src/@group/package2` directory as a package `@group/package2`
   *     '@group/package2': {
   *       version: 0.1.0
   *     },
   *     // it will make the subdirectories on the `src/@group` as packages
   *     '@group/*': {
   *       version: 0.2.0
   *     }
   *   }
   * })
   */
  entry: Record<string, string | PackageConfig>;

  /**
   * build output directory
   *
   * @example { dist: path.join(process.cwd(), 'dist') }
   *
   * @default path.join(cwd, 'out/packages')
   */
  dist?: string;

  /**
   * tsconfig file name
   *
   * @example { tsconfig: 'tsconfig.build.json' }
   *
   * @default tsconfig.json
   */
  tsconfig?: string;
}

export interface BuildParams extends CommonParams {
  /**
   * svg import style
   *
   * if you set to `{ svg: 'default' }` it will work like `import ReactComponent from './image.svg'`
   *
   * if you set to `{ svg: 'create-react-app' }` it will work like `import svgUrl, { ReactComponent } from './image.svg'`
   *
   * @default create-react-app
   */
  svg?: 'default' | 'create-react-app';

  /**
   * [advanced] you can transform the packageJson before emit
   */
  transformPackageJson?: (packageName: string) => (computedPackageJson: PackageJson) => PackageJson;

  /**
   * [advanced] you can transform the compilerOptions of typescript compiler before emit
   */
  transformCompilerOptions?: (
    packageName: string,
  ) => (computedCompilerOptions: ts.CompilerOptions) => ts.CompilerOptions;

  /**
   * [advanced] you can transform the compilerHost of typescript compiler before emit
   */
  transformCompilerHost?: (
    packageName: string,
  ) => (compilerOptions: ts.CompilerOptions, compilerHost: ts.CompilerHost) => ts.CompilerHost;

  /**
   * [advanced] you can set transformers on typescript compiler's emit
   */
  emitCustomTransformers?: (packageName: string) => () => ts.CustomTransformers | undefined;

  onMessage: (message: BuildMessages) => Promise<void>;
}

export interface PublishParams extends Pick<CommonParams, 'cwd' | 'entry' | 'dist' | 'sourceRoot'> {
  /**
   * if you set this value to true rocket-punch will publish every packages without request to you for selection.
   *
   * @default false
   */
  skipSelection?: boolean;

  /**
   * if you set this value rocket-punch will change the tag of packages by force
   *
   * this is useful in situations like E2E test.
   */
  tag?: string;

  /**
   * if you set this value rocket-punch will change the access of packages by force
   *
   * this is useful in situations like E2E test.
   */
  access?: 'public' | 'private';

  /**
   * if you set this value rocket-punch will change the registry of packages by force
   *
   * this is useful in situations like E2E test.
   */
  registry?: string;

  onMessage: (message: PublishMessages) => Promise<void>;
}

export interface ViewParams extends Pick<CommonParams, 'cwd' | 'entry' | 'sourceRoot'> {
  onMessage: (message: ViewMessages) => Promise<void>;
}

export interface DoctorParams extends Pick<CommonParams, 'cwd' | 'entry' | 'tsconfig' | 'sourceRoot'> {
  onMessage: (message: DoctorMessages) => Promise<void>;
}
