import { defineStore } from "pinia";
import type { {{titleUcFirst}} } from "~~/types/{{lc}}";

interface State {
  deleted?: {{titleUcFirst}};
  mercureDeleted?: {{titleUcFirst}};
  isLoading: boolean;
  error?: string;
}

export const use{{titleUcFirst}}DeleteStore = defineStore("{{lc}}Delete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setDeleted(deleted: {{titleUcFirst}}) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: {{titleUcFirst}} | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
