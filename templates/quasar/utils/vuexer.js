import { mapActions, mapGetters, mapMutations, createNamespacedHelpers } from 'vuex';

export const create = module => {
  const lowmod = module.toLowerCase();
  const { mapGetters, mapActions } = createNamespacedHelpers(`${lowmod}/create`);
  const getters = mapGetters(['error', 'isLoading', 'created', 'violations']);
  const actions = mapActions(['create']);
  return { getters, actions };
};

export const list = module => {
  const lowmod = module.toLowerCase();
  const getters = mapGetters({
    deletedItem: `${lowmod}/del/deleted`,
    error: `${lowmod}/list/error`,
    items: `${lowmod}/list/items`,
    isLoading: `${lowmod}/list/isLoading`,
    view: `${lowmod}/list/view`,
    totalItems: `${lowmod}/list/totalItems`,
  });
  const actions = mapActions({
    getPage: `${lowmod}/list/getItems`,
    deleteItem: `${lowmod}/del/del`,
  });
  return { getters, actions };
};

export const show = module => {
  const lowmod = module.toLowerCase();
  const getters = mapGetters({
    deleteError: `${lowmod}/del/error`,
    error: `${lowmod}/show/error`,
    isLoading: `${lowmod}/show/isLoading`,
    item: `${lowmod}/show/retrieved`,
  });
  const actions = mapActions({
    del: `${lowmod}/del/del`,
    reset: `${lowmod}/show/reset`,
    retrieve: `${lowmod}/show/retrieve`,
  });
  return { getters, actions };
};

export const update = module => {
  const lowmod = module.toLowerCase();
  const getters = mapGetters({
    isLoading: `${lowmod}/update/isLoading`,
    error: `${lowmod}/update/error`,
    deleteError: `${lowmod}/del/error`,
    deleteLoading: `${lowmod}/del/isLoading`,
    deleted: `${lowmod}/del/deleted`,
    retrieved: `${lowmod}/update/retrieved`,
    updated: `${lowmod}/update/updated`,
    violations: `${lowmod}/update/violations`,
  });
  const actions = mapActions({
    createReset: `${lowmod}/create/reset`,
    deleteItem: `${lowmod}/del/del`,
    delReset: `${lowmod}/del/reset`,
    retrieve: `${lowmod}/update/retrieve`,
    updateReset: `${lowmod}/update/reset`,
    update: `${lowmod}/update/update`,
  });
  return { getters, actions };
};

export const form = modules => {
  let getters = {},
    actions = {},
    mutations = {};
  modules.forEach(({ name, module }) => {
    const lowmod = module.toLowerCase();
    getters[`${name}SelectItems`] = `${lowmod}/list/selectItems`;
    getters[`${name}SelectItemsTemplate`] = `${lowmod}/list/selectItemsTemplate`;
    actions[`${name}GetSelectItems`] = `${lowmod}/list/getSelectItems`;
    mutations[
      `${name}SetSelectItemsTemplate`
    ] = `${lowmod}/list/${module.toUpperCase()}_LIST_SET_SELECT_ITEMS_TEMPLATE`;
  });
  return {
    getters: mapGetters(getters),
    actions: mapActions(actions),
    mutations: mapMutations(mutations),
  };
};
