rem VARIABLES
rem ==================================================----------------------------------
set ROOT="%cd%"
set /A VERDACCIO_PORT=4874
set LOCAL_REGISTRY_URL="http://localhost:%VERDACCIO_PORT%/"

echo "ROOT=%ROOT%"
echo "LOCAL_REGISTRY_URL=%LOCAL_REGISTRY_URL%"

rem SETUP LOCAL REGISTRY
rem ==================================================----------------------------------

rem TODO functions... 
rem TODO handleError, handleExit, trap

if exist "%ROOT%/test/storage" (
  tree "%ROOT%/test/storage"
  rmdir /S /Q "%ROOT%/test/storage"
)

start /B "npx verdaccio@latest --config %ROOT%/test/verdaccio.yaml --listen %VERDACCIO_PORT%"
rem timeout 30 > nul
ping 127.0.0.1 -n 30 > nul 

rem LOCAL PUBLISH
rem ==================================================----------------------------------
npx ts-node -r tsconfig-paths/register src/publish-packages-e2e.ts --tag e2e --registry "%LOCAL_REGISTRY_URL%";