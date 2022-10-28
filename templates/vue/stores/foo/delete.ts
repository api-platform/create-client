import { defineStore } from "pinia";
import fetch from "@/utils/fetch";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";
import type { DeleteState } from "@/types/stores";

interface State extends DeleteState<{{titleUcFirst}}> {}

export const use{{titleUcFirst}}DeleteStore = defineStore("{{lc}}Delete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
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
          this.setMercureDeleted(undefined);
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

    setMercureDeleted(mercureDeleted: {{titleUcFirst}} | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
