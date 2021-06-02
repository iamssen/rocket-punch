# Jest Mockups

```js
module.exports = {
  transform: {
    '.(ts|tsx|js|jsx)$': require.resolve('ts-jest'),
    '.(svg)$': require.resolve('@ssen/jest-transform/transform/svg'),
    '.(html|ejs|txt|md)$': require.resolve(
      '@ssen/jest-transform/transform/text',
    ),
    '.(yaml|yml)$': require.resolve('@ssen/jest-transform/transform/yaml'),
  },
  moduleNameMapper: {
    '.(bmp|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      require.resolve('@ssen/jest-transform/mockup/file'),
    '.(css|less|sass|scss)$': require.resolve(
      '@ssen/jest-transform/mockup/style',
    ),
  },
  setupFilesAfterEnv: [require.resolve('@ssen/jest-transform/setup/fetch')],
};
```
