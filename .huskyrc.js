function cp(from, to) {
  return [`cp ${from} ${to}`, `git add ${to}`];
}

function precommit(...workspaces) {
  return workspaces.map((workspace) => `yarn workspace ${workspace} run precommit`);
}

module.exports = {
  hooks: {
    'pre-commit': [
      `markdown-source-import README.md "source/src/**/*.md" --git-add`,
      `lint-staged`,
      ...cp(`README.md`, `source/src/rocket-punch/README.md`),
      ...precommit(`source`),
    ].join(' && '),
  },
};
