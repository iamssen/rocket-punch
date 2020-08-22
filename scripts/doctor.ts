import { doctor } from 'rocket-punch';
import { doctorMessageHandler } from 'rocket-punch/message-handlers/doctor';
import { entry, sourceDir } from './env';

doctor({
  cwd: sourceDir,
  entry,
  onMessage: doctorMessageHandler,
});
