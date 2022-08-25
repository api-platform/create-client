import * as types from './mutation_types';

export default {
  [types.RESET](state) {
    Object.assign(state, {
      error: '',
      isLoading: false,
      items: [],
      hubUrl: null,
      selectItems: null,
      view: [],
    });
  },

  [types.SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.SET_ITEMS](state, items) {
    Object.assign(state, {
      error: '',
      items,
    });
  },

  [types.SET_HUB_URL](state, hubUrl) {
    Object.assign(state, { hubUrl });
  },

  [types.SET_SELECT_ITEMS](state, selectItems) {
    Object.assign(state, { selectItems });
  },

  [types.UPDATE_ITEM](state, updatedItem) {
    const item = state.items.find((i) => i["id"] === updatedItem["id"]);
    Object.assign(item, updatedItem);
  },

  [types.DELETE_ITEM](state, deletedItem) {
    Object.assign(state, {
      items: state.items.filter(
        item => item['@id'] !== deletedItem['@id']
      )
    });
  },

  [types.TOGGLE_LOADING](state) {
    Object.assign(state, { isLoading: !state.isLoading });
  },

  [types.SET_VIEW](state, view) {
    Object.assign(state, { view });
  },
};
