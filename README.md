# `trism`

Node.js에서 복잡한 설정없이 여러개의 Package를 만들기 위한 도구입니다.

- TypeScript 이외의 언어는 지원하지 않습니다.
- Web Package 제작을 지원하기 위한 기능은 아닙니다. (<https://www.npmjs.com/package/react-zeroconfig>를 사용해주세요) 

# Install

설치하고, 초기화 해줍니다.

```bash
npm install trism --save-dev
npx trism init # it will create files that tsconfig.json and packages.yaml
```

`package.json`에 `scripts`를 추가해줍니다.

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

# Directory Rules

아래와 같이 `src/` 내의 파일들은 `dist/`로 빌드 됩니다.

```
dist/
  package1/
    index.js
    package.json
  @group/
    package2/
      dir/
        file.js
      index.js
      package.json
src/
  package1/
    index.ts
  @group/
    package2/
      dir/
        file.ts
      index.ts
package.json
tsconfig.json
packages.yaml
```

위와 같은 경우 `packages.yaml`에는 아래와 같이 적혀있어야 합니다.

```yaml
package1:
  version: 0.0.1
'@group/package2':
  version: 0.0.1
```

새로운 Package를 추가하고 싶은 경우 `src/{name}` 또는 `src/@{group}/{name}` 형식의 디렉토리를 만들고, `packages.yaml`에 추가해줍니다.

# `package.shared.json`

모든 `package.json`에 공통적으로 적용되어야 하는 항목들이 있는 경우 `package.shared.json` 파일을 만듭니다.

`author`, `license`, `repository`, `publishConfig` 같은 항목들을 입력하는데 사용합니다. (`dependencies`와 같은 항목들은 무시됩니다) 

# `src/{package}/package.js`

`package.json` 파일을 직접적으로 제어해야 하는 경우 아래와 같이 `src/{package}/package.js` 파일을 만들어서 `package.json` 파일 생성에 직접 개입할 수 있습니다.

```js
module.exports = (computedPackageJson, rootPackageJson) => {
  return {
    ...computedPackageJson,
  }
}
```

