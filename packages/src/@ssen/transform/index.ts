import svgToJsx from '@svgr/plugin-jsx';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import svgToMiniDataURI from 'mini-svg-data-uri';
import path from 'path';

export interface Transformer {
  /**
   * Transform the file to an source text
   *
   * @param file An absolute path like /absolute-path/some.svg
   */
  getSourceText: (option?: Record<string, string>) => (file: string) => string;
}

export const plainTextTransformer: Transformer = {
  getSourceText: () => (file: string) => {
    const content: string = fs.readFileSync(file, 'utf8');
    return `export default ${JSON.stringify(content)}`;
  },
};

export const imageTransformer: Transformer = {
  getSourceText: () => (file: string) => {
    const ext: string = path.extname(file);
    const source: string = fs
      .readFileSync(file, 'base64')
      .replace(/[\r\n]+/gm, '');
    return `export default 'data:image/${ext};base64,${source}'`;
  },
};

export const yamlTransformer: Transformer = {
  getSourceText: () => (file: string) => {
    const content: string = fs.readFileSync(file, 'utf8');
    return `export default ${JSON.stringify(yaml.load(content))}`;
  },
};

export const svgTransformer: Transformer = {
  /**
   * When option.variant is 'default', it will be `import ReactComponent from './some.svg'`
   * When option.variant is 'create-react-app', it will be `import svgUrl, { ReactComponent } from './some.svg'`
   *
   * @param option { variant: 'create-react-app' | 'default' } default is 'create-react-app'
   */
  getSourceText: (option) => (file: string) => {
    const svgCode: string = fs
      .readFileSync(file, 'utf8')
      .replace(/[\r\n]+/gm, '');
    const componentName: string = 'ReactComponent';
    const reactCode: string = svgToJsx(svgCode, {}, { componentName });

    if (option?.variant === 'default') {
      return reactCode;
    }

    const lines: string[] = reactCode.split('\n');
    return [
      ...lines.slice(0, lines.length - 1),
      `export default \`${svgToMiniDataURI(svgCode)}\`;`,
      `export {${componentName}};`,
    ].join('\n');
  },
};
