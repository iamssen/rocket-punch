import { readLast, readLastArgv } from '@ssen/read-last-argv/index';

describe('read-last-argv', () => {
  test('should get last value', () => {
    expect(readLast('a')).toBe('a');
    expect(readLast(['a', 'b'])).toBe('b');
    expect(readLast(undefined)).toBeUndefined();
    expect(readLast(null)).toBeUndefined();
  });

  test('should replace with last value', () => {
    const { a, b, c, d } = readLastArgv({
      a: 'a',
      b: ['a', 'b'],
      c: undefined,
      d: null,
    });
    expect(a).toBe('a');
    expect(b).toBe('b');
    expect(c).toBeUndefined();
    expect(d).toBeUndefined();
  });
});
