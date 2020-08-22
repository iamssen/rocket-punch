import { build } from 'rocket-punch';
import { buildMessageHandler } from 'rocket-punch/message-handlers/build';
import { entry, outDir, sourceDir } from './env';

build({
  cwd: sourceDir,
  entry,
  dist: outDir,
  onMessage: buildMessageHandler,
});
