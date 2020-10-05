import isEmpty from 'lodash/isEmpty';
import { formatDateTime } from '../utils/dates';
import notification from './notification';

export default {
  mixins: [notification],

  async fetch({ store }) {
    await store.dispatch('{{{lc}}}/fetchAll')
  },

  data() {
    return {
      options: {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 15
      },
      filters: {}
    };
  },

  watch: {
    deletedItem(item) {
      this.showMessage(`${item['@id']} deleted.`);
    },

    error(message) {
      message && this.showError(message);
    },

    items() {
      this.options.totalItems = this.totalItems;
    }
  },

  methods: {
    onUpdateOptions({ page, itemsPerPage, sortBy, sortDesc, totalItems } = {}) {
      let params = {
        ...this.filters
      };
      if (itemsPerPage > 0) {
        params = { ...params, itemsPerPage, page };
      }

      if (!isEmpty(sortBy) && !isEmpty(sortDesc)) {
        params[`order[${sortBy[0]}]`] = sortDesc[0] ? 'desc' : 'asc'
      }

      this.resetList = true;

      Object.assign(this.options, {
        sortBy,
        sortDesc,
        itemsPerPage,
        totalItems
      });

      this.fetchAll(params);
    },

    onSendFilter() {
      this.resetList = true;
      this.onUpdateOptions(this.options);
    },

    resetFilter() {
      this.filters = {};
      this.onSendFilter();
    },

    addHandler() {
      this.$router.push({ name: `${this.$options.servicePrefix}-new` });
    },

    showHandler(item) {
      this.$router.push({
        name: `${this.$options.servicePrefix}-id`,
        params: { id: item['@id'] }
      });
    },

    editHandler(item) {
      this.$router.push({
        name: `${this.$options.servicePrefix}-id`,
        params: { id: item['@id'] }
      });
    },

    deleteHandler(item) {
      this.deleteItem(item).then(() => this.onUpdateOptions(this.options));
    },
    formatDateTime
  }
};
