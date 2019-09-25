import { error } from '../../utils/notify';

export default {
  watch: {
    created(created) {
      if (!created) {
        return;
      }

      this.$router.push({ name: `${this.$options.servicePrefix}Update`, params: { id: created['@id'] } });
    },

    error(message) {
      message && error(message, this.$t('Close'));
    },
  },

  methods: {
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
