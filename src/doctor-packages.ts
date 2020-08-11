import { doctor } from 'rocket-punch';
import { readEntry } from 'rocket-punch/entry/readEntry';
import { doctorMessageHandler } from 'rocket-punch/message-handlers/doctor';

doctor({
  cwd: process.cwd(),
  entry: readEntry({ cwd: process.cwd() }),
  onMessage: doctorMessageHandler,
});
