<template>
  <q-form class="q-pa-md q-col-gutter-y-md">
    {{#forEach formFields}}
    {{#ifOdd index}}
    <div class="row q-gutter-md">
    {{/ifOdd}}
    {{#compare type "==" "checkbox" }}
      <q-checkbox v-model="item.{{{name}}}" :label="$t('{{{name}}}')" class="col-12 col-md" />
    {{/compare}}
    {{#compare type "==" "date" }}
      <InputDate
        readonly
        filled
        :value="item.{{{name}}}"
        :set="
          v => {
            item.{{{name}}} = v;
          }
        "
        :label="$t('{{{name}}}')"
        class="col-12 col-md"
        kind="date"
        :rules="['date']"
      />
    {{/compare}}
    {{#compare type "==" "time" }}
      <InputDate
        readonly
        filled
        :value="item.{{{name}}}"
        :set="
          v => {
            item.{{{name}}} = v;
          }
        "
        :label="$t('{{{name}}}')"
        class="col-12 col-md"
        kind="time"
        :rules="['time']"
      />
    {{/compare}}
    {{#compare type "==" "dateTime" }}
      <InputDate
        readonly
        filled
        :value="item.{{{name}}}"
        :set="
          v => {
            item.{{{name}}} = new Date(v).toISOString();
          }
        "
        :label="$t('{{{name}}}')"
        class="col-12 col-md"
        kind="datetime"
        :rules="['datetime']"
      />
    {{/compare}}
    {{#compare type "==" "number" }}
      <q-input
      v-model.number="item.{{{name}}}"
      filled
      type="{{{type}}}"
      {{#if step}}
      step="{{{step}}}"
      {{/if}}
      :label="$t('{{{name}}}')"
      lazy-rules
      :rules="[{{#if required}}val => !!val || $t('{{{labels.required}}}'), {{/if}}isInvalid('{{{name}}}')]"
      class="col-12 col-md"
      />
    {{/compare}}
    {{#compare type "==" "text" }}
    {{#if reference}}
      <q-select
        v-model="item.{{{name}}}"
        filled
        :label="$t('{{{name}}}')"
        lazy-rules
        :rules="[{{#if required}}val => !!val || $t('{{{labels.required}}}'), {{/if}}isInvalid('{{{name}}}')]"
        @filter="{{{name}}}FilterFn"
        :options="{{{name}}}SelectItems"
        option-value="@id"
        option-label="name"
        class="col-12 col-md"
        emit-value
        map-options
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">\{{ $t('{{{labels.noresults}}}') }}</q-item-section>
          </q-item>
        </template>
      </q-select>
    {{else}}
      <q-input
        v-model="item.{{{name}}}"
        filled
        type="{{{type}}}"
        :label="$t('{{{name}}}')"
        lazy-rules
        :rules="[{{#if required}}val => !!val || $t('{{{labels.required}}}'), {{/if}}isInvalid('{{{name}}}')]"
        class="col-12 col-md"
      />
    {{/if}}
    {{/compare}}
    {{#ifEven index}}
    </div>
    {{/ifEven}}
    {{#if isLast}}{{#ifOdd index}}
      <div class="col-12 col-md"></div>
    </div>
    {{/ifOdd}}{{/if}}
    {{/forEach}}
  </q-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
{{#if formContainsDate}}
import InputDate from '../common/InputDate';
{{/if}}

export default {
  name: '{{{titleUcFirst}}}Form',
  {{#if formContainsDate}}

  components: {
    InputDate,
  },
  {{/if}}

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
    ...mapGetters({
      {{#each formFields}}
      {{#compare type "==" "text" }}
      {{#if reference}}
      {{{name}}}SelectItems: '{{{downcase reference.title}}}/list/selectItems',
      {{/if}}
      {{/compare}}
      {{/each}}
    }),

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
      {{#compare type "==" "text" }}
      {{#if reference}}
      {{{name}}}GetSelectItems: '{{{downcase reference.title}}}/list/getSelectItems',
      {{/if}}
      {{/compare}}
      {{/each}}
    }),

    isInvalid(/* key */) {
      return true;
      // return val => {
      //   if (typeof val == 'number') {
      //     if (val > 0) {
      //       return true;
      //     } else {
      //       return this.$t('{{{labels.numValidation}}}');
      //     }
      //   }
      //   if (!(val && val.length > 0)) return this.$t('{{{labels.stringValidation}}}');
      //   return Object.keys(this.violations).length === 0 && !this.violations[key];
      // };
    },

    {{#each formFields}}
    {{#compare type "==" "text" }}
    {{#if reference}}
    {{{name}}}FilterFn(val, update /* , abort */) {
      return this.{{{name}}}SelectItems !== null
        ? update()
        : this.{{{name}}}GetSelectItems({}).then(() =>
            setTimeout(() => {
              update();
            }, 500),
          );
    },
    {{/if}}
    {{/compare}}
    {{/each}}
  },
};
</script>
