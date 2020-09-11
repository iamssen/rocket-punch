function cp(from, to) {
  return [`cp ${from} ${to}`, `git add ${to}`];
}

function precommit(...workspaces) {
  return workspaces.map(
    (workspace) => `yarn workspace ${workspace} run precommit`,
  );
}

module.exports = {
  hooks: {
    'pre-commit': [
      `markdown-source-import README.md "packages/src/**/*.md" --git-add`,
      `lint-staged`,
      ...cp(`README.md`, `packages/src/rocket-punch/README.md`),
      ...precommit(`packages`),
    ].join(' && '),
  },
};
