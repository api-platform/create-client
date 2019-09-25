import { mapActions, mapGetters, mapMutations, createNamespacedHelpers } from 'vuex';

export const create = module => {
  const { mapGetters, mapActions } = createNamespacedHelpers(`${module}/create`);
  const getters = mapGetters(['error', 'isLoading', 'created', 'violations']);
  const actions = mapActions(['create']);
  return { getters, actions };
};

export const list = module => {
  const getters = mapGetters({
    deletedItem: `${module}/del/deleted`,
    error: `${module}/list/error`,
    items: `${module}/list/items`,
    isLoading: `${module}/list/isLoading`,
    view: `${module}/list/view`,
    totalItems: `${module}/list/totalItems`,
  });
  const actions = mapActions({
    getPage: `${module}/list/getItems`,
    deleteItem: `${module}/del/del`,
  });
  return { getters, actions };
};

export const show = module => {
  const getters = mapGetters({
    deleteError: `${module}/del/error`,
    error: `${module}/show/error`,
    isLoading: `${module}/show/isLoading`,
    item: `${module}/show/retrieved`,
  });
  const actions = mapActions({
    del: `${module}/del/del`,
    reset: `${module}/show/reset`,
    retrieve: `${module}/show/retrieve`,
  });
  return { getters, actions };
};

export const update = module => {
  const getters = mapGetters({
    isLoading: `${module}/update/isLoading`,
    error: `${module}/update/error`,
    deleteError: `${module}/del/error`,
    deleteLoading: `${module}/del/isLoading`,
    deleted: `${module}/del/deleted`,
    retrieved: `${module}/update/retrieved`,
    updated: `${module}/update/updated`,
    violations: `${module}/update/violations`,
  });
  const actions = mapActions({
    createReset: `${module}/create/reset`,
    deleteItem: `${module}/del/del`,
    delReset: `${module}/del/reset`,
    retrieve: `${module}/update/retrieve`,
    updateReset: `${module}/update/reset`,
    update: `${module}/update/update`,
  });
  return { getters, actions };
};

export const form = modules => {
  let getters = {},
    actions = {},
    mutations = {};
  modules.forEach(({ name, module }) => {
    getters[`${name}SelectItems`] = `${module}/list/selectItems`;
    getters[`${name}SelectItemsTemplate`] = `${module}/list/selectItemsTemplate`;
    actions[`${name}GetSelectItems`] = `${module}/list/getSelectItems`;
    mutations[
      `${name}SetSelectItemsTemplate`
    ] = `${module}/list/${module.toUpperCase()}_LIST_SET_SELECT_ITEMS_TEMPLATE`;
  });
  return {
    getters: mapGetters(getters),
    actions: mapActions(actions),
    mutations: mapMutations(mutations),
  };
};
