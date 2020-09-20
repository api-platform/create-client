import { error } from '../../utils/notify';

export default {
  watch: {
    created(created) {
      this.onCreated(created);
    },

    error(message) {
      this.onError(message);
    },
  },

  methods: {
    onCreated(item) {
      item &&
        this.$router.push({
          name: `${this.$options.servicePrefix}Update`,
          params: { id: item['@id'] },
        });
    },

    onError(message) {
      message && error(message, this.$t('{{{labels.close}}}'));
    },

    onSendForm() {
      this.$refs.createForm.$children[0].validate().then(success => {
        if (success) {
          this.create(this.item);
        }
      });
    },

    resetForm() {
      this.item = {};
    },
  },
};
