import path from 'path';
import { publish } from 'rocket-punch';
import { readEntry } from 'rocket-punch/entry/readEntry';
import { publishMessageHandler } from 'rocket-punch/message-handlers/publish';

publish({
  cwd: process.cwd(),
  entry: readEntry({ cwd: process.cwd() }),
  dist: path.join(process.cwd(), 'out/packages'),
  onMessage: publishMessageHandler,
});
