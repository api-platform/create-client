import { mercureSubscribe } from "../utils/mercure";

export default {
  watch: {
    item: {
      immediate: true,
      handler(newItem) {
        if (!this.hubUrl) {
          return;
        }

        if (this.mercureSub) {
          this.mercureSub.close();
        }

        if (!newItem) {
          return;
        }

        this.mercureSub = mercureSubscribe(this.hubUrl, [newItem["@id"]], this.mercureEl);
      },
    },
  },

  beforeCreate() {
    this.mercureEl = (data) => {
      if (1 === Object.keys(data).length) {
        this.$store.commit(this.itemMercureDeletedMutation, data);
        return;
      }

      this.$store.commit(this.itemUpdateMutation, data);
    }
  },

  beforeDestroy() {
    if (this.mercureSub) {
      this.mercureSub.close();
    }
  },

  render() {
    return this.$scopedSlots.default();
  },
};
