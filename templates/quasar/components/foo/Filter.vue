<template>
  <div>
    {{#forEach parameters}}
    {{#ifOdd index}}
    <div class="row q-col-gutter-x-md">
    {{/ifOdd}}
    {{#switch filterType}}
    {{#case "exists"}}
      <q-checkbox v-model="item['{{{variable}}}']" :label="$t('{{{capitalize name}}}')" class="col-12 col-md" />
    {{/case}}
    {{#default}}
    {{#compare type "==" "checkbox" }}
      <q-checkbox v-model="item.{{{name}}}" :label="$t('{{{capitalize name}}}')" class="col-12 col-md" />
    {{/compare}}
    {{#compare type "==" "date" }}
      <q-input
        filled
        v-model="item.{{{name}}}"
        mask="date"
        :label="$t('{{{capitalize name}}}')"
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
        :label="$t('{{{capitalize name}}}')"
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
      <q-input filled v-model="item.{{{name}}}" :label="$t('{{{capitalize name}}}')" class="col-12 col-md">
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
      :label="$t('{{{capitalize name}}}')"
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
        @filter="{{{name}}}FilterFn"
        :options="{{{name}}}SelectItems"
        option-value="@id"
        option-label="name"
        class="col-12 col-md"
        {{#if multiple}}multiple{{/if}}
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">\{{ $t('{{{labels.noresults}}}') }}</q-item-section>
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
        class="col-12 col-md"
      >
        <template v-slot:append>
          <q-icon name="close" @click.prevent.stop="item.{{{name}}} = ''" class="cursor-pointer" />
        </template>
      </q-input>
    {{/if}}
    {{/compare}}
    {{/default}}
    {{/switch}}
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
      {{{name}}}SelectItems: '{{{downcase reference.title}}}/list/selectItems',
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
      {{{name}}}GetSelectItems: '{{{downcase reference.title}}}/list/getSelectItems',
      {{/if}}
      {{/compare}}
      {{/each}}
    }),

    {{#each parameters}}
    {{#compare type "==" "text" }}
    {{#if reference}}
    {{{name}}}FilterFn(val, update /* , abort */) {
      return this.{{{name}}}SelectItems !== null
        ? update()
        : this.{{{name}}}GetSelectItems({}).then(update);
    },
    {{/if}}
    {{/compare}}
    {{/each}}
    {{/if}}
  }
};
</script>
