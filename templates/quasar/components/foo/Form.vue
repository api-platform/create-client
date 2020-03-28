<template>
  <q-form class="q-pa-md q-col-gutter-y-md" @keydown.enter.prevent="handleSubmit">
    {{#forEach formFields}}
    {{#ifOdd index}}
    <div class="row q-gutter-md">
    {{/ifOdd}}
    {{#compare type "==" "checkbox" }}
      <q-checkbox v-model="item.{{{name}}}" :label="$t('{{{capitalize name}}}')" class="col-12 col-md" />
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
        :label="$t('{{{capitalize name}}}')"
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
        :label="$t('{{{capitalize name}}}')"
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
        :label="$t('{{{capitalize name}}}')"
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
      :label="$t('{{{capitalize name}}}')"
      lazy-rules
      :rules="[{{#if required}}val => !!val || $t('{{{../labels.required}}}'), {{/if}}isInvalid('{{{name}}}')]"
      class="col-12 col-md"
      >
        <template v-slot:append>
          <q-icon name="close" @click.prevent.stop="item.{{{name}}} = ''" class="cursor-pointer" />
        </template>
      </q-input>
    {{/compare}}
    {{#compare type "==" "text" }}
    {{#if reference}}
      <q-select
        v-model="item.{{{name}}}"
        filled
        :label="$t('{{{capitalize name}}}')"
        lazy-rules
        :rules="[{{#if required}}val => !!val || $t('{{{../labels.required}}}'), {{/if}}isInvalid('{{{name}}}')]"
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
            <q-item-section class="text-grey">\{{ $t('{{{../labels.noresults}}}') }}</q-item-section>
          </q-item>
        </template>
        <template v-slot:append>
          <q-icon name="close" @click.prevent.stop="item.{{{name}}} = ''" class="cursor-pointer" />
        </template>
      </q-select>
    {{else}}
      <q-input
        v-model="item.{{{name}}}"
        filled
        type="{{{type}}}"
        :label="$t('{{{capitalize name}}}')"
        lazy-rules
        :rules="[{{#if required}}val => !!val || $t('{{{../labels.required}}}'), {{/if}}isInvalid('{{{name}}}')]"
        class="col-12 col-md"
      >
        <template v-slot:append>
          <q-icon name="close" @click.prevent.stop="item.{{{name}}} = ''" class="cursor-pointer" />
        </template>
      </q-input>
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
import { form } from '../../utils/vuexer';
{{#if formContainsDate}}
import InputDate from '../../common/components/InputDate';
{{/if}}

const { getters, actions, mutations } = form([
{{#each formFields}}
  {{#compare type "==" "text" }}
  {{#if reference}}
  { name: '{{{name}}}', module: '{{{reference.title}}}'},
  {{/if}}
  {{/compare}}
{{/each}}
]);

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

    handleSubmit: {
      type: Function,
      required: true
    }
  },

  computed: {
    ...getters,

    // eslint-disable-next-line
    item() {
      return this.initialValues || this.values;
    },

    violations() {
      return this.errors || {};
    },
  },

  methods: {
    ...actions,
    ...mutations,

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
      const params = {
        'exists[{{{name}}}]': false,
      };
      const template = JSON.stringify(params);

      return this.{{{name}}}SelectItems !== null && this.{{{name}}}SelectItemsTemplate === template
        ? update()
        : this.{{{name}}}GetSelectItems({ params }).then(() => {
            this.{{{name}}}SetSelectItemsTemplate(template);
            update();
          });
    },
    {{/if}}
    {{/compare}}
    {{/each}}
  },
};
</script>
