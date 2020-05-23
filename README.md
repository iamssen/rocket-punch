# `trism`

Node.js에서 복잡한 설정없이 여러개의 Package를 만들기 위한 도구입니다.

- TypeScript 이외의 언어는 지원하지 않습니다.
- Web Package 제작을 지원하기 위한 기능은 아닙니다. (<https://www.npmjs.com/package/react-zeroconfig>를 사용해주세요) 

# Install

설치하고, 초기화 해줍니다.

```bash
npm install trism --save-dev
npx trism init # it will create files that `tsconfig.json` and `.packages/packages.yaml`
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

# Commands

- `trism build` : Package들을 `dist/` 디렉토리로 Build 합니다.
- `trism publish` : `dist/`에 빌드된 Package들을 Registry로 Publish 합니다.
    - `--force` : CI와 같이 사용자 선택없이 Publish를 진행하고 싶을때 사용합니다.
    - `--tag` : Tag를 강제로 변경합니다. packages.yaml에 선언된 tag가 무시됩니다. (E2E Test와 같은 상황에 사용합니다)
    - `--registry` : 특정 Registry로 Publish 합니다. `.npmrc`의 Registry 선언이 무시됩니다. (E2E Test와 같은 상황에 사용합니다)

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
trism.entry.yaml
tsconfig.json
```

위와 같은 경우 `.trism.entry.yaml`에는 아래와 같이 적혀있어야 합니다.

```yaml
package1:
  version: 0.0.1
'@group/package2':
  version: 0.0.1
```

새로운 Package를 추가하고 싶은 경우 `src/{name}` 또는 `src/@{group}/{name}` 형식의 디렉토리를 만들고, `.trism.entry.yaml`에 추가해줍니다.

# Package Group을 같은 정보로 입력하기

```
src/
  @group/
    package1/
      index.ts
    package2/
      index.ts
    package3/
      index.ts
```

위와 같은 Package Group이 있을 경우

```yaml
'@group/*':
  version: 0.0.1
```

이와 같이 같이 선언할 수 있습니다.

# `.trism.package.json`

모든 `package.json`에 공통적으로 적용되어야 하는 항목들이 있는 경우 `.trism.package.json` 파일을 만듭니다.

`author`, `license`, `repository`, `publishConfig` 같은 항목들을 입력하는데 사용합니다. (`dependencies`와 같은 항목들은 무시됩니다)

```json
{
  "repository": "github:react-zeroconfig/react-zeroconfig",
  "bugs": "https://github.com/react-zeroconfig/react-zeroconfig/issues",
  "homepage": "https://github.com/react-zeroconfig/react-zeroconfig/tree/master/src/{name}"
}
``` 

위와 같이 `{name}` 또는 `{version}`을 사용할 수 있습니다.

# `src/{package}/.package.json.ts`

`package.json` 파일을 직접적으로 제어해야 하는 경우 아래와 같이 `src/{package}/.package.json.ts` 파일을 만들어서 `package.json` 파일 생성에 직접 개입할 수 있습니다.

```ts
import { PackageJson, PackageJsonFactoryFunction } from 'trism';

export default ((computedPackageJson: PackageJson) => {
  return {
    ...computedPackageJson,
    dependencies: {
      ...computedPackageJson.dependencies,
      'some-dependency': '1.x',
    }
  }
}) as PackageJsonFactoryFunction;
```

`computedPackageJson`은 기본적으로 `require()`, `require.resolve()`, `import ''` 구문을 분석해서 `dependencies`를 자동으로 입력하는데, 해당 분석으로는 입력할 수 없는 항목들을 입력할 필요가 있는 경우를 비롯해서 `package.json` 생성에 직접적으로 개입해야 하는 경우 사용할 수 있습니다. 

