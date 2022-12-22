import { defineStore } from "pinia";
import { {{titleUcFirst}} } from "~~/types/{{lc}}";
import { PagedCollection } from "~~/types/collection";
import { View } from "~~/types/view";
import api from "~~/utils/api";

interface State {
  items: {{titleUcFirst}}[];
  hubUrl?: URL;
  isLoading: boolean;
  view?: View;
  error?: string;
}

export const use{{titleUcFirst}}ListStore = defineStore("{{lc}}List", {
  state: (): State => ({
    items: [],
    isLoading: false,
    error: undefined,
    hubUrl: undefined,
    view: undefined,
  }),

  actions: {
    async getItems(page?: string) {
      this.setLoading(true);

      try {
        const path = page ? `{{name}}?page=${page}` : "{{name}}";
        const response = await api(path);
        const data: PagedCollection<{{titleUcFirst}}> = await response.json();
        const hubUrl = extractHubURL(response);

        this.setLoading(false);

        this.setItems(data["hydra:member"]);
        this.setView(data["hydra:view"]);

        if (hubUrl) {
          this.setHubUrl(hubUrl);
        }
      } catch (error) {
        this.setLoading(false);

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
    },

    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setItems(items: {{titleUcFirst}}[]) {
      this.items = items;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
    },

    setView(view: View) {
      this.view = view;
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
