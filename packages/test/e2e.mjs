import verdaccio from 'verdaccio';
import { quiet } from 'zx';

// =============================================
// constants
// =============================================
const ROOT = path.resolve(__dirname, '..');

const VERDACCIO_PORT = 4874;
const LOCAL_REGISTRY_URL = `http://localhost:${VERDACCIO_PORT}/`;
const VERDACCIO_TEST_STORAGE = path.resolve(ROOT, 'test/storage');

const VERDACCIO_CONFIG = {
  storage: VERDACCIO_TEST_STORAGE,

  uplinks: {
    npmjs: {
      url: 'https://registry.npmjs.org/',
      max_fails: 40,
      maxage: '30m',
      timeout: '60s',
      agent_options: {
        keepAlive: true,
        maxSockets: 40,
        maxFreeSockets: 10,
      },
    },
  },

  packages: {
    'rocket-punch': {
      access: '$anonymous',
      publish: '$anonymous',
    },

    '@ssen/*': {
      access: '$anonymous',
      publish: '$anonymous',
    },

    '**': {
      access: '$anonymous',
      publish: '$anonymous',
      proxy: 'npmjs',
    },
  },

  server: {
    keepAliveTimeout: 0,
  },
};

// =============================================
// start verdaccio
// =============================================
if (fs.existsSync(VERDACCIO_TEST_STORAGE)) {
  await $`rm -rf ${VERDACCIO_TEST_STORAGE}`;
}

console.log(`ROOT=${ROOT}`);
console.log(`LOCAL_REGISTRY_URL=${LOCAL_REGISTRY_URL}`);

await new Promise((resolve) => {
  verdaccio.default(
    VERDACCIO_CONFIG,
    undefined,
    undefined,
    undefined,
    undefined,
    (webServer) => {
      webServer.listen(VERDACCIO_PORT, resolve);
    },
  );
});

async function exit(code) {
  if (code !== 0) {
    console.error(code);
  }
  await $`rm -rf ${VERDACCIO_TEST_STORAGE}`;
  process.exit(code);
}

process.on('exit', exit);
process.on('SIGINT', exit);
process.on('SIGUSR1', exit);
process.on('SIGUSR2', exit);
process.on('uncaughtException', exit);

// =============================================
// publish packages
// =============================================
const outputPackageDirs = fs.readdirSync(path.resolve(ROOT, 'out/packages'));
const npmrc = `//localhost:${VERDACCIO_PORT}/:_authToken=ANONYMOUS_TOKEN_STRING`;

for (const name of outputPackageDirs) {
  const dir = path.resolve(ROOT, 'out/packages', name);
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    await fs.writeFile(path.resolve(dir, '.npmrc'), npmrc, {
      encoding: 'utf8',
    });
  }
}

await $`node -r ts-node/register -r tsconfig-paths/register scripts/publish.ts --skip-selection --tag e2e --registry ${LOCAL_REGISTRY_URL}`;

// =============================================
// tests
// =============================================
const TEMP_DIRECTORY = await quiet($`mktemp -d`);

async function testing(describe, fixture, test) {
  const dirname = `dir-${Math.random() * 10000000000}`;
  const dir = path.resolve(TEMP_DIRECTORY.stdout, dirname);

  await fs.copy(path.resolve(ROOT, 'test/fixtures', fixture), dir);

  cd(dir);

  const pwd = await quiet($`pwd`);

  console.log(`TEMP=${dir}`);
  console.log(`PWD=${pwd}`);

  await quiet($`npm install --registry ${LOCAL_REGISTRY_URL}`);
  await quiet(
    $`npm install rocket-punch@e2e --dev --registry ${LOCAL_REGISTRY_URL}`,
  );
  await quiet($`npm run build`);

  function fileExists(file) {
    if (!fs.existsSync(path.resolve(dir, file))) {
      console.log(`ERROR: Undefined the file ${dir}/${file}`);
      exit(1);
    }
  }

  test(fileExists);

  console.log(`[DONE] ${describe}`);

  cd(__dirname);
}

await testing('basic test', 'rocket-punch/basic', (fileExists) => {
  fileExists('out/packages/a/index.js');
  fileExists('out/packages/a/index.d.ts');
  fileExists('out/packages/b/index.js');
  fileExists('out/packages/b/index.d.ts');
  fileExists('out/packages/c/index.js');
  fileExists('out/packages/c/index.d.ts');
});

await testing('js test', 'rocket-punch/js', (fileExists) => {
  fileExists('out/packages/a/index.js');
  fileExists('out/packages/a/index.d.ts');
  fileExists('out/packages/b/index.js');
  fileExists('out/packages/b/index.d.ts');
  fileExists('out/packages/c/index.js');
  fileExists('out/packages/c/index.d.ts');
});

await testing('bundle test', 'rocket-punch/bundle', (fileExists) => {
  fileExists('out/packages/a/index.js');
  fileExists('out/packages/a/index.d.ts');
  fileExists('out/packages/a/icon.svg.js');
  fileExists('out/packages/a/icon.svg.d.ts');
  fileExists('out/packages/a/icon-not-bundle.svg');
  fileExists('out/packages/b/index.js');
  fileExists('out/packages/b/index.d.ts');
  fileExists('out/packages/b/test.txt.js');
  fileExists('out/packages/b/test.txt.d.ts');
  fileExists('out/packages/b/test-not-bundle.txt');
  fileExists('out/packages/c/index.js');
  fileExists('out/packages/c/index.d.ts');
  fileExists('out/packages/c/image.jpg.js');
  fileExists('out/packages/c/image.jpg.d.ts');
  fileExists('out/packages/c/image-not-bundle.jpg');
  fileExists('out/packages/c/data.yaml.js');
  fileExists('out/packages/c/data.yaml.d.ts');
  fileExists('out/packages/c/data-not-bundle.yaml');
});

exit(0);
