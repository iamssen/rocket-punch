import { copyTmpDirectory } from '@ssen/tmp-directory';
import { PackageInfo } from 'rocket-punch';
import { getPackagesEntry } from 'rocket-punch/entry/getPackagesEntry';
import { getRootDependencies } from 'rocket-punch/package-json/getRootDependencies';
import { PackageJson } from 'type-fest';

describe('getPackagesEntry()', () => {
  test('should get packages entry', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), `test/fixtures/rocket-punch/sample`);
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
    const externalPackages: PackageJson.Dependency = await getRootDependencies({ cwd });

    expect(entry.has('a')).toBeTruthy();
    expect(entry.has('b')).toBeTruthy();
    expect(entry.has('c')).toBeTruthy();
    expect('react' in externalPackages).toBeTruthy();
  });

  test('should get packages entry by @group/*', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), `test/fixtures/rocket-punch/group-entry`);
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
    const externalPackages: PackageJson.Dependency = await getRootDependencies({ cwd });

    expect(entry.has('@group/a')).toBeTruthy();
    expect(entry.has('@group/b')).toBeTruthy();
    expect(entry.has('@group/c')).toBeTruthy();
    expect('react' in externalPackages).toBeTruthy();
  });
});
