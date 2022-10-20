import { defineStore } from "pinia";
import fetch from "@/utils/fetch";
import { extractHubURL } from "@/utils/mercure";
import type { {{{titleUcFirst}}}, View } from "@/utils/types";

interface ResponseData {
  "hydra:member": {{{titleUcFirst}}}[];
  "hydra:view": View;
}

interface State {
  isLoading: boolean;
  error: string;
  items: {{{titleUcFirst}}}[];
  hubUrl: URL | null;
  view: View | null;
}

export const use{{{titleUcFirst}}}ListStore = defineStore("{{{lc}}}List", {
  state: (): State => ({
    isLoading: false,
    error: "",
    items: [],
    hubUrl: null,
    view: null,
  }),

  actions: {
    getItems(page: string = "{{{name}}}") {
      this.setError("");
      this.toggleLoading();

      return fetch(page)
        .then((response: Response) =>
          response.json().then((data: ResponseData) => ({
            data,
            hubUrl: extractHubURL(response),
          }))
        )
        .then(
          ({ data, hubUrl }: { data: ResponseData; hubUrl: URL | null }) => {
            this.setError("");
            this.toggleLoading();

            this.setItems(data["hydra:member"]);
            this.setView(data["hydra:view"]);

            if (hubUrl) {
              this.setHubUrl(hubUrl);
            }
          }
        )
        .catch((e: Error) => {
          this.toggleLoading();
          this.setError(e.message);
        });
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setItems(items: {{{titleUcFirst}}}[]) {
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

    updateItem(updatedItem: {{{titleUcFirst}}}) {
      const item: {{{titleUcFirst}}} | undefined = this.items.find(
        (i) => i["@id"] === updatedItem["@id"]
      );

      if (!item) return;

      Object.assign(item, updatedItem);
    },

    deleteItem(deletedItem: {{{titleUcFirst}}}) {
      this.items = this.items.filter((item) => {
        return item["@id"] !== deletedItem["@id"];
      });
    },
  },
});
