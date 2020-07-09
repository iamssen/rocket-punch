# VARIABLES
# ==================================================----------------------------------
$ROOT=$pwd.Path;
$VERDACCIO_PORT=4874;
$LOCAL_REGISTRY_URL="http://localhost:$VERDACCIO_PORT/";

echo "ROOT=$ROOT";
echo "LOCAL_REGISTRY_URL=$LOCAL_REGISTRY_URL";

# SETUP LOCAL REGISTRY
# ==================================================----------------------------------
function stopLocalRegistry {
  $PID=Get-Process -Id (Get-NetTCPConnection -LocalPort $VERDACCIO_PORT).OwningProcess; # kill verdaccio
  if ($PID -match "^[0-9]+$") {
    Stop-Process -Id $PID;
  }
  Remove-Item "$ROOT/test/storage" -Recurse -Force; # clean verdaccio storage
}

function cleanup {
  stopLocalRegistry;
}

# TODO handleError, handleExit, trap

if (Test-Path "$ROOT/test/storage" -Path-Type Container) {
  tree "$ROOT/test/storage" /f;
  Remove-Item "$ROOT/test/storage" -Recurse -Force;
}

# $VERDACCIO_REGISTRY_LOG=New-TemporaryFile;
# echo "VERDACCIO_REGISTRY_LOG=$VERDACCIO_REGISTRY_LOG";

Start-Job -Name "verdaccio" -ScriptBlock { npx verdaccio@latest --config "$ROOT/test/verdaccio.yaml" --listen $VERDACCIO_PORT }; # start verdaccio job
Start-Sleep -Seconds 30; # TODO wait verdaccio with Receive-Job log

## LOCAL PUBLISH
## ==================================================----------------------------------
npx ts-node -r tsconfig-paths/register src/publish-packages-e2e.ts --tag e2e --registry "$LOCAL_REGISTRY_URL";







# ([System.IO.Path]::GetTempPath()+'~'+([System.IO.Path]::GetRandomFileName())).Split('.')[0]