<template>
  <v-form>
    <v-container fluid>
      {{#forEach formFields}}
      {{#ifOdd index}}
      <v-row>
      {{/ifOdd}}
      {{#compare type "==" "checkbox" }}
        <v-col cols="12" sm="6" md="6">
          <v-checkbox
            v-model="item.{{{name}}}"
            :error-messages="{{{name}}}Errors"
            label="{{{name}}}"{{#if required}}
            required{{/if}}
            @input="$v.item.{{{name}}}.$touch()"
            @blur="$v.item.{{{name}}}.$touch()"
          />
        </v-col>
      {{/compare}}
      {{#compare type "==" "date" }}
        <v-col cols="12" sm="6" md="6">
          <InputDate
            v-model="item.{{{name}}}"
            label="{{{name}}}"
            :error-messages="{{{name}}}Errors"{{#if required}}
            required{{/if}}
          />
        </v-col>
      {{/compare}}
      {{#compare type "==" "time" }}
        <v-col cols="12" sm="6" md="6">
          <v-time-picker
            v-model="item.{{{name}}}"
            label="{{{name}}}"
            :error-messages="{{{name}}}Errors"{{#if required}}
            required{{/if}}
          />
        </v-col>
      {{/compare}}
      {{#compare type "==" "dateTime" }}
        <!-- todo : fix the dateTime format, not supported by default on vuetify -->
        <v-col cols="12" sm="6" md="6">
          <InputDate
            v-model="item.{{{name}}}"
            label="{{{name}}}"
            :error-messages="{{{name}}}Errors"{{#if required}}
            required{{/if}}
          />
        </v-col>
      {{/compare}}
      {{#compare type "==" "number" }}
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model.number="item.{{{name}}}"
            :error-messages="{{{name}}}Errors"
            label="{{{name}}}"{{#if required}}
            required{{/if}}{{#if step}}
            step="{{{step}}}"{{/if}}
            @input="$v.item.{{{name}}}.$touch()"
            @blur="$v.item.{{{name}}}.$touch()"
          />
        </v-col>
      {{/compare}}
      {{#compare type "==" "text" }}
      {{#if reference}}
        <v-col cols="12" sm="6" md="6">
          <v-combobox
            v-model="item.{{{name}}}"
            :items="{{{name}}}SelectItems"
            :error-messages="{{{name}}}Errors"
            no-data-text="{{{../labels.noresults}}}"
            label="{{{name}}}"{{#if required}}
            required{{/if}}{{#unless maxCardinality}}
            multiple{{/unless}}
            item-text="@id"
            item-value="@id"{{#unless maxCardinality}}
            chips{{/unless}}
          />
        </v-col>
      {{else}}
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="item.{{{name}}}"
            :error-messages="{{{name}}}Errors"
            label="{{{name}}}"{{#if required}}
            required{{/if}}
            @input="$v.item.{{{name}}}.$touch()"
            @blur="$v.item.{{{name}}}.$touch()"
          />
        </v-col>
      {{/if}}
      {{/compare}}
      {{#ifEven index}}
      </v-row>
      {{/ifEven}}
      {{#if isLast}}{{#ifOdd index}}
        <v-col cols="12"></v-col>
      </v-row>
      {{/ifOdd}}{{/if}}
      {{/forEach}}
    </v-container>
  </v-form>
</template>

<script>
import has from 'lodash/has';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';
{{#if formContainsDate}}
import InputDate from '../InputDate';
import { date } from '../../validators/date';
{{/if}}

export default {
  name: '{{{titleUcFirst}}}Form',
  mixins: [validationMixin],
  {{#if formContainsDate}}
  components: {
    InputDate,
  },
  {{/if}}
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
  mounted() {
    {{#each formFields}}
      {{#compare type "==" "text" }}
      {{#if reference}}
      this.{{{name}}}GetSelectItems();
      {{/if}}
      {{/compare}}
    {{/each}}
  },
  data: () => ({
    {{#each formFields}}
      {{{name}}}: null,
    {{/each}}
  }),
  computed: {
    {{#each formFields}}
      {{#compare type "==" "text" }}
      {{#if reference}}
      ...mapFields('{{{downcase reference.title}}}', {
        {{{name}}}SelectItems: 'selectItems'
      }),
      {{/if}}
      {{/compare}}
    {{/each}}

    // eslint-disable-next-line
    item() {
      return this.initialValues || this.values;
    },

    {{#each formFields}}
    {{{name}}}Errors() {
      const errors = [];

      if (!this.$v.item.{{{name}}}.$dirty) return errors;

      has(this.violations, '{{{name}}}') && errors.push(this.violations.{{{name}}});

      {{#if required}}
      !this.$v.item.{{{name}}}.required && errors.push('{{{../labels.required}}}');
      {{/if}}

      return errors;
    },
    {{/each}}

    violations() {
      return this.errors || {};
    }
  },
  methods: {
    {{#each formFields}}
      {{#compare type "==" "text" }}
      {{#if reference}}
      ...mapActions({
        {{{name}}}GetSelectItems: '{{{downcase reference.title}}}/fetchSelectItems'
      }),
      {{/if}}
      {{/compare}}
    {{/each}}
  },
  validations: {
    item: {
      {{#each formFields}}
      {{{name}}}: {
        {{#if required}}
        required,
        {{/if}}
        {{#if ../formContainsDate}}
        {{#compare type "==" "dateTime" }}
        date,
        {{/compare}}
        {{#compare type "==" "date" }}
        date,
        {{/compare}}
        {{/if}}
      },
      {{/each}}
    }
  }
};
</script>
