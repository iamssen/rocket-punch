import { view } from 'rocket-punch';
import { viewMessageHandler } from 'rocket-punch/message-handlers/view';
import { entry, sourceDir } from './env';

view({
  cwd: sourceDir,
  entry,
  onMessage: viewMessageHandler,
});
