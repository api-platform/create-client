import Vue from "vue";
import { getField, updateField } from "vuex-map-fields";
import remove from "lodash/remove";
import SubmissionError from "../error/SubmissionError";

const initialState = () => ({
  allIds: [],
  byId: {},
  created: null,
  deleted: null,
  error: "",
  isLoading: false,
  resetList: false,
  selectItems: null,
  totalItems: 0,
  updated: null,
  view: null,
  violations: null,
});

const handleError = (commit, e) => {
  commit(ACTIONS.TOGGLE_LOADING);

  if (e instanceof SubmissionError) {
    commit(ACTIONS.SET_VIOLATIONS, e.errors);
    // eslint-disable-next-line
    commit(ACTIONS.SET_ERROR, e.errors._error);

    return Promise.reject(e);
  }

  // eslint-disable-next-line
  commit(ACTIONS.SET_ERROR, e.message);

  return Promise.reject(e);
};

export const ACTIONS = {
  ADD: "ADD",
  RESET_CREATE: "RESET_CREATE",
  RESET_DELETE: "RESET_DELETE",
  RESET_LIST: "RESET_LIST",
  RESET_SHOW: "RESET_SHOW",
  RESET_UPDATE: "RESET_UPDATE",
  SET_CREATED: "SET_CREATED",
  SET_DELETED: "SET_DELETED",
  SET_ERROR: "SET_ERROR",
  SET_SELECT_ITEMS: "SET_SELECT_ITEMS",
  SET_TOTAL_ITEMS: "SET_TOTAL_ITEMS",
  SET_UPDATED: "SET_UPDATED",
  SET_VIEW: "SET_VIEW",
  SET_VIOLATIONS: "SET_VIOLATIONS",
  TOGGLE_LOADING: "TOGGLE_LOADING",
};

export default function makeCrudModule({
  normalizeRelations = (x) => x,
  resolveRelations = (x) => x,
  service,
} = {}) {
  return {
    actions: {
      create: ({ commit }, values) => {
        commit(ACTIONS.SET_ERROR, "");
        commit(ACTIONS.TOGGLE_LOADING);

        return service
          .create(values)
          .then((response) => response.json())
          .then((data) => {
            commit(ACTIONS.TOGGLE_LOADING);
            commit(ACTIONS.ADD, data);
            commit(ACTIONS.SET_CREATED, data);
          })
          .catch((e) => handleError(commit, e));
      },
      del: ({ commit }, item) => {
        commit(ACTIONS.TOGGLE_LOADING);

        return service
          .del(item)
          .then(() => {
            commit(ACTIONS.TOGGLE_LOADING);
            commit(ACTIONS.SET_DELETED, item);
          })
          .catch((e) => handleError(commit, e));
      },
      fetchAll: ({ commit, state }, params) => {
        if (!service) throw new Error("No service specified!");

        commit(ACTIONS.TOGGLE_LOADING);

        return service
          .findAll({ params })
          .then((response) => response.json())
          .then((retrieved) => {
            commit(ACTIONS.TOGGLE_LOADING);

            commit(
              ACTIONS.SET_TOTAL_ITEMS,
              retrieved["{{{hydraPrefix}}}totalItems"]
            );
            commit(ACTIONS.SET_VIEW, retrieved["{{{hydraPrefix}}}view"]);

            if (true === state.resetList) {
              commit(ACTIONS.RESET_LIST);
            }

            retrieved["{{{hydraPrefix}}}member"].forEach((item) => {
              commit(ACTIONS.ADD, normalizeRelations(item));
            });
          })
          .catch((e) => handleError(commit, e));
      },
      fetchSelectItems: (
        { commit },
        { params = { properties: ["@id", "name"] } } = {}
      ) => {
        commit(ACTIONS.TOGGLE_LOADING);

        if (!service) throw new Error("No service specified!");

        return service
          .findAll({ params })
          .then((response) => response.json())
          .then((retrieved) => {
            commit(
              ACTIONS.SET_SELECT_ITEMS,
              retrieved["{{{hydraPrefix}}}member"]
            );
          })
          .catch((e) => handleError(commit, e));
      },
      load: ({ commit }, id) => {
        if (!service) throw new Error("No service specified!");

        commit(ACTIONS.TOGGLE_LOADING);
        return service
          .find(id)
          .then((response) => response.json())
          .then((item) => {
            commit(ACTIONS.TOGGLE_LOADING);
            commit(ACTIONS.ADD, normalizeRelations(item));
          })
          .catch((e) => handleError(commit, e));
      },
      resetCreate: ({ commit }) => {
        commit(ACTIONS.RESET_CREATE);
      },
      resetDelete: ({ commit }) => {
        commit(ACTIONS.RESET_DELETE);
      },
      resetShow: ({ commit }) => {
        commit(ACTIONS.RESET_SHOW);
      },
      resetUpdate: ({ commit }) => {
        commit(ACTIONS.RESET_UPDATE);
      },
      update: ({ commit }, item) => {
        commit(ACTIONS.SET_ERROR, "");
        commit(ACTIONS.TOGGLE_LOADING);

        return service
          .update(item)
          .then((response) => response.json())
          .then((data) => {
            commit(ACTIONS.TOGGLE_LOADING);
            commit(ACTIONS.SET_UPDATED, data);
          })
          .catch((e) => handleError(commit, e));
      },
    },
    getters: {
      find: (state) => (id) => {
        return resolveRelations(state.byId[id]);
      },
      getField,
      list: (state, getters) => {
        return state.allIds.map((id) => getters.find(id));
      },
    },
    mutations: {
      updateField,
      [ACTIONS.ADD]: (state, item) => {
        Vue.set(state.byId, item["@id"], item);
        Vue.set(state, "isLoading", false);
        if (state.allIds.includes(item["@id"])) return;
        state.allIds.push(item["@id"]);
      },
      [ACTIONS.RESET_CREATE]: (state) => {
        Object.assign(state, {
          isLoading: false,
          error: "",
          created: null,
          violations: null,
        });
      },
      [ACTIONS.RESET_DELETE]: (state) => {
        Object.assign(state, {
          isLoading: false,
          error: "",
          deleted: null,
        });
      },
      [ACTIONS.RESET_LIST]: (state) => {
        Object.assign(state, {
          allIds: [],
          byId: {},
          error: "",
          isLoading: false,
          resetList: false,
        });
      },
      [ACTIONS.RESET_SHOW]: (state) => {
        Object.assign(state, {
          error: "",
          isLoading: false,
        });
      },
      [ACTIONS.RESET_UPDATE]: (state) => {
        Object.assign(state, {
          error: "",
          isLoading: false,
          updated: null,
          violations: null,
        });
      },
      [ACTIONS.SET_CREATED]: (state, created) => {
        Object.assign(state, { created });
      },
      [ACTIONS.SET_DELETED]: (state, deleted) => {
        if (!state.allIds.includes(deleted["@id"])) return;
        Object.assign(state, {
          allIds: remove(
            state.allIds,
            (item) => item["@id"] === deleted["@id"]
          ),
          byId: remove(state.byId, (id) => id === deleted["@id"]),
          deleted,
        });
      },
      [ACTIONS.SET_ERROR]: (state, error) => {
        Object.assign(state, { error, isLoading: false });
      },
      [ACTIONS.SET_SELECT_ITEMS]: (state, selectItems) => {
        Object.assign(state, {
          error: "",
          isLoading: false,
          selectItems,
        });
      },
      [ACTIONS.SET_TOTAL_ITEMS]: (state, totalItems) => {
        Object.assign(state, { totalItems });
      },
      [ACTIONS.SET_UPDATED]: (state, updated) => {
        Object.assign(state, {
          byId: {
            [updated["@id"]]: updated,
          },
          updated,
        });
      },
      [ACTIONS.SET_VIEW]: (state, view) => {
        Object.assign(state, { view });
      },
      [ACTIONS.SET_VIOLATIONS]: (state, violations) => {
        Object.assign(state, { violations });
      },
      [ACTIONS.TOGGLE_LOADING]: (state) => {
        Object.assign(state, { error: "", isLoading: !state.isLoading });
      },
    },
    namespaced: true,
    state: initialState,
  };
}
