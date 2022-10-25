import { defineStore } from "pinia";
import fetch from "@/utils/fetch";
import type { {{titleUcFirst}} } from "@/utils/types";

interface State {
  isLoading: boolean;
  error: string;
  deleted: {{titleUcFirst}} | null;
  mercureDeleted: {{titleUcFirst}} | null;
}

export const use{{titleUcFirst}}DeleteStore = defineStore("{{lc}}Delete", {
  state: (): State => ({
    isLoading: false,
    error: "",
    deleted: null,
    mercureDeleted: null,
  }),

  actions: {
    deleteItem(item: {{titleUcFirst}}) {
      this.setError("");
      this.toggleLoading();

      return fetch(item["@id"] ?? "", { method: "DELETE" })
        .then(() => {
          this.setError("");
          this.toggleLoading();
          this.setDeleted(item);
          this.setMercureDeleted(null);
        })
        .catch((e: Error) => {
          this.toggleLoading();
          this.setError(e.message);
        });
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setDeleted(deleted: {{titleUcFirst}}) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: {{titleUcFirst}} | null) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
