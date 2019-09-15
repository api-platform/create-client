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
      <q-input
        filled
        v-model="item.{{{name}}}"
        mask="date"
        :rules="['date']"
        :label="$t('{{{name}}}')"
        class="col-12 col-md"
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
        class="col-12 col-md"
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
      <q-input filled v-model="item.{{{name}}}" :label="$t('{{{name}}}')" class="col-12 col-md">
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

export default {
  name: '{{{titleUcFirst}}}Form',
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

    isInvalid(key) {
      return val => {
        if (typeof val == 'number') {
          if (val > 0) {
            return true;
          } else {
            return this.$t('{{{labels.numValidation}}}');
          }
        }
        if (!(val && val.length > 0)) return this.$t('{{{labels.stringValidation}}}');
        return Object.keys(this.violations).length === 0 && !this.violations[key];
      };
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
