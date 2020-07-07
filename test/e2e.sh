#!/bin/bash

# VARIABLES
# ==================================================----------------------------------
ROOT=$(pwd);
VERDACCIO_PORT=4874;
LOCAL_REGISTRY_URL="http://localhost:$VERDACCIO_PORT/";

echo "ROOT=$ROOT";
echo "LOCAL_REGISTRY_URL=$LOCAL_REGISTRY_URL";


# SETUP LOCAL REGISTRY
# ==================================================----------------------------------
function stopLocalRegistry {
  kill -9 $(lsof -t -i:$VERDACCIO_PORT); # kill verdaccio
  rm -rf "$ROOT/test/storage"; # clean verdaccio storage
}

function cleanup {
  stopLocalRegistry;
}

function handleError {
  echo "$(basename "$0"): ERROR! An error was encountered executing line $1." 1>&2;
  echo 'Exiting with error.' 1>&2;
  cleanup;
  exit 1;
}

function handleExit {
  echo 'Exiting without error.' 1>&2;
  cleanup;
  exit;
}

trap 'handleError $LINE0 $BASH_COMMAND' ERR;
trap 'handleExit' SIGQUIT SIGTERM SIGINT SIGHUP;

if [[ -d "$ROOT/test/storage" ]]; then
  tree "$ROOT/test/storage";
  rm -rf "$ROOT/test/storage";
fi;

VERDACCIO_REGISTRY_LOG=$(mktemp);
echo "VERDACCIO_REGISTRY_LOG=$VERDACCIO_REGISTRY_LOG";

(npx verdaccio@latest --config "$ROOT/test/verdaccio.yaml" --listen $VERDACCIO_PORT &>"$VERDACCIO_REGISTRY_LOG" &); # start verdaccio with log
grep -q 'http address' <(tail -f "$VERDACCIO_REGISTRY_LOG"); # wating verdaccio


## LOCAL PUBLISH
## ==================================================----------------------------------
ts-node -r tsconfig-paths/register src/publish-packages-e2e.ts --tag e2e --registry "$LOCAL_REGISTRY_URL";

# TEST
# ==================================================----------------------------------
fileExists() {
  if ! ls "$1" 1> /dev/null 2>&1; then
    echo "ERROR: Undefined the file $1";
    handleError;
  fi
}

createTmpFixture() {
  TEMP=$(mktemp -d);
  cp -rv "$ROOT/test/fixtures/$1"/* "$TEMP";
  cp -rv "$ROOT/test/fixtures/$1"/.[^.]* "$TEMP";
  cd "$TEMP" || exit 1;
  echo "TEMP=$TEMP";
  echo "PWD=$(pwd)";
#  npm install @react-zeroconfig/cli@e2e --save-dev --registry "$LOCAL_REGISTRY_URL";
#  npm install;
}

createTmpFixture rocket-punch/basic;
npm install;
npm install rocket-punch@e2e --save-dev --registry "$LOCAL_REGISTRY_URL";
npm run build;
fileExists "$TEMP/dist/a/index.js";
fileExists "$TEMP/dist/a/index.d.ts";
fileExists "$TEMP/dist/b/index.js";
fileExists "$TEMP/dist/b/index.d.ts";
fileExists "$TEMP/dist/c/index.js";
fileExists "$TEMP/dist/c/index.d.ts";

createTmpFixture rocket-punch/js;
npm install;
npm install rocket-punch@e2e --save-dev --registry "$LOCAL_REGISTRY_URL";
npm run build;
fileExists "$TEMP/dist/a/index.js";
fileExists "$TEMP/dist/a/index.d.ts";
fileExists "$TEMP/dist/b/index.js";
fileExists "$TEMP/dist/b/index.d.ts";
fileExists "$TEMP/dist/c/index.js";
fileExists "$TEMP/dist/c/index.d.ts";

createTmpFixture rocket-punch/bundle;
npm install;
npm install rocket-punch@e2e --save-dev --registry "$LOCAL_REGISTRY_URL";
npm run build;
fileExists "$TEMP/dist/a/index.js";
fileExists "$TEMP/dist/a/index.d.ts";
fileExists "$TEMP/dist/a/icon.svg.js";
fileExists "$TEMP/dist/a/icon.svg.d.ts";
fileExists "$TEMP/dist/a/icon-not-bundle.svg";
fileExists "$TEMP/dist/b/index.js";
fileExists "$TEMP/dist/b/index.d.ts";
fileExists "$TEMP/dist/b/test.txt.js";
fileExists "$TEMP/dist/b/test.txt.d.ts";
fileExists "$TEMP/dist/b/test-not-bundle.txt";
fileExists "$TEMP/dist/c/index.js";
fileExists "$TEMP/dist/c/index.d.ts";
fileExists "$TEMP/dist/c/image.jpg.js";
fileExists "$TEMP/dist/c/image.jpg.d.ts";
fileExists "$TEMP/dist/c/image-not-bundle.jpg";
fileExists "$TEMP/dist/c/data.yaml.js";
fileExists "$TEMP/dist/c/data.yaml.d.ts";
fileExists "$TEMP/dist/c/data-not-bundle.yaml";

# EXIT
# ==================================================----------------------------------
cleanup;