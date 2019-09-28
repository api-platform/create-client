<!--
  https://github.com/controledigital/quasar-solutions/blob/master/components/cInputDate.vue
  Chamada:
    <InputDate :value="data" :set="(v) => { data = v }" label="Data" />
-->
<template>
  <q-input
    stack-label
    lazy-rules
    bottom-slots
    v-on="$listeners"
    v-bind="$attrs"
    v-model="inputModel"
    :error="!isValid"
  >
    <template v-slot:prepend v-if="kind === 'datetime' || kind === 'date'">
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale" ref="qDateProxy">
          <q-date v-model="calendarModel" :mask="mask" />
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-slot:append v-if="kind === 'datetime' || kind === 'time'">
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale" ref="qTimeProxy">
          <q-time v-model="calendarModel" format24h :mask="mask" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { date } from 'quasar';

const localISOString = (d = new Date()) => {
  let pad = function(n) {
      return n < 10 ? '0' + n : n;
    },
    tz = d.getTimezoneOffset(), // mins
    tzs = (tz > 0 ? '-' : '+') + pad(parseInt(Math.abs(tz / 60))) + ':00';

  if (tz % 60 != 0) tzs += pad(Math.abs(tz % 60));

  if (tz === 0)
    // Zulu time == UTC
    tzs = 'Z';

  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    'T' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes()) +
    ':' +
    pad(d.getSeconds()) +
    tzs
  );
};

export default {
  name: 'InputDate',
  props: { value: String, set: Function, kind: { type: String, default: 'datetime' } },
  data() {
    return {
      isValid: true,
    };
  },

  computed: {
    mask: {
      get() {
        switch (this.kind) {
          case 'date':
            return 'YYYY/MM/DD';
          case 'time':
            return 'HH:mm';
          case 'datetime':
          default:
            return 'YYYY/MM/DD HH:mm';
        }
      },
    },
    inputModel: {
      get: function() {
        switch (this.kind) {
          case 'date':
            return this.Model ? this.$d(new Date(this.Model), 'short') : '';
          case 'time':
            return this.Model;
          case 'datetime':
          default:
            return this.Model ? this.$d(new Date(this.Model), 'long') : '';
        }
      },

      set: function(value) {
        if (!value) {
          return;
        }
        this.Model = null;
        this.isValid = true;
        if (value.length === 10) {
          let val = value.substr(6, 4) + '/' + value.substr(3, 2) + '/' + value.substr(0, 2);
          if (new Date(val).toString() === 'Invalid Date') {
            this.isValid = false;
          } else {
            this.isValid = true;
            console.debug(val);
            this.Model = val;
          }
        }
      },
    },
    calendarModel: {
      get: function() {
        return this.Model ? date.formatDate(new Date(this.Model), this.mask) : '';
      },
      set: function(val) {
        let value = val;
        if (this.kind === 'datetime') {
          localISOString(new Date(val));
        }
        this.$refs.qDateProxy.hide();
        this.$refs.qTimeProxy.hide();
        this.Model = value;
        this.isValid = true;
      },
    },
    Model: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        this.set(value);
      },
    },
  },
};
</script>
