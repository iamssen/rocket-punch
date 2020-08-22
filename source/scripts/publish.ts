import { publish } from 'rocket-punch';
import { publishMessageHandler } from 'rocket-punch/message-handlers/publish';
import { entry, outDir, sourceDir, registry, tag, skipSelection } from './env';

publish({
  cwd: sourceDir,
  entry,
  dist: outDir,
  skipSelection,
  tag,
  registry,
  onMessage: publishMessageHandler,
});
