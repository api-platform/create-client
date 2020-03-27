import { extractDate } from '../../utils/dates';

export default {
  created() {
    this.onCreated();
  },

  beforeDestroy() {
    this.onBeforeDestroy();
  },

  watch: {
    error(message) {
      this.onShowError(message);
    },

    deleteError(message) {
      this.onDeletedError(message);
    },
  },

  methods: {
    onCreated() {
      this.retrieve(decodeURIComponent(this.$route.params.id));
    },

    onBeforeDestroy() {
      this.reset();
    },

    onShowError(message) {
      message &&
        this.$q.notify({
          message,
          color: 'red',
          icon: 'error',
          closeBtn: this.$t('{{{labels.close}}}'),
        });
    },

    onDeletedError(message) {
      message &&
        this.$q.notify({
          message,
          color: 'red',
          icon: 'error',
          closeBtn: this.$t('{{{labels.close}}}'),
        });
    },

    formatDateTime(val, format) {
      return val ? this.$d(extractDate(val), format) : '';
    },

    deleteItem() {
      this.deleteItem(this.item).then(() =>
        this.$router.push({ name: `${this.$options.servicePrefix}List` })
      );
    },
  },
};
