<template>
  <form @submit.prevent="handleSubmit(item)">
{{#each formFields}}
    <div class="form-group">
      <label
        for="{{{../lc}}}_{{{name}}}"
        class="form-control-label">{{{name}}}</label>
      {{#if reference}}
        <select
          v-model="item.{{{name}}}"
          id="{{{../lc}}}_{{{name}}}"{{#unless maxCardinality}}
          multiple{{/unless}}
          class="form-control"
        >
          <option v-for="selectItem in {{{name}}}SelectItems"
                  :key="selectItem['@id']"
                  :value="selectItem['@id']"
                  :selected="isSelected('{{{name}}}', selectItem['@id'])">\{{ selectItem.name }}
          </option>
        </select>
      {{else}}
        <input
          id="{{{../lc}}}_{{{name}}}"
          v-model="item.{{{name}}}"
          :class="['form-control', !isValid('{{{name}}}') ? 'is-invalid' : 'is-valid']"
          type="{{{type}}}"{{#if step}}
          step="{{{step}}}"{{/if}}{{#if required}}
          required="required"{{/if}}
          placeholder="{{{description}}}">
      {{/if}}
      <div
        v-if="!isValid('{{{name}}}')"
        class="invalid-feedback">\{{ violations.{{{name}}} }}</div>
    </div>
{{/each}}

    <button
      type="submit"
      class="btn btn-success">Submit</button>
  </form>
</template>

<script>
  import { find, get, isUndefined } from 'lodash';
  import { mapFields } from 'vuex-map-fields';
  import { mapActions } from 'vuex';

  export default {
  props: {
    handleSubmit: {
      type: Function,
      required: true,
    },

    values: {
      type: Object,
      required: true,
    },

    errors: {
      type: Object,
      default: () => {},
    },

    initialValues: {
      type: Object,
      default: () => {},
    }
  },

  mounted() {
    {{#each formFields}}
    {{#if reference}}
    this.{{{name}}}GetSelectItems();
    {{/if}}
    {{/each}}
  },

  computed: {
    {{#each formFields}}
    {{#if reference}}
    ...mapFields('{{{name}}}/list', {
      '{{{name}}}SelectItems': 'selectItems',
    }),
    {{/if}}
    {{/each}}

    // eslint-disable-next-line
    item() {
      return this.initialValues || this.values;
    },

    violations() {
      return this.errors || {};
    },
  },

  methods: {
    ...mapActions({
      {{#each formFields}}
      {{#if reference}}
        {{{name}}}GetSelectItems: '{{{name}}}/list/getSelectItems',
      {{/if}}
      {{/each}}
    }),

    isSelected(collection, id) {
      return find(this.item[collection], ['@id', id]) !== undefined;
    },

    isValid(key) {
      return isUndefined(get(this.violations, key));
    },
  },
};
</script>
