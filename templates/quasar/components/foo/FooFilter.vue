<template>
  <div class="row q-col-gutter-x-md">
    {{#each parameters}}
    <q-input
      v-model="item.{{name}}"
      filled
      :label="$t('{{../lc}}.{{name}}')"
      class="col-12 col-md"
    >
      <template #append>
        <q-icon
          name="close"
          @click.prevent.stop="item.{{name}} = ''"
          class="cursor-pointer"
        />
      </template>
    </q-input>
    {{/each}}
  </div>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';
import type { {{titleUcFirst}} } from 'src/types/{{lc}}';

const props = defineProps<{
  values: {{titleUcFirst}};
}>();

const item = toRef(props, 'values');
</script>
