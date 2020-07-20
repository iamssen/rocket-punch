import ts from 'typescript';
import { BuildMessages } from '../build';
import chalk from 'chalk';

export async function buildMessageHandler(message: BuildMessages) {
  switch (message.type) {
    case 'begin':
      console.log(chalk.bold(`Build "${message.packageName}"`));
      console.log('');
      break;
    case 'tsc':
      for (const diagnostic of message.diagnostics) {
        if (diagnostic.file && diagnostic.start) {
          const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
          const message: string = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
          console.log(
            chalk.yellow(
              `TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`,
            ),
          );
        } else {
          console.log(
            chalk.yellow(
              `TS${diagnostic.code} : ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`,
            ),
          );
        }
      }
      break;
    case 'package-json':
      console.log(chalk.gray(JSON.stringify(message.packageJson, null, 2)));
      console.log('');
      break;
    case 'success':
      console.log(chalk.blueBright(`👍 ${message.packageName}@${message.packageJson.version} → ${message.outDir}`));
      console.log('');
      break;
  }
}
