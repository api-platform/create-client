import notification from './notification';
import { formatDateTime } from '../utils/dates';

export default {
  mixins: [notification],
  created() {
    this.retrieve(`/${this.$options.name}/${this.$route.params.id}`);
  },
  beforeDestroy() {
    this.reset();
  },
  computed: {
    item() {
      return this.find(`/${this.$options.name}/${this.$route.params.id}`);
    }
  },
  methods: {
    del() {
      this.deleteItem(this.item).then(() => {
        this.showMessage(`${this.deleted['@id']} deleted.`);
        this.$router.push(`/${this.$options.servicePrefix}`)
      });
    },
    formatDateTime,
    reset() {
      this.delReset();
    },
  },
  watch: {
    error(message) {
      message && this.showError(message);
    },
    deleteError(message) {
      message && this.showError(message);
    }
  }
};
