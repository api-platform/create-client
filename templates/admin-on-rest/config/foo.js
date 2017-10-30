export const configList = {
  '@id': true,
{{#each fields}}
  {{{ name }}}: true,
{{/each}}
  buttons: {
    show: true,
    edit: true,
    create: true,
    refresh: true,
    delete: true,
  }
}

export const configEdit = {
  '@id': true,
{{#each fields}}
  {{{ name }}}: true,
{{/each}}
  buttons: {
    show: true,
    list: true,
    delete: true,
    refresh: true,
  }
}

export const configCreate = {
  '@id': true,
{{#each fields}}
  {{{ name }}}: true,
{{/each}}
  buttons: {
    list: true,
  }
}

export const configShow = {
  '@id': true,
{{#each fields}}
  {{{ name }}}: true,
{{/each}}
  buttons: {
    edit: true,
    list: true,
    delete: true,
    refresh: true,
  }
}
