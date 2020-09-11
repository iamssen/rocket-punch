export function readLast<T>(value: unknown): T | undefined {
  return Array.isArray(value) ? value.pop() : (value as T) ?? undefined;
}

export function readLastArgv<T extends {}>(argv: T): T {
  return Object.keys(argv).reduce((next, name) => {
    if (name !== '_') {
      //@ts-ignore
      next[name] = readLast(argv[name]);
    }
    return next;
  }, {} as T);
}
