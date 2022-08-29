import notification from './notification';
import { formatDateTime } from '../utils/dates';
import { getPath } from '../utils/fetch';

export default {
  mixins: [notification],
  methods: {
    formatDateTime,
    onCreated(item) {
      this.showMessage(`${item['@id']} created`);

      this.$router.push(getPath(item['@id'], this.$options.pathTemplate));
    },
    onSendForm() {
      const createForm = this.$refs.createForm;
      createForm.$v.$touch();
      if (!createForm.$v.$invalid) {
        this.create(createForm.$v.item.$model);
      }
    },
    resetForm() {
      this.$refs.createForm.$v.$reset();
      this.item = {};
    }
  },
  watch: {
    created(created) {
      if (!created) {
        return;
      }

      this.onCreated(created);
    },

    error(message) {
      message && this.showError(message);
    }
  }
};
