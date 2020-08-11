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

export interface BuildParams {
  cwd?: string;
  entry: Record<string, string | PackageConfig>;
  dist?: string;
  tsconfig?: string;
  svg?: 'default' | 'create-react-app';

  transformPackageJson?: (packageName: string) => (computedPackageJson: PackageJson) => PackageJson;
  transformCompilerOptions?: (
    packageName: string,
  ) => (computedCompilerOptions: ts.CompilerOptions) => ts.CompilerOptions;
  transformCompilerHost?: (
    packageName: string,
  ) => (compilerOptions: ts.CompilerOptions, compilerHost: ts.CompilerHost) => ts.CompilerHost;
  emitCustomTransformers?: (packageName: string) => () => ts.CustomTransformers | undefined;

  onMessage: (message: BuildMessages) => Promise<void>;
}

export type PublishMessages = {
  type: 'exec';
  command: string;
  publishOption: AvailablePublishOption;
};

export interface PublishParams {
  cwd?: string;
  dist?: string;

  entry: Record<string, string | PackageConfig>;

  skipSelection?: boolean;
  tag?: string;
  registry?: string;

  onMessage: (message: PublishMessages) => Promise<void>;
}

export type ViewMessages = {
  type: 'view';
  metadata: FullMetadata;
  tags: Record<string, string>;
  packageConfig: PackageInfo;
};

export interface ViewParams {
  cwd?: string;

  entry: Record<string, string | PackageConfig>;

  onMessage: (message: ViewMessages) => Promise<void>;
}

export type DoctorMessages =
  | {
      type: 'depcheck';
      result: Results;
    }
  | {
      type: 'tsconfig';
      result: { message: string; fixer: object }[];
    };

export interface DoctorParams {
  cwd?: string;
  tsconfig?: string;

  entry: Record<string, string | PackageConfig>;

  onMessage: (message: DoctorMessages) => Promise<void>;
}
