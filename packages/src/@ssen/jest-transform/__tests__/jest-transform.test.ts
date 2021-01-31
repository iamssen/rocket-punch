import svgTransformer from '@ssen/jest-transform/transform/svg';
import textTransformer from '@ssen/jest-transform/transform/text';
import yamlTransformer from '@ssen/jest-transform/transform/yaml';
import prettier from 'prettier';

// Arrange
const yaml = `
test:
  x:
    y:
      z: 10
`;

const yamlResult = `
module.exports = {
  test: {
    x: {
      y: {
        z: 10
      }
    }
  }
};
`;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="214.489" height="17.599" viewBox="0 0 214.489 17.599">
  <rect x="10" y="10" width="100" height="100" fill="#000000"/>
</svg>
`;

const svgResult = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactComponent = void 0;
var React = require("react");
function ReactComponent() {
  return React.createElement(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 214.489 17.599" },
    React.createElement("rect", {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      fill: "#000000",
    })
  );
}
exports.ReactComponent = ReactComponent;
exports.default =
  "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='214.489' height='17.599' viewBox='0 0 214.489 17.599'%3e %3crect x='10' y='10' width='100' height='100' fill='black'/%3e%3c/svg%3e";
`;

const text = `Hello World!`;
const textResult = `module.exports = 'Hello World!'`;

function format(sourceText: string): string {
  return prettier.format(sourceText, {
    parser: 'typescript',
  });
}

describe('jest-transform', () => {
  test('should transform yaml', () => {
    // Act
    const result = yamlTransformer.process(yaml);

    // Assert
    expect(format(result)).toBe(format(yamlResult));
  });

  test('should transform text', () => {
    // Act
    const result = textTransformer.process(text);

    // Assert
    expect(format(result)).toBe(format(textResult));
  });

  test('should transform svg', () => {
    // Act
    const result = svgTransformer.process(svg);

    // Assert
    expect(format(result)).toBe(format(svgResult));
  });
});
