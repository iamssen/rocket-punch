import { doctor } from 'rocket-punch';
import { doctorMessageHandler } from 'rocket-punch/message-handlers/doctor';

doctor({
  cwd: process.cwd(),
  onMessage: doctorMessageHandler,
});
