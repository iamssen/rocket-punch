import path from 'path';
import { publish } from 'rocket-pack';

publish({
  cwd: process.cwd(),
  dist: path.join(process.cwd(), 'dist'),
});
