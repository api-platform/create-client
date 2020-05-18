import isEmpty from 'lodash/isEmpty';
import { formatDateTime } from '../utils/dates';
import NotificationMixin from './NotificationMixin';

export default {
  mixins: [NotificationMixin],

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

      this.getPage(params).then(() => {
        this.options.sortBy = sortBy;
        this.options.sortDesc = sortDesc;
        this.options.itemsPerPage = itemsPerPage;
        this.options.totalItems = totalItems;
      });
    },

    onSendFilter() {
      this.resetList = true;
      this.onUpdateOptions(this.options);
    },

    resetFilter() {
      this.filters = {};
    },

    addHandler() {
      this.$router.push({ name: `${this.$options.servicePrefix}Create` });
    },

    showHandler(item) {
      this.$router.push({
        name: `${this.$options.servicePrefix}Show`,
        params: { id: item['@id'] }
      });
    },

    editHandler(item) {
      this.$router.push({
        name: `${this.$options.servicePrefix}Update`,
        params: { id: item['@id'] }
      });
    },

    deleteHandler(item) {
      this.deleteItem(item).then(() => this.onUpdateOptions(this.options));
    },
    formatDateTime
  }
};
