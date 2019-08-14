<template>
  <div>
    {{#forEach parameters}}
    {{#ifOdd index}}
    <div class="row q-col-gutter-x-md">
    {{/ifOdd}}
      <q-input
        v-model="item.{{{variable}}}"
        filled
        type="{{{type}}}"
        :label="$t('{{{variable}}}')"
        class="col-12 col-md"
      />
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
    // eslint-disable-next-line
    item() {
      return this.initialValues || this.values;
    }
  }
};
</script>
