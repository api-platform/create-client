import { error, success } from '../../utils/notify';

export default {
  data() {
    return {
      item: {},
    };
  },

  created() {
    this.onCreated();
  },

  beforeDestroy() {
    this.onBeforeDestroy();
  },

  watch: {
    error(message) {
      this.onUpdateError(message);
    },

    deleteError(message) {
      this.onDeleteError(message);
    },

    updated(val) {
      this.onUpdated(val);
    },

    retrieved(val) {
      this.item = { ...val };
    },
  },

  methods: {
    del() {
      this.deleteItem(this.retrieved).then(() =>
        this.$router
          .push({ name: `${this.$options.servicePrefix}List` })
          .catch(() => {})
      );
    },

    reset() {
      this.updateReset();
      this.delReset();
      this.createReset();
    },

    onSendForm() {
      this.$refs.updateForm.$children[0].validate().then(success => {
        if (success) {
          this.update(this.item);
        }
      });
    },

    resetForm() {
      this.item = { ...this.retrieved };
    },

    onCreated() {
      this.retrieve(decodeURIComponent(this.$route.params.id));
    },

    onBeforeDestroy() {
      this.reset();
    },

    onUpdated(val) {
      success(`${val['@id']} ${this.$t('{{{labels.updated}}}')}.`, this.$t('{{{labels.close}}}'));
    },

    onUpdateError(message) {
      message && error(message, this.$t('{{{labels.close}}}'));
    },

    onDeleteError(message) {
      message && error(message, this.$t('{{{labels.close}}}'));
    },
  },
};
