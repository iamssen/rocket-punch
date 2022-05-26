import toposort from 'toposort';
import type { PackageJson } from 'type-fest';

interface PackageJsonSet {
  name: string;
  dependencies: Set<string>;
}

interface Params {
  packageJsonContents: PackageJson[];
}

function allDependencies(
  packageJson: PackageJson,
): PackageJson.Dependency | undefined {
  if (
    !packageJson.dependencies &&
    !packageJson.peerDependencies &&
    !packageJson.optionalDependencies
  ) {
    return undefined;
  }

  return {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
    ...packageJson.optionalDependencies,
  };
}

export function getPackagesOrder({
  packageJsonContents,
}: Params): PackageJsonSet[] {
  function searchNestedDependencies(
    ownerName: string,
    dependencies: PackageJson.Dependency | undefined,
    dependenciesSet: Set<string>,
    parents: string[],
  ): Set<string> {
    if (dependencies) {
      const dependencyNames: string[] = Object.keys(dependencies);

      for (const dependencyName of dependencyNames) {
        if (dependencyName === ownerName) {
          const parentsNames = parents.join(' < ');
          throw new Error(
            `package.json files have circularly referenced dependencies : "${ownerName}" in "${parentsNames} < ${dependencyName}"`,
          );
        }

        dependenciesSet.add(dependencyName);

        // find dependencyName on the packageJsonContents
        const childPackageJson: PackageJson | undefined =
          packageJsonContents.find(({ name }) => dependencyName === name);

        // if childPackageJson is exists search childPackageJson's dependencies
        if (childPackageJson && childPackageJson.dependencies) {
          searchNestedDependencies(
            ownerName,
            allDependencies(childPackageJson),
            dependenciesSet,
            [...parents, dependencyName],
          );
        }
      }
    }

    return dependenciesSet;
  }

  const packagesMap: Map<string, PackageJsonSet> = packageJsonContents.reduce(
    (map, packageJson) => {
      if (!packageJson.name) {
        throw new Error(`Undefined "name" field on ${packageJson}`);
      }

      map.set(packageJson.name, {
        name: packageJson.name,
        dependencies: searchNestedDependencies(
          packageJson.name,
          allDependencies(packageJson),
          new Set(),
          [packageJson.name],
        ),
      });

      return map;
    },
    new Map<string, PackageJsonSet>(),
  );

  const edges: [string, string][] = [];

  for (const [name, { dependencies }] of packagesMap) {
    for (const dep of dependencies) {
      if (packagesMap.has(dep)) {
        edges.push([name, dep]);
      }
    }
  }

  const sorted = toposort(edges).reverse();

  return [
    ...Array.from(packagesMap.values()).filter(
      ({ name }) => !sorted.includes(name),
    ),
    ...sorted.map((name) => {
      return packagesMap.get(name)!;
    }),
  ];
}
