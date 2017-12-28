<template>
  <form @submit.prevent="handleSubmit(item)">
{{#each formFields}}
    <div :class="{ 'form-group': true, 'has-error': (errors && errors.{{{ name }}}) }">
      <label for="{{{ lc }}}_{{{ name }}}" class="control-label">{{{ name }}}</label>
      <input v-model="item.{{{ name }}}" type="{{{ type }}}" {{#if step}} step="{{{ step }}}"{{/if}} placeholder="{{{ description }}}" {{#if required}}required="true"{{/if}} id="{{{ lc }}}_{{{ name }}}" class="form-control" />
      <span v-if="errors && errors.{{{ name }}}" class="help-block" id="{{{ lc }}}_{{{ name }}}_helpBlock">\{{ errors.{{{ name }}} }}</span>
    </div>
{{/each}}

    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>

<script>
  export default {
    props: {
      handleSubmit: {
        type: Function,
        required: true
      },
      values: {
        type: Object,
        required: true
      },
      errors: {
        type: Object
      },
      initialValues: {
        type: Object
      }
    },
    computed: {
      item: function () {
        return this.initialValues ? this.initialValues : this.values
      }
    }
  }
</script>
