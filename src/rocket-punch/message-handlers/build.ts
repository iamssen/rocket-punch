import { BuildMessages } from '../build';
import { flattenDiagnosticMessageText } from 'typescript';

export async function buildMessageHandler(message: BuildMessages) {
  switch (message.type) {
    case 'begin':
      console.log(`START BUILD: ${message.packageName}`);
      break;
    case 'tsc':
      for (const diagnostic of message.diagnostics) {
        if (diagnostic.file && diagnostic.start) {
          const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
          const message: string = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
          console.log(
            `TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`,
          );
        } else {
          console.log(`TS${diagnostic.code} : ${flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
        }
      }
      break;
    case 'package-json':
      console.log(JSON.stringify(message.packageJson, null, 2));
      break;
    case 'success':
      console.log(`👍 ${message.packageName}@${message.packageJson.version} → ${message.outDir}`);
      break;
  }
}
