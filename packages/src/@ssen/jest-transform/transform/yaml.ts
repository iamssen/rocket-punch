import crypto, { BinaryLike } from 'crypto';
import yaml from 'js-yaml';

function getCacheKey(
  fileData: BinaryLike,
  filePath: string,
  configString: string,
): string {
  return crypto
    .createHash('md5')
    .update(fileData)
    .update(configString)
    .digest('hex');
}

function process(sourceText: string): string {
  const result = yaml.load(sourceText);
  const json: string = JSON.stringify(result, undefined, '\t');
  return `module.exports = ${json}`;
}

export = {
  getCacheKey,
  process,
};
