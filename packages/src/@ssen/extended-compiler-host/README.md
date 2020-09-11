# `@ssen/extended-compiler-host`

Use `createCompilerHost()` instead.

```ts
import { CompilerHost, createCompilerHost } from 'typescript';
import { createExtendedCompilerHost } from '@ssen/extended-compiler-host';

// const compilerHost: CompilerHost = createCompilerHost(compilerOptions);
const compilerHost: CompilerHost = createExtendedCompilerHost(compilerOptions);
```

# Support Files

## Plain Text

- `import string from './file.html'`
- `import string from './file.txt'`
- `import string from './file.md'`
- `import string from './file.ejs'`

## YAML

- `import object from './file.yaml'`
- `import object from './file.yml'`

## Image

- `import base64String from './file.jpg'`
- `import base64String from './file.jpeg'`
- `import base64String from './file.gif'`
- `import base64String from './file.png'`
- `import base64String from './file.webp'`

## SVG

- `import base64String, { ReactComponent } from './file.svg'`

> You can change export to `import ReactComponent from './file.svg'` with `process.env.TS_SVG_EXPORT === 'default'`
