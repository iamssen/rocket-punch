function cp(from, to) {
  return [`cp ${from} ${to}`, `git add ${to}`];
}

function precommit(...workspaces) {
  return workspaces.map((workspace) => `yarn workspace ${workspace} run precommit`);
}

module.exports = {
  hooks: {
    'pre-commit': [
      `markdown-source-import "{,!(node_modules)/**/}*.md" --git-add`,
      ...cp(`README.md`, `source/src/rocket-punch/README.md`),
      `lint-staged`,
      ...precommit(`source`),
    ].join(' && '),
  },
};
