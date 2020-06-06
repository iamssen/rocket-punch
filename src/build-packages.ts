import fs from 'fs-extra';
import path from 'path';
import { build } from 'rocket-punch';

[path.join(process.cwd(), 'node_modules/@ssen'), path.join(process.cwd(), 'node_modules/rocket-punch')].forEach((p) => {
  if (fs.existsSync(p)) {
    if (fs.statSync(p).isDirectory()) {
      fs.rmdirSync(p, { recursive: true });
    } else {
      fs.unlinkSync(p);
    }
  }
});

build({
  cwd: process.cwd(),
  dist: path.join(process.cwd(), 'dist'),
});
