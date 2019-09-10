<template>
  <div>
    {{#forEach parameters}}
    {{#ifOdd index}}
    <div class="row q-col-gutter-x-md">
    {{/ifOdd}}
    {{#compare type "==" "checkbox" }}
      <q-checkbox v-model="item.{{{variable}}}" :label="$t('{{{variable}}}')" class="col-12 col-md" />
    {{/compare}}
    {{#compare type "==" "date" }}
      <q-input
        filled
        v-model="item.{{{variable}}}"
        mask="date"
        :label="$t('{{{variable}}}')"
        class="col-12 col-md"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="item.{{{variable}}}" @input="() => $refs.qDateProxy.hide()" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    {{/compare}}
    {{#compare type "==" "time" }}
      <q-input
        filled
        v-model="item.{{{variable}}}"
        mask="time"
        :label="$t('{{{variable}}}')"
        class="col-12 col-md"
      >
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="item.{{{variable}}}" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    {{/compare}}
    {{#compare type "==" "dateTime" }}
      <q-input filled v-model="item.{{{variable}}}" :label="$t('{{{variable}}}')" class="col-12 col-md">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="item.{{{variable}}}" mask="YYYY-MM-DD HH:mm" />
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="item.{{{variable}}}" mask="YYYY-MM-DD HH:mm" format24h />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    {{/compare}}
    {{#compare type "==" "number" }}
      <q-input
      v-model.number="item.{{{variable}}}"
      filled
      type="{{{type}}}"
      {{#if step}}
      step="{{{step}}}"
      {{/if}}
      :label="$t('{{{variable}}}')"
      class="col-12 col-md"
      />
    {{/compare}}
    {{#compare type "==" "text" }}
    {{#if reference}}
      <q-select
        v-model="item.{{{variable}}}"
        filled
        :label="$t('{{{variable}}}')"
        @filter="{{{variable}}}FilterFn"
        :options="{{{variable}}}SelectItems"
        option-value="id"
        option-label="name"
        class="col-12 col-md"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">\{{ $t('No results') }}</q-item-section>
          </q-item>
        </template>
      </q-select>
    {{else}}
      <q-input
        v-model="item.{{{variable}}}"
        filled
        type="{{{type}}}"
        :label="$t('{{{variable}}}')"
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
  </div>
</template>

<script>
{{#if paramsHaveRefs}}
import { mapActions, mapGetters } from "vuex";
{{/if}}

export default {
  props: {
    values: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    {{#if paramsHaveRefs}}
    ...mapGetters({
      {{#each parameters}}
      {{#compare type "==" "text" }}
      {{#if reference}}
      {{{variable}}}SelectItems: '{{{variable}}}/list/selectItems',
      {{/if}}
      {{/compare}}
      {{/each}}
    }),
    {{/if}}
    // eslint-disable-next-line
    item() {
      return this.initialValues || this.values;
    }
  },
  methods: {
    {{#if paramsHaveRefs}}
    ...mapActions({
      {{#each parameters}}
      {{#compare type "==" "text" }}
      {{#if reference}}
      {{{variable}}}GetSelectItems: '{{{variable}}}/list/getSelectItems',
      {{/if}}
      {{/compare}}
      {{/each}}
    }),

    {{#each parameters}}
    {{#compare type "==" "text" }}
    {{#if reference}}
    {{{variable}}}FilterFn(val, update /* , abort */) {
      return this.{{{variable}}}SelectItems !== null
        ? update()
        : this.{{{variable}}}GetSelectItems({}).then(update());
    },
    {{/if}}
    {{/compare}}
    {{/each}}
    {{/if}}
  }
};
</script>
