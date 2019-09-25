import { extractDate } from '../../utils/dates';

export default {
  created() {
    this.retrieve(decodeURIComponent(this.$route.params.id));
  },
  beforeDestroy() {
    this.reset();
  },
  watch: {
    error(message) {
      message &&
        this.$q.notify({
          message,
          color: 'red',
          icon: 'error',
          closeBtn: this.$t('{{{labels.close}}}'),
        });
    },

    deleteError(message) {
      message &&
        this.$q.notify({
          message,
          color: 'red',
          icon: 'error',
          closeBtn: this.$t('{{{labels.close}}}'),
        });
    },
  },

  methods: {
    formatDateTime(val, format) {
      return val ? this.$d(extractDate(val), format) : '';
    },

    deleteItem() {
      this.deleteItem(this.item).then(() => this.$router.push({ name: `${this.$options.servicePrefix}List` }));
    },
  },
};
