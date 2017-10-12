export const configList = {
  '@id': true,
{{#each fields}}
  {{{ name }}}: true,
{{/each}}
  buttons: {
    show: true,
    edit: true,
    delete: true
  }
}

export const configEdit = {
  '@id': true,
{{#each fields}}
  {{{ name }}}: true,
{{/each}}
}

export const configCreate = {
  '@id': true,
{{#each fields}}
  {{{ name }}}: true,
{{/each}}
}

export const configShow = {
  '@id': true,
{{#each fields}}
  {{{ name }}}: true,
{{/each}}
}
