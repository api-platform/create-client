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
    async deleteItem(item: {{titleUcFirst}}) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No {{lc}} found. Please reload");
        return;
      }

      try {
        await fetch(item["@id"], { method: "DELETE" });

        this.toggleLoading();
        this.setDeleted(item);
        this.setMercureDeleted(undefined);
      } catch (error) {
        this.toggleLoading();

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
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
