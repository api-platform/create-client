import { mercureSubscribe } from "../utils/mercure";

export default {
  watch: {
    items: {
      immediate: true,
      handler(newItems) {
        if (!this.hubUrl) {
          return;
        }

        if (this.mercureSub) {
          this.mercureSub.close();
        }

        if (!newItems) {
          return;
        }

        this.mercureSub = mercureSubscribe(this.hubUrl, newItems.map(i => i['@id']), this.mercureEl);
      },
    },
  },

  beforeCreate() {
    this.mercureEl = (data) => {
      if (1 === Object.keys(data).length) {
        this.$store.commit(this.itemDeleteMutation, data);
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
