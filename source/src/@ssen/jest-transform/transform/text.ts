import crypto, { BinaryLike } from 'crypto';

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
  return `module.exports = ${JSON.stringify(sourceText)}`;
}

export = {
  getCacheKey,
  process,
};
