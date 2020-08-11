import { view } from 'rocket-punch';
import { readEntry } from 'rocket-punch/entry/readEntry';
import { viewMessageHandler } from 'rocket-punch/message-handlers/view';

view({
  cwd: process.cwd(),
  entry: readEntry({ cwd: process.cwd() }),
  onMessage: viewMessageHandler,
});
