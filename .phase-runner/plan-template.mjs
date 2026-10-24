export default {
  name: 'Phase X.Y — descriptive part name',
  steps: [
    {
      type: 'write',
      label: 'create example file',
      path: 'src/example.js',
      content: `export const example = 'replace me'\n`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'check',
      label: 'build',
      command: 'npm run build',
    },
    {
      type: 'commit',
      label: 'commit feature',
      message: 'feat(example): replace me',
      paths: ['src/example.js'],
      as: 'feat',
    },
    {
      type: 'write',
      label: 'record progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase X.Y — descriptive part name\n\n**Status:** Complete  \n**Commit:** {{hash.feat}}\n`,
    },
    {
      type: 'commit',
      label: 'commit progress',
      message: 'docs(progress): record phase X.Y',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}
