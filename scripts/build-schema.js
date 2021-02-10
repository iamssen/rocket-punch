const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  id:
    'https://raw.githubusercontent.com/rocket-hangar/rocket-punch/master/schema.json#',
  type: 'object',
  patternProperties: {
    '^[a-zA-Z@].*$': {
      $ref: '#/definitions/packageConfig',
    },
  },
  definitions: {
    packageConfig: {
      type: 'object',
      properties: {
        version: {
          type: 'string',
          description:
            'Version must be parseable by node-semver (e.g. 0.1.0, 1.0.0-alpha.1...)',
        },
        tag: {
          type: 'string',
          default: 'latest',
          description:
            'tag (for example, `next` of `npm install react@next` when you install a package)',
        },
        access: {
          type: 'string',
          enum: ['public', 'private'],
          description:
            'if you set this value, it will pass to the `npm publish` command like this `npm publish --access public`',
        },
        registry: {
          type: 'string',
          description:
            'if you set this value, it will pass to the `npm publish` command like this `npm publish --registry http://...`.',
        },
        module: {
          type: 'string',
          enum: ['commonjs', 'esm'],
          description: 'module type',
        },
        compilerOptions: {
          $ref: '#/definitions/compilerOptions',
        },
        packageJson: {
          $ref: 'https://json.schemastore.org/package',
        },
      },
      required: ['version'],
    },
  },
};

(async function () {
  const res = await fetch('https://json.schemastore.org/tsconfig.json');
  const {
    definitions: {
      compilerOptionsDefinition: {
        properties: {
          compilerOptions: {
            properties: {
              module,
              moduleResolution,
              skipLibCheck,
              sourceMap,
              declaration,
              ...properties
            },
            ...compilerOptions
          },
        },
      },
    },
  } = await res.json();

  fs.writeFileSync(
    path.resolve(__dirname, '../schema.json'),
    JSON.stringify(
      {
        ...schema,
        definitions: {
          compilerOptions: {
            ...compilerOptions,
            properties,
          },
          ...schema.definitions,
        },
      },
      null,
      2,
    ),
  );
})();
