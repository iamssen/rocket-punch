import 'react';
import rimraf from 'rimraf';
import { copyTmpDirectory } from 'tmp-directory';

const tmp = require('tmp');

async function func() {
  const { eq } = await import('semver');
  console.log(eq);
}

require.resolve('glob');

console.log(rimraf);
console.log(tmp);
console.log(copyTmpDirectory);
