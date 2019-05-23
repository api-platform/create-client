<template>
  <q-form class="q-gutter-md">
    {{#each formFields}}
    <q-input
      v-model="item.{{{name}}}"
      filled
      type="{{{type}}}"
      {{#if step}}
      step="{{{step}}}"
      {{/if~}}
      :label="$t('{{{name}}}')"
      lazy-rules
      :rules="[{{#if required}}val => !!val || $t('Field is required'), {{/if}}isInvalid('{{{name}}}')]"
    />
    {{/each}}
  </q-form>
</template>

<script>
export default {
  props: {
    values: {
      type: Object,
      required: true
    },

    errors: {
      type: Object,
      default: () => {}
    },

    initialValues: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    // eslint-disable-next-line
    item() {
      return this.initialValues || this.values;
    },

    violations() {
      return this.errors || {};
    }
  },

  methods: {
    isInvalid(key) {
      return val => {
        if (!(val && val.length > 0)) return this.$t('Please type something');
        return Object.keys(this.violations).length === 0 && !this.violations[key];
      };
    },
  },
};
</script>
