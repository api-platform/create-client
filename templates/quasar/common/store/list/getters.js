const error = state => state.error;
const isLoading = state => state.isLoading;
const items = state => state.items;
const selectItems = state => state.selectItems;
const selectItemsTemplate = state => state.selectItemsTemplate;
const view = state => state.view;
const totalItems = state => state.totalItems;

export { error, isLoading, items, selectItems, selectItemsTemplate, view, totalItems };
