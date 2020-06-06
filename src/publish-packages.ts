import path from 'path';
import { publish } from 'rocket-punch';

publish({
  cwd: process.cwd(),
  dist: path.join(process.cwd(), 'dist'),
});
