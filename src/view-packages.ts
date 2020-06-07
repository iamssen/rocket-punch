import { view } from 'rocket-punch';
import { viewMessageHandler } from 'rocket-punch/message-handlers/view';

view({
  cwd: process.cwd(),
  onMessage: viewMessageHandler,
});
