<template>
  <q-form class="q-gutter-md">
    {{#each formFields}}

    {{#compare type "==" "checkbox" }}
    <q-checkbox v-model="item.{{{name}}}" :label="$t('{{{name}}}')" />
    {{/compare}}
    {{#compare type "==" "date" }}
    <q-input
      filled
      v-model="item.{{{name}}}"
      mask="date"
      :rules="['date']"
      :label="$t('{{{name}}}')"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="item.{{{name}}}" @input="() => $refs.qDateProxy.hide()" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    {{/compare}}
    {{#compare type "==" "time" }}
    <q-input
      filled
      v-model="item.{{{name}}}"
      mask="time"
      :rules="['time']"
      :label="$t('{{{name}}}')"
    >
      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time v-model="item.{{{name}}}" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    {{/compare}}
    {{#compare type "==" "dateTime" }}
    <q-input
      filled
      v-model="item.{{{name}}}"
      :label="$t('{{{name}}}')"
    >
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="item.{{{name}}}" mask="YYYY-MM-DD HH:mm" />
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time v-model="item.{{{name}}}" mask="YYYY-MM-DD HH:mm" format24h />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    {{/compare}}
    {{#compare type "==" "number" }}
    <q-input
      v-model="item.{{{name}}}"
      filled
      type="{{{type}}}"
      {{#if step}}
      step="{{{step}}}"
      {{/if}}
      :label="$t('{{{name}}}')"
      lazy-rules
      :rules="[{{#if required}}val => !!val || $t('Field is required'), {{/if}}isInvalid('{{{name}}}')]"
    />
    {{/compare}}
    {{#compare type "==" "text" }}
      {{#if reference}}
    <q-select
      v-model="item.{{{name}}}"
      filled
      :label="$t('{{{name}}}')"
      lazy-rules
      :rules="[{{#if required}}val => !!val || $t('Field is required'), {{/if}}isInvalid('{{{name}}}')]"
    />
      {{else}}
    <q-input
      v-model="item.{{{name}}}"
      filled
      type="{{{type}}}"
      :label="$t('{{{name}}}')"
      lazy-rules
      :rules="[{{#if required}}val => !!val || $t('Field is required'), {{/if}}isInvalid('{{{name}}}')]"
    />
      {{/if}}
    {{/compare}}
    {{/each}}
  </q-form>
</template>

<script>
export default {
  props: {
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
    },
  },

  computed: {
    // eslint-disable-next-line
    item() {
      return this.initialValues || this.values;
    },

    violations() {
      return this.errors || {};
    },
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
