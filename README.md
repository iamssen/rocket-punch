# `trism`

# Usage

```bash
npm install trism --save-dev
npx trism init
```

```json
{
  "private": true,
  "scripts": {
    "build": "trism build",
    "publish": "npm test && trism build && trism publish",
    "test": "jest --colors"
  }
}
```