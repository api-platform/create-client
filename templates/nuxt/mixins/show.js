import notification from './notification';
import { formatDateTime } from '../utils/dates';

export default {
  mixins: [notification],
  created() {
    this.retrieve(decodeURIComponent(this.$route.params.id));
  },
  computed: {
    item() {
      return this.find(decodeURIComponent(this.$route.params.id));
    }
  },
  methods: {
    del() {
      this.deleteItem(this.item).then(() => {
        this.showMessage(`${this.item['@id']} deleted.`);
        this.$router
          .push({ name: `${this.$options.servicePrefix}` })
          .catch(() => {});
      });
    },
    formatDateTime,
    editHandler() {
      this.$router.push({
        name: `${this.$options.servicePrefix}-id`,
        params: { id: this.item['@id'] }
      });
    }
  },
  watch: {
    error(message) {
      message && this.showError(message);
    },
    deleteError(message) {
      message && this.showError(message);
    }
  },
  beforeDestroy() {
    this.reset();
  }
};
