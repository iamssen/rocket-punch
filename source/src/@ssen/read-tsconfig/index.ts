import ts from 'typescript';

const parseConfigHost: ts.ParseConfigHost = {
  fileExists: ts.sys.fileExists,
  readFile: ts.sys.readFile,
  readDirectory: ts.sys.readDirectory,
  useCaseSensitiveFileNames: true,
};

export function readTSConfig(searchPath: string, configName: string = 'tsconfig.json'): ts.ParsedCommandLine {
  const configFileName: string | undefined = ts.findConfigFile(searchPath, ts.sys.fileExists, configName);

  if (!configFileName) throw new Error(`Undefined "${configName}" file on "${searchPath}"`);

  const { config, error } = ts.readConfigFile(configFileName, ts.sys.readFile);

  if (error) {
    throw error;
  } else if (!config) {
    throw new Error(`It was not generated config from readConfigFile("${configFileName}")`);
  }

  return ts.parseJsonConfigFileContent(config, parseConfigHost, searchPath);
}

export function parseTSConfig(searchPath: string, tsconfig: object): ts.ParsedCommandLine {
  return ts.parseJsonConfigFileContent(tsconfig, parseConfigHost, searchPath);
}
