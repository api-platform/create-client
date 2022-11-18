import { defineStore } from 'pinia';
import fetch from 'src/utils/fetch';
import { {{titleUcFirst}} } from 'src/types/{{lc}}';
import { View } from 'src/types/view';
import { extractHubURL } from 'src/utils/mercure';
import type { PagedCollection } from 'src/types/collection';

interface State {
  items: {{titleUcFirst}}[];
  totalItems: number;
  hubUrl?: URL;
  isLoading: boolean;
  view?: View;
  error?: string;
}

export const use{{titleUcFirst}}ListStore = defineStore('{{lc}}List', {
  state: (): State => ({
    items: [],
    totalItems: 0,
    hubUrl: undefined,
    isLoading: false,
    view: undefined,
    error: undefined,
  }),

  actions: {
    getItems(params: any) {
      this.toggleLoading();

      return fetch('{{name}}', { params })
        .then((response: Response) =>
          response.json().then((data: PagedCollection<{{titleUcFirst}}>) => ({
            data,
            hubUrl: extractHubURL(response),
          }))
        )
        .then(
          ({ data, hubUrl }: { data: PagedCollection<{{titleUcFirst}}>; hubUrl?: URL }) => {
            this.toggleLoading();
            this.setItems(data['{{hydraPrefix}}member']);
            this.setTotalItems(data['{{hydraPrefix}}totalItems'] ?? 0);
            this.setView(data['{{hydraPrefix}}view']);

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

    setItems(items: {{titleUcFirst}}[]) {
      this.items = items;
    },

    setTotalItems(totalItems: number) {
      this.totalItems = totalItems;
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
        (i) => i['@id'] === updatedItem['@id']
      );

      if (!item) return;

      Object.assign(item, updatedItem);
    },

    deleteItem(deletedItem: {{titleUcFirst}}) {
      this.items = this.items.filter((item) => {
        return item['@id'] !== deletedItem['@id'];
      });
    },
  },
});
