import { build } from 'rocket-punch';
import { buildMessageHandler } from 'rocket-punch/message-handlers/build';
import { entry, outDir, sourceDir } from './env';

build({
  cwd: sourceDir,
  entry,
  dist: outDir,
  onMessage: buildMessageHandler,
  transformPackageJson: () => (computedPackageJson) => {
    if (
      computedPackageJson.dependencies &&
      'typescript' in computedPackageJson.dependencies
    ) {
      delete computedPackageJson.dependencies['typescript'];

      computedPackageJson.peerDependencies = {
        typescript: '^3.9.0 || ^4.0.0',
      };
    }

    return computedPackageJson;
  },
});
