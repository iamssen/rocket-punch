import path from 'path';
import { publish } from 'rocket-punch';
import { publishMessageHandler } from 'rocket-punch/message-handlers/publish';

publish({
  cwd: process.cwd(),
  dist: path.join(process.cwd(), 'dist'),
  onMessage: publishMessageHandler,
});
