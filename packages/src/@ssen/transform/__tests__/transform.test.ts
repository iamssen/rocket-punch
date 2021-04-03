import path from 'path';
import process from 'process';
import {
  svgTransformer,
  plainTextTransformer,
  imageTransformer,
  yamlTransformer,
} from '../';

describe('transform', () => {
  test('should get transformed data', () => {
    // Arrange
    const cwd: string = path.join(
      process.cwd(),
      'test/fixtures/rocket-punch/bundle',
    );

    // Assert
    expect(
      svgTransformer.getSourceText()(path.join(cwd, 'src/a/icon.svg')),
    ).toMatchSnapshot();

    expect(
      plainTextTransformer.getSourceText()(path.join(cwd, 'src/b/test.txt')),
    ).toMatchSnapshot();

    expect(
      imageTransformer.getSourceText()(path.join(cwd, 'src/c/image.jpg')),
    ).toMatchSnapshot();

    expect(
      yamlTransformer.getSourceText()(path.join(cwd, 'src/c/data.yaml')),
    ).toMatchSnapshot();
  });
});
