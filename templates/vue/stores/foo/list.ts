import { defineStore } from "pinia";
import fetch from "@/utils/fetch";
import { extractHubURL } from "@/utils/mercure";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";
import type { View } from "@/types/view";
import type { ListState } from "@/types/stores";
import type { PagedCollection } from "@/types/collection";

interface State extends ListState<{{titleUcFirst}}> {}

export const use{{titleUcFirst}}ListStore = defineStore("{{lc}}List", {
  state: (): State => ({
    items: [],
    isLoading: false,
    error: undefined,
    hubUrl: undefined,
    view: undefined,
  }),

  actions: {
    async getItems() {
      this.setError("");
      this.toggleLoading();

      try {
        const response = await fetch("{{name}}");
        const data: PagedCollection<{{titleUcFirst}}> = await response.json();
        const hubUrl = extractHubURL(response);

        this.toggleLoading();

        this.setItems(data["hydra:member"]);
        this.setView(data["hydra:view"]);

        if (hubUrl) {
          this.setHubUrl(hubUrl);
        }
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

    setItems(items: {{titleUcFirst}}[]) {
      this.items = items;
    },

    setView(view: View) {
      this.view = view;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
    },

    setError(error: string) {
      this.error = error;
    },

    updateItem(updatedItem: {{titleUcFirst}}) {
      const item: {{titleUcFirst}} | undefined = this.items.find(
        (i) => i["@id"] === updatedItem["@id"]
      );

      if (!item) return;

      Object.assign(item, updatedItem);
    },

    deleteItem(deletedItem: {{titleUcFirst}}) {
      this.items = this.items.filter((item) => {
        return item["@id"] !== deletedItem["@id"];
      });
    },
  },
});
