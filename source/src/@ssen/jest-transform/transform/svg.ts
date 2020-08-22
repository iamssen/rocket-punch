import svgToJsx from '@svgr/plugin-jsx';
import crypto, { BinaryLike } from 'crypto';
import svgToMiniDataURI from 'mini-svg-data-uri';
import ts from 'typescript';

function getCacheKey(fileData: BinaryLike, filePath: string, configString: string): string {
  return crypto.createHash('md5').update(fileData).update(configString).digest('hex');
}

function processFunction(sourceText: string): string {
  const svgCode: string = sourceText.replace(/[\r\n]+/gm, '');
  const componentName: string = 'ReactComponent';
  const reactCode: string = svgToJsx(svgCode, {}, { componentName });

  const lines: string[] = reactCode.split('\n');

  const output: string =
    process.env.TS_SVG_EXPORT === 'default'
      ? [...lines.slice(0, lines.length - 1), `export default ${componentName}`].join('\n')
      : [
          ...lines.slice(0, lines.length - 1),
          `export default \`${svgToMiniDataURI(svgCode)}\`;`,
          `export {${componentName}};`,
        ].join('\n');

  return ts.transpileModule(output, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React },
  }).outputText;
}

export = {
  getCacheKey,
  process: processFunction,
};
